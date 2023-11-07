import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UserDto } from './dtos/user.dto';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  show(@Request() request: Request): Promise<User> {
    return this.usersService.getUser(request['user'].id);
  }

  @UseGuards(AuthGuard)
  @Put('/me')
  update(@Request() request: Request, @Body() userDto: UserDto): Promise<User> {
    return this.usersService.update(request['user'].id, userDto);
  }

  @UseGuards(AuthGuard)
  @Get('')
  showUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  // Perguntar se posso ter essa rota sem autheticacao...
  @Get('/verify-email')
  verifyEmail(@Query('email') email: string): Promise<Boolean> {

    return this.usersService.findOneByEmail(email);
  }
}
