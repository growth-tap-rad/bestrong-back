import { Injectable } from "@nestjs/common";
import { Muscle } from "./muscle.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MuscleDto } from "./dtos/muscle.dto";
import { Repository } from "typeorm";

@Injectable()
export class MuscleService {
  constructor(
    @InjectRepository(Muscle)
    private readonly muscleRepository: Repository<Muscle>
  ) { }
  async createMuscle(muscleDto: MuscleDto) {
    let newMuscle = new Muscle
    Object.assign(newMuscle, muscleDto)

    return this.muscleRepository.save(newMuscle)
  }

  async getMuscle(id: string): Promise<Muscle> {
    return await this.muscleRepository
      .createQueryBuilder('muscle')
      .where('muscle.id = :id', { id })
      .getOne();

  }

}