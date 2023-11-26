import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { MealFoodService } from './meal_food.service';
import { MealFoodDto } from 'src/meal_food/dtos/meal_food.dto';

@UseGuards(AuthGuard)
@Controller('meal_food')
export class MealFoodController {
  constructor(private readonly mealFoodService: MealFoodService) {}

  @Post('/')
  async createMealFood(@Body() mealDto: MealFoodDto) {
    return this.mealFoodService.createMealFood(mealDto);
  }

  @Put('/:id')
  async editMealFood(@Body() mealDto: MealFoodDto, @Param('id') id: number) {
    return this.mealFoodService.editMealFood(mealDto, id);
  }

  @Delete('/:id')
  async deleteMealFood(@Param('id') id: number) {
    return this.mealFoodService.deleteMealFood(id);
  }

  @Get('/:id')
  async findMealFood(
    @Param('id') id: string
  ) {
    return this.mealFoodService.getMealFood(id)
  }
}
