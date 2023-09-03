import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dtos/auth.dto';
import { UserDto } from 'src/users/dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
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
      throw new UnauthorizedException();
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

    newUser.name = user.name;
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.birthday = user.birthday;
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
}
