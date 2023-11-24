import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './dtos/user.dto';
import { hashPassword } from 'src/utils/hashPassword';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) { }

  async findOneByEmail(email: string): Promise<Boolean> {
    const foundEmail = await this.usersRepository.findOneBy({ email: email });
    let hasEmail = false;

    if (foundEmail && foundEmail.id) {
      hasEmail = true;
    }
    return hasEmail;
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  async getUser(userId: number): Promise<User> {

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.progress', 'progress')
      .where('user.id = :userId', { userId })
      .orderBy('user.id', 'ASC')
      .getOne();

    delete user.password;
    return user;
  }

  async update(id: number, userDto: UserDto): Promise<User> {
    let foundUser = await this.findById(id);

    Object.assign(foundUser, userDto);

    if (userDto.password) {
      foundUser.password = await hashPassword(userDto.password);
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
