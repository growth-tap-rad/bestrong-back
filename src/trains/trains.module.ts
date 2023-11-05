import { Module } from "@nestjs/common";
import { Train } from "./train.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrainService } from "./trains.service";
import { TrainsController } from "./trains.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Train])],
    providers: [TrainService],
    controllers: [TrainsController]
})

    export class TrainsModule{}


