import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email: email });
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  getUsers(): Promise<User[]> {
    return this.usersRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.progress', 'progress')
    .getMany();
  }

}
