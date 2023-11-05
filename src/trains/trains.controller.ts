import { Body, Controller, Post } from '@nestjs/common';
import { TrainService } from './trains.service';
import { TrainDto } from './dtos/train.dto';

@Controller('trains')
export class TrainsController {
  constructor(private readonly trainService: TrainService) {}

  @Post('/')
  async createTrain(@Body() trainsDto: TrainDto) {
    return this.trainService.createTrain(trainsDto);
  }
}
