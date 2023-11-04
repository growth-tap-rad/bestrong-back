import { Module } from "@nestjs/common";
import { Train } from "./train.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrainService } from "./train.service";
import { TrainsController } from "./train.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Train])],
    providers: [TrainService],
    controllers: [TrainsController]
})

    export class TrainsModule{}


