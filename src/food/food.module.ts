import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FoodService } from "./food.service";
import { FoodController } from "./food.controller";
import { Food } from "./food.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Food])],
    controllers:[FoodController],
    providers:[FoodService]
})

export class FoodModule{}