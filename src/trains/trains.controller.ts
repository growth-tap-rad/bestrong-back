import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  UseGuards,
  Param,
  Put,
  Delete,
  Query
} from '@nestjs/common';
import { TrainService } from './trains.service';
import { TrainDto } from './dtos/train.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('me/trains')
export class TrainsController {
  constructor(private readonly trainService: TrainService) { }

  @Post('')
  async createTrain(
    @Body() trainsDto: TrainDto,
    @Request() request: Request
  ) {
    return this.trainService.createTrain(trainsDto, request['user']);
  }

  @Get('')
  async getTrains(
    @Request() request: Request,
    @Query('date') date: string
  ) {
    return this.trainService.getTrains(date, request['user']);
  }

  @Get('/:id')
  async getTrain(
    @Param('id') id: string
  ) {
    return this.trainService.getTrain(id)
  }

  @Put('/:id')
  async editMeal(
    @Param('id') id: string,
    @Body() trainsDto: TrainDto,
  ) {
    return this.trainService.editTrain(trainsDto, id)
  }

  @Delete('/:id')
  async deleteMeal(
    @Param('id') id: string,
  ) {
    return this.trainService.deleteTrain(id)
  }
}
