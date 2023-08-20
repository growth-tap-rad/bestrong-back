import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
    test() {
      return this.usersService.test();
    }

  @UseGuards(AuthGuard)
  @Get(':id')
    show(@Param('id') id: number, @Request() req): Promise<User> {
      return this.usersService.findById(id);
  }


  



}
