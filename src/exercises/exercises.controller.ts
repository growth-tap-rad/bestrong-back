import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ExercisesService } from "./exercises.service";
import { ExerciseDto } from "./dtos/exercises.dto";
import { ExercisePaginationDto } from "./dtos/exercises.pagination"
import { AuthGuard } from "src/auth/auth.guard";
@Controller('')
export class ExercisesController {
  constructor(private readonly exercisesServices: ExercisesService) { }

  @UseGuards(AuthGuard)
  @Post('')
  async createExercises(
    @Body() exerciseDto: ExerciseDto
  ) {
    return this.exercisesServices.createExercises(exerciseDto)
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getExercise(
    @Param('id') id: string
  ) {
    return this.exercisesServices.getExercise(id)
  }

  @UseGuards(AuthGuard)
  @Get('')
  async getExercises(
    @Query('') paginationDto: ExercisePaginationDto,
    @Query('search') search: string,
  ) {
    return this.exercisesServices.getExercises(paginationDto, search)
  }

  @UseGuards(AuthGuard)

  @Put('/:id')
  async editExercises(
    @Param('id') id: string,
    @Body() exerciseDto: ExerciseDto,
  ) {
    return this.exercisesServices.editExercises(exerciseDto, id)
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteExercise(
    @Param('id') id: string
  ) {
    return this.exercisesServices.deleteExercise(id)
  }

}