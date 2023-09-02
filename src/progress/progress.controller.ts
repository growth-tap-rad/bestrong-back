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

// @UseGuards(AuthGuard) Todo if all have guards..
@Controller('') 
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
  @Get('/progress')
  getProgresses(): Promise<Progress[]> {
    return this.progressService.getProgresses();
  } // Fins de teste, deixara de existir


  @UseGuards(AuthGuard)
  @Get('me/tdee')
  getTBM(): Promise<Object> {
    try {
      return this.progressService.getTDEE();
    } catch (error) {
      console.log(error); // tratar melhor dps
    }
    
  }
  
}
