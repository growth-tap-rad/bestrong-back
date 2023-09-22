import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './dtos/user.dto';
import { hashPassword } from 'src/utils/hashPassword';
import { Diary } from 'src/diary/diary.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) { }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email: email });
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.progress', 'progress')
      .where('user.id = :userId', { userId })
      .getOne();

    delete user.password;

    return user;
  }

  async update(id: number, userDto: UserDto): Promise<User> {
    let foundUser = await this.findById(id);

    const { name, username, email, birthday, gender, password } = userDto;

    // Tratar com ifs...
    foundUser.name = name;
    foundUser.username = username;
    foundUser.email = email;
    foundUser.birthday = birthday;
    foundUser.gender = gender;

    if (password) {
      foundUser.password = await hashPassword(password);
    }

    const userToSend = await this.usersRepository.save(foundUser);
    delete userToSend.password;

    return userToSend;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.progress', 'progress')
      .getMany();

    return users.map((user) => {
      delete user.password;
      return user;
    });
  }
}
