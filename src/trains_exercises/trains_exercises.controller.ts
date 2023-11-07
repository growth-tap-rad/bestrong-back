import { Body, Controller, Post } from "@nestjs/common";
import { TrainsExercisesService } from "./trains_exercises.service";
import { TrainExerciseDto } from "./dtos/train_exercise.dto";

@Controller('trains_exercises')
export class TrainsExercisesController {
  constructor(private readonly trainsExercisesService: TrainsExercisesService) { }

  @Post('/')
  async createTrain(
    @Body() trainsExercisesDto: TrainExerciseDto,
  ) {
    return this.trainsExercisesService.createTrain(trainsExercisesDto)
  }
}