
import { Controller, Post, Body, UseGuards, Request, Get} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { MealService } from "./meal.service";
import { MealDto } from "./dtos/meal.dto";

@Controller('')
export class MealController {
  constructor(private readonly mealService: MealService) { }

  @UseGuards(AuthGuard)
  @Post('me/meal')
  async createDiary(
    @Body() mealData: MealDto,
    @Request() request: Request,

  ) {
    return this.mealService.createMeal(mealData, request['user'])
  }
  @UseGuards(AuthGuard)
  @Get('me/meal')
  async getDiary(
    @Request() request: Request,
  ) {
    return this.mealService.getMeal(request['user'])
  }
 
}