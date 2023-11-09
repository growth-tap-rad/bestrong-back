import { Body, Controller, Post, Get, Request, UseGuards } from "@nestjs/common";
import { TrainsExercisesService } from "./trains_exercises.service";
import { TrainExerciseDto } from "./dtos/train_exercise.dto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller('trains_exercises')
export class TrainsExercisesController {
  constructor(private readonly trainsExercisesService: TrainsExercisesService) { }


  @UseGuards(AuthGuard)
  @Post('/')
  async createTrain(
    @Body() trainsExercisesDto: TrainExerciseDto,
  ) {
    return this.trainsExercisesService.createTrain(trainsExercisesDto)
  }
}