import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MealFoodService } from "./meal_food.service";
import { MealFoodController } from "./meal_food.controller";
import { MealFood } from "./meal_food.entity";
import { Food } from "src/food/food.entity";
import { Meal } from "src/meal/meal.entity";

@Module({
    imports:[TypeOrmModule.forFeature([MealFood,Food,Meal])],
    controllers:[MealFoodController],
    providers:[MealFoodService]
})

export class MealFoodModule{}