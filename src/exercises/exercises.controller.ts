import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ExercisesService } from "./exercises.service";
import { ExerciseDto } from "./dtos/exercises.dto";

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesServices: ExercisesService) { }


  @Post('')
  async createExercises(
    @Body() exerciseDto: ExerciseDto
  ) {
    return this.exercisesServices.createExercises(exerciseDto)
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