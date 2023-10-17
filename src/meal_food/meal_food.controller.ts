
import { Controller, Post, Body, UseGuards, Request, Get} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { MealFoodService } from "./meal_food.service";

@Controller('meal_foods')
export class MealFoodController {
  constructor(private readonly mealFoodService: MealFoodService) { }

 
}