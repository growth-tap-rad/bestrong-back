import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ProgressService } from './progress.service';
import { ProgressDto } from './dtos/progress.dto';
import { Progress } from './progress.entity';

@Controller('') // TODO verify if it's correct
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @UseGuards(AuthGuard)
  @Post('me/progress')
  async createProgress(
    @Body() progressData: ProgressDto,
    @Request() request: Request,
  ) {
    return this.progressService.recordProgress(progressData, request['user']);
  }

  @UseGuards(AuthGuard)
  @Get('me/progress')
  getProgress(): Promise<Progress[]> {
    return this.progressService.getProgress();
  }


  @UseGuards(AuthGuard)
  @Get('me/tdee')
  getTBM(): Promise<Object> {
    return this.progressService.getTDEE();
  }
  
}
