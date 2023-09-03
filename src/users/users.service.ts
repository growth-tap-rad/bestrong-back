import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './dtos/user.dto';
import { hashPassword } from 'src/utils/hashPassword';

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

  getUsers(): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.progress', 'progress')
      .getMany(); // Todo: Deletar senha da query
  }
}
