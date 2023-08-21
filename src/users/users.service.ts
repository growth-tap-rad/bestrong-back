
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ){}

  test(): string{
    return 'Service working..'
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({id: id});
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({email: email})
  }
}