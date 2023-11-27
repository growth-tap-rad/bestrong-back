import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserDto } from 'src/users/dtos/user.dto';
import { hashPassword } from 'src/utils/hashPassword';
import { GenderEnum, User } from '../users/user.entity';
import { AuthDto } from './dtos/auth.dto';
import * as moment from 'moment-timezone';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }
  async signIn(userDto: UserDto): Promise<AuthDto> {
    const user = await this.usersRepository.findOneBy({
      email: userDto.email.toLowerCase(),
    });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const passwordMatch = await this.comparePassword(
      userDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas!');
    }
    const payload = { id: user.id, email: user.email };
    return new AuthDto(await this.jwtService.signAsync(payload));
  }

  async signUp(user: UserDto): Promise<object> {
    let newUser = new User();
    const errors = [];

    if (!user.name) {
      errors.push('O campo "name" é obrigatório.');
    }
    if (!user.username) {
      errors.push('O campo "username" é obrigatório.');
    }
    if (!user.email) {
      errors.push('O campo "email" é obrigatório.');
    } else {
      const hasUserSameEmail = await this.findUserByEmail(user.email);
      if (hasUserSameEmail) {
        errors.push('Email já cadastrado');
      }
    }
    if (!user.birthday) {
      errors.push('O campo "birthday" é obrigatório.');
    } else {
      const parsedBirthday = moment(user.birthday, 'YYYY-MM-DD', true);
      if (!parsedBirthday.isValid()) {
        errors.push('O campo "birthday" não contem uma data válida');
      } else {
        newUser.birthday = parsedBirthday.toDate();
      }
    }
    if (!user.password) {
      errors.push('O campo "password" é obrigatório.');
    }

    if (
      user.gender &&
      user.gender !== GenderEnum.man &&
      user.gender !== GenderEnum.woman
    ) {
      throw new BadRequestException(
        'Gênero inválido. Apenas "man" ou "woman" são permitidos.',
      );
    }
    if (errors.length > 0) {
      throw new BadRequestException(errors.join(' '));
    }
    Object.assign(newUser, user)
    newUser.email = user.email.toLowerCase();
    newUser.password = await hashPassword(user.password);
    const userToSend = await this.usersRepository.save(newUser);
    const accessToken = await this.jwtService.signAsync({
      id: newUser.id,
      email: newUser.email,
    });

    delete userToSend.password;

    return { user: userToSend, accessToken };
  }

  private async comparePassword(
    providedPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(providedPassword, hashedPassword);
  }

  private findUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email: email });
  }
}
