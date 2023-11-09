import { Module } from "@nestjs/common";
import { Exercise } from "./exercise.entity";
import { ExercisesService } from "./exercises.service";
import { ExercisesController } from "./exercises.controller";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([Exercise])
    ],
    providers: [ExercisesService],
    controllers: [ExercisesController]
})
export class ExercisesModule{}