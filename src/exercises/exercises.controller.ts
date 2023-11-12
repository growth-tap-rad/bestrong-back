import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ExercisesService } from "./exercises.service";
import { ExerciseDto } from "./dtos/exercises.dto";
import { ExercisePaginationDto } from "./dtos/exercises.pagination"
import { AuthGuard } from "src/auth/auth.guard";
@UseGuards(AuthGuard)
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

  @Get('')
  async getExercises(
    @Query('') paginationDto: ExercisePaginationDto,
    @Query('search') search: string,
  ) {
    return this.exercisesServices.getExercises(paginationDto, search)
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
    @Param('id') id: string
  ) {
    return this.exercisesServices.deleteExercise(id)
  }

}