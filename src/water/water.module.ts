import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Water } from "./water.entity";
import { WaterService } from "./water.service";
import { WaterController } from "./water.controller";
import { Diary } from "src/diary/diary.entity";
@Module({
    imports: [
        TypeOrmModule.forFeature([Water, Diary])
    ],
    providers: [WaterService],
    controllers: [WaterController]
})

export class WaterModule { }