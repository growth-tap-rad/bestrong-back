import { Module } from "@nestjs/common";
import { Exercises } from "./exercises.entity";
import { ExercisesService } from "./exercises.service";
import { ExercisesController } from "./exercises.controller";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([Exercises])
    ],
    providers: [ExercisesService],
    controllers: [ExercisesController]
})
export class ExercisesModule{}