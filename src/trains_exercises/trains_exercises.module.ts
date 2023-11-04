import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrainsExercises } from "./trains_exercises.entity";
import { Train } from "src/train/train.entity";
import { Exercises } from "src/exercises/exercises.entity";
import { TrainsExercisesService } from "./trains_exercises.service";
import { TrainsExercisesController } from "./trains_exercises.controller";

@Module({
    imports:[
        TypeOrmModule.forFeature([TrainsExercises,Train,Exercises])
    ],
      providers:[TrainsExercisesService],
      controllers:[TrainsExercisesController]
})


export class TrainsExercisesModule{}