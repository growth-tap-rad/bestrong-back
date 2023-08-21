import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dtos/auth.dto';
import { UserDto } from 'src/users/dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(userDto: UserDto): Promise<AuthDto> {
    const user = await this.usersRepository.findOneBy({
      email: userDto.email,
      password: userDto.password,
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, email: user.email };
    return new AuthDto(await this.jwtService.signAsync(payload));
  }

  signUp(user: UserDto): Promise<User> {
    let newUser = new User();
    newUser.name = user.name;
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.birthday = user.birthday;
    newUser.height = user.height;
    newUser.weight = user.weight;
    newUser.activity_level = user.activity_level;
    newUser.goal = user.goal;

    return this.usersRepository.save(user);
  }
}
