import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MealFoodService } from "./meal_food.service";
import { MealFoodController } from "./meal_food.controller";
import { MealFood } from "./meal_food.entity";

@Module({
    imports:[TypeOrmModule.forFeature([MealFood])],
    controllers:[MealFoodController],
    providers:[MealFoodService]
})

export class MealFoodModule{}