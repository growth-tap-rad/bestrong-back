import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { MuscleService } from "./muscle.service";
import { MuscleDto } from "./dtos/muscle.dto";
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@Controller('muscle')
export class MuscleController {
  constructor(private readonly muscleService: MuscleService) { }


  @Post('')
  async createMuscle(
    @Body() ExercisesData: MuscleDto
  ) {
    return this.muscleService.createMuscle(ExercisesData)
  }

  @Get('/:id')
  async getMuscle(
    @Param('id') id: string
  ) {
    return this.muscleService.getMuscle(id)
  }


}