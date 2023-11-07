import { Injectable } from '@nestjs/common';
import { Exercise } from './exercise.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ExerciseDto } from './dtos/exercises.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exercisesRepository: Repository<Exercise>,
  ) { }
  async createExercises(exerciseDto: ExerciseDto) {
    let newExercise = new Exercise();
    Object.assign(newExercise, exerciseDto);

    return this.exercisesRepository.save(newExercise);
  }

  async getExercise(id: string): Promise<Exercise> {
    return await this.exercisesRepository
      .createQueryBuilder('execises')
      .where('execises.id = :id', { id })
      .getOne();
  }
  async getExercises(): Promise<Exercise[]> {
    return await this.exercisesRepository
      .createQueryBuilder('execises')
      .getMany();
  }

  async editExercises(
    exerciseDto: ExerciseDto,
    id: string,
  ): Promise<Exercise> {
    let exercise = await this.exercisesRepository
      .createQueryBuilder('exercises')
      .where('exercises.id= :id', { id })
      .getOne();

    Object.assign(exercise, exerciseDto);
    return await this.exercisesRepository.save(exercise);
  }

  async deleteExercise(id: string) {
    return this.exercisesRepository.delete(id);
  }
}
