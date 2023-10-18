import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MeasureService } from "./measure.service";
import { MeasureController } from "./measure.controller";
import { Measure } from "./measure.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Measure])],
    controllers:[MeasureController],
    providers:[MeasureService]
})

export class MeasureModule{}