import { Module } from "@nestjs/common";
import { MealService } from "./meal.service";
import { MealController } from "./meal.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Meal } from "./meal.entity";
import { User } from "src/users/user.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Meal,User])],
    controllers:[MealController],
    providers:[MealService]
})

export class MealModule{}