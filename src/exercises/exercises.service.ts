import { Injectable } from "@nestjs/common";
import { Exercises } from "./exercises.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ExercisesDto } from "./dtos/exercises.dto";
import { Repository } from "typeorm";

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercises)
    private readonly exercisesRepository: Repository<Exercises>
  ) { }
  async createExercises(ExercisesData: ExercisesDto) {
    let newExercise = new Exercises
    Object.assign(newExercise, ExercisesData)

    return this.exercisesRepository.save(newExercise)
  }

  async getExercises(id: string): Promise<Exercises> {
    return await this.exercisesRepository
      .createQueryBuilder('execises')
      // .leftJoinAndSelect('execises.trains_exercises', 'trains_exercises')
      //   .leftJoinAndSelect('trains_exercises.execises', 'execises')
      .where('execises.id = :id', { id })
      .getOne();

    // ver como relaciona essa parte

  }

  async editExercises(exercisesData: ExercisesDto, id: string): Promise<Exercises> {

    let exercise = await this.exercisesRepository
      .createQueryBuilder('exercises')
      .where('exercises.id= :id', { id })
      .getOne()

    Object.assign(exercise, exercisesData)
    return await this.exercisesRepository.save(exercise)
  }

  async deleteExercise(id: string) {
    return this.exercisesRepository.delete(id)
  }


}