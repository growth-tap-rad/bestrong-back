import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  show(@Request() request: Request): Promise<User> {
    return this.usersService.findById(request['user'].id);
  }

  @UseGuards(AuthGuard)
  @Get('')
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

}
