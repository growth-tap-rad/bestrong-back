import { Module } from "@nestjs/common";
import { Muscle } from "./muscle.entity";
import { MuscleService } from "./muscle.service";
import { MuscleController } from "./muscle.controller";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([Muscle])
    ],
    providers: [MuscleService],
    controllers: [MuscleController]
})
export class MuscleModule{}