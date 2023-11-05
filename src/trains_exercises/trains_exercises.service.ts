import { Injectable, NotFoundException } from "@nestjs/common";
import { TrainExercise } from "./train_exercise.entity";
import { Train } from "src/trains/train.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Exercise } from "src/exercises/exercise.entity";
import { TrainExerciseDto } from "./dtos/train_exercise.dto";

@Injectable()
export class TrainsExercisesService{
    constructor(
        @InjectRepository(TrainExercise) private readonly trainsExercisesRepository: Repository<TrainExercise>,
        @InjectRepository(Train) private readonly trainRepository: Repository<Train>,
        @InjectRepository(Exercise) private readonly exercisesRepository: Repository<Exercise>,
    ){}

    async createTrain(trainsExercisesDto:TrainExerciseDto) {

        const train_exercisies = new TrainExercise();
        const train = await this.trainRepository.findOneBy({ id: trainsExercisesDto.train_id })
        const exercises = await this.exercisesRepository.findOneBy({ id: trainsExercisesDto.exercise_id })
    
      
        if (!(train && exercises)) {
          throw new NotFoundException('Treino ou exercício não existe')
        }
    
        Object.assign(train_exercisies, trainsExercisesDto);
        train_exercisies.trains = train;
        train_exercisies.exercises = exercises;
    
        return this.trainsExercisesRepository.save(train_exercisies);
      }
}