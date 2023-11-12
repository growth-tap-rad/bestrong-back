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

@UseGuards(AuthGuard)
@Controller('')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('me/progress')
  async createProgress(
    @Body() progressData: ProgressDto,
    @Request() request: Request,
  ) {
    return this.progressService.recordProgress(progressData, request['user']);
  }

  @Get('me/progress')
  getProgress(@Request() request: Request): Promise<Progress[]> {
    return this.progressService.getProgress(request['user'].id);
  }

}
