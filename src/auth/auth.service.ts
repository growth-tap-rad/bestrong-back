import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dtos/auth.dto';
import { UserDto } from 'src/users/dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GenderEnum, User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { hashPassword } from 'src/utils/hashPassword';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async signIn(userDto: UserDto): Promise<AuthDto> {
    const user = await this.usersRepository.findOneBy({
      email: userDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas!');
    }
    const passwordMatch = await this.comparePassword(
      userDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException();
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
      const parsedBirthday = new Date(user.birthday);
      if (isNaN(Number(parsedBirthday))) {
        errors.push('O campo "birthday" não contem uma data válida');
      } else {
        newUser.birthday = parsedBirthday;
      }
    }
    if (!user.password) {
      errors.push('O campo "password" é obrigatório.');
    }

    if (
      user.gender &&
      user.gender !== GenderEnum.Man &&
      user.gender !== GenderEnum.Women
    ) {
      throw new BadRequestException(
        'Gênero inválido. Apenas "man" ou "woman" são permitidos.',
      );
    }
    if (errors.length > 0) {
      throw new BadRequestException(errors.join(' '));
    }

    newUser.name = user.name;
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.gender = user.gender;

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
