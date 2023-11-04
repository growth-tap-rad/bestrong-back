import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ExercisesService } from "./exercises.service";
import { ExercisesDto } from "./dtos/exercises.dto";

@Controller('exercicios')
export class ExercisesController {
  constructor(private readonly exercisesServices: ExercisesService) { }


  @Post('')
  async createExercises(
    @Body() ExercisesData: ExercisesDto
  ) {
    return this.exercisesServices.createExercises(ExercisesData)
  }

  @Get('/:id')
  async getExercises(
    @Param('id') id: string
  ) {
    return this.exercisesServices.getExercises(id)
  }


  @Put('/:id')
  async editExercises(
    @Param('id') id: string,
    @Body() ExercisesData: ExercisesDto,
  ) {
    return this.exercisesServices.editExercises(ExercisesData, id)
  }

  @Delete('/:id')
  async deleteExercise(
    @Param() id: string
  ) {
    return this.exercisesServices.deleteExercise(id)
  }

}