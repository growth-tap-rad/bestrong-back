import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { Measure } from "src/measure/measure.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Food } from "src/food/food.entity";
import { SeedController } from "./seed.controller";
import { Muscle } from "src/muscle/muscle.entity";
import { Exercise } from "src/exercises/exercise.entity";


@Module({
    imports:[TypeOrmModule.forFeature([Measure, Food, Muscle, Exercise])],
    controllers:[SeedController],
    providers:[SeedService]
})

export class SeedModule{}