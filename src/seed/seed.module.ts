import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { Measure } from "src/measure/measure.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Food } from "src/food/food.entity";
import { SeedController } from "./seed.controller";


@Module({
    imports:[TypeOrmModule.forFeature([Measure, Food])],
    controllers:[SeedController],
    providers:[SeedService]
})

export class SeedModule{}