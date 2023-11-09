import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExerciseDto } from './dtos/exercises.dto';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { ExercisePaginationDto } from "./dtos/exercises.pagination"

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
      .createQueryBuilder('exercise')
      .where('exercise.id = :id', { id })
      .getOne();
  }
  async getExercises(pageDto: ExercisePaginationDto, search: string): Promise<Exercise[]> {

    const pagination = {
      page: pageDto?.page || 0,
      limit: pageDto?.limit || 20,
    };

    let query = this.exercisesRepository
      .createQueryBuilder('exercise')
      .skip(pagination.page)
      .take(pagination.limit)
      .orderBy('exercise.name');

    if (search) {
      query = query.andWhere('exercise.name LIKE :name', {
        name: `%${search}%`,
      });
    }

    const exercises = await query.getMany();
    return exercises;

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
