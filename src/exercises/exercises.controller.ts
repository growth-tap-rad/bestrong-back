import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ExercisesService } from "./exercises.service";
import { ExerciseDto } from "./dtos/exercises.dto";

@Controller('')
export class ExercisesController {
  constructor(private readonly exercisesServices: ExercisesService) { }


  @Post('')
  async createExercises(
    @Body() exerciseDto: ExerciseDto
  ) {
    return this.exercisesServices.createExercises(exerciseDto)
  }

  @Get('/:id')
  async getExercise(
    @Param('id') id: string
  ) {
    return this.exercisesServices.getExercise(id)
  }

  @Get('/')
  async getExercises(
  ) {
    return this.exercisesServices.getExercises()
  }

  @Put('/:id')
  async editExercises(
    @Param('id') id: string,
    @Body() exerciseDto: ExerciseDto,
  ) {
    return this.exercisesServices.editExercises(exerciseDto, id)
  }

  @Delete('/:id')
  async deleteExercise(
    @Param() id: string
  ) {
    return this.exercisesServices.deleteExercise(id)
  }

}