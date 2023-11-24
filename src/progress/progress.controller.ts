import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ProgressService } from './progress.service';
import { ProgressDto } from './dtos/progress.dto';
import { Progress } from './progress.entity';

@UseGuards(AuthGuard)
@Controller('me/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) { }

  @Get('/')
  getProgress(@Request() request: Request): Promise<Progress[]> {
    return this.progressService.getProgress(request['user'].id);
  }

  @Post('/')
  async createProgress(
    @Body() progressData: ProgressDto,
    @Request() request: Request,
  ) {
    return this.progressService.recordProgress(progressData, request['user']);
  }

  @Put('/:id')
  async editProgress(
    @Body() progressData: ProgressDto,
    @Request() request: Request,
    @Param('id') id: number
  ) {
    return this.progressService.editProgress(progressData, request['user'], id);
  }


}
