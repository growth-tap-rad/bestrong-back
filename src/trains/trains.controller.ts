import { Controller, Post, Body, Request, Get, UseGuards } from "@nestjs/common";
import { TrainService } from './trains.service';
import { TrainDto } from './dtos/train.dto';
import { AuthGuard } from "src/auth/auth.guard";
@Controller('me/trains')
export class TrainsController {

  constructor(private readonly trainService: TrainService) { }

  @UseGuards(AuthGuard)
  @Post('')
  async createTrain(
    @Body() trainsDto: TrainDto,
    @Request() request: Request,
  ) {
    return this.trainService.createTrain(trainsDto, request['user']);
  }
  @UseGuards(AuthGuard)
  @Get('')

  async getTrains(
    @Request() request: Request,
  ) {
    return this.trainService.getTrains(request['user'])
  }
}
