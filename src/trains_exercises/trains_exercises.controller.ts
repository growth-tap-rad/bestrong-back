import { Body, Controller, Post, Get, Request, UseGuards, Delete, Param, Put } from "@nestjs/common";
import { TrainsExercisesService } from "./trains_exercises.service";
import { TrainExerciseDto } from "./dtos/train_exercise.dto";
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@Controller('trains_exercises')
export class TrainsExercisesController {
  constructor(private readonly trainsExercisesService: TrainsExercisesService) { }


  @Post('/')
  async createTrainExercise(
    @Body() trainsExercisesDto: TrainExerciseDto,
  ) {
    return this.trainsExercisesService.createTrain(trainsExercisesDto)
  }
  @Put('/:id')
  async editTrainExercise(
    @Body() trainsExercisesDto: TrainExerciseDto,
    @Param('id') id: number
  ) {
    return this.trainsExercisesService.editTrainExercise(trainsExercisesDto, id)
  }
  @Delete('/:id')
  async deleteTrainExercise(
    @Param('id') id: number
  ) {
    return this.trainsExercisesService.deleteTrainExercise(id)
  }
  @Get('/:id')
  async getTrainExercise(
    @Param('id') id: number,
  ) {
    return this.trainsExercisesService.getTrainExercise(id)
  }
}