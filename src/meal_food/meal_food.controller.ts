
import { Controller, Post, Body, UseGuards, Request, Get, Delete, Param } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { MealFoodService } from "./meal_food.service";
import { MealFoodDto } from "src/meal_food/dtos/meal_food.dto";

@Controller('meal_food')
export class MealFoodController {
  constructor(private readonly mealFoodService: MealFoodService) { }

  @UseGuards(AuthGuard)
  @Post('/')
  createMealFood(
    @Body() mealDto: MealFoodDto,
  ) {
    return this.mealFoodService.createMeal(mealDto)
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  deleteMealFood(
    @Param() mealDto: MealFoodDto,
  ) {
    return this.mealFoodService.deleteMealFood(mealDto.id)
  }
}