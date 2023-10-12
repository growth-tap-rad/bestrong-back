import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';
import { UserDto } from 'src/users/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  createUser(@Body() createUser: UserDto): Promise<object> {
    return this.authService.signUp(createUser);
  }

  @Post('/sign-in')
  login(@Body() signInUser: UserDto): Promise<AuthDto> {
    return this.authService.signIn(signInUser);
  }
}
