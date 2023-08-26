import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UserDto } from 'src/users/dtos/user.dto';
import { User } from '../users/user.entity';
import { AuthDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  createUser(@Body() createUser: UserDto): Promise<User> {
    return this.authService.signUp(createUser);
  }

  @Post('sign-in')
  login(@Body() signInUser: UserDto): Promise<AuthDto> {
    return this.authService.signIn(signInUser);
  }
}
