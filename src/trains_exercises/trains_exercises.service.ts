import { Injectable, NotFoundException } from "@nestjs/common";
import { TrainsExercises } from "./trains_exercises.entity";
import { Train } from "src/train/train.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Exercises } from "src/exercises/exercises.entity";
import { TrainsExercisesDto } from "./dtos/trains_exercises.dto";

@Injectable()
export class TrainsExercisesService{
    constructor(
        @InjectRepository(TrainsExercises) private readonly trainsExercisesRepository: Repository<TrainsExercises>,
        @InjectRepository(Train) private readonly trainRepository: Repository<Train>,
        @InjectRepository(Exercises) private readonly exercisesRepository: Repository<Exercises>,
    ){}

    async createTrain(trainsExercisesDto:TrainsExercisesDto) {

        const train_exercisies = new TrainsExercises();
        const train = await this.trainRepository.findOneBy({ id: trainsExercisesDto.train_id })
        const exercises = await this.exercisesRepository.findOneBy({ id: trainsExercisesDto.exercises_id })
    
      
        if (!(train && exercises)) {
          throw new NotFoundException('Treino ou exercicio não existe')
        }
    
        Object.assign(train_exercisies, trainsExercisesDto);
        train_exercisies.trains = train;
        train_exercisies.exercises = exercises;
    
        return this.trainsExercisesRepository.save(train_exercisies);
      }
}