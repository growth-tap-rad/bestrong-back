import { Body, Controller, Post } from "@nestjs/common";
import { TrainsExercisesService } from "./trains_exercises.service";
import { TrainsExercisesDto } from "./dtos/trains_exercises.dto";

@Controller('')
export class TrainsExercisesController{
    constructor(private readonly trainsExercisesService: TrainsExercisesService){}

    @Post('/')
    async createTrain(
      @Body() trainsExercisesDto: TrainsExercisesDto,
    ) {
      return this.trainsExercisesService.createTrain(trainsExercisesDto)
    }
}