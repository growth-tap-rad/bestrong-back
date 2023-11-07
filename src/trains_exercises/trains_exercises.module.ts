import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainExercise } from './train_exercise.entity';
import { Train } from 'src/trains/train.entity';
import { Exercise } from 'src/exercises/exercise.entity';
import { TrainsExercisesService } from './trains_exercises.service';
import { TrainsExercisesController } from './trains_exercises.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TrainExercise, Train, Exercise])],
  providers: [TrainsExercisesService],
  controllers: [TrainsExercisesController],
})
export class TrainsExercisesModule {}
