
import { Controller, Post, Body, UseGuards, Request, Get, Param, Put } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { MealService } from "./meal.service";
import { MealDto } from "./dtos/meal.dto";

@Controller('me/meal')
export class MealController {
  constructor(private readonly mealService: MealService) { }

  @UseGuards(AuthGuard)
  @Post('')
  async createDiary(
    @Body() mealData: MealDto,
    @Request() request: Request,

  ) {
    return this.mealService.createMeal(mealData, request['user'])
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findMeal(
    @Param('id') id: string
  ) {
    return this.mealService.findMeal(id)
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async editMeal(
    @Param('id') id: string,
    @Body() mealData: MealDto,
  ) {
    return this.mealService.editMeal(mealData ,id  )
  }
}