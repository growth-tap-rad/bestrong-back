import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Progress } from './progress.entity';
import { ProgressDto } from './dtos/progress.dto';
import { BMR_MAN, BMR_WOMAN } from './constants/factors.constants';
import { calculateAge } from './constants/calcAge';
import { ACTIVITY_FACTOR, GOAL_FACTOR } from './constants/factors.constants';
import { MACROS } from './constants/macros.constants';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
  ) {}

  recordProgress(progressDto: ProgressDto, user: User) {
    const progress = new Progress();
    progress.user = user;

    progress.height = progressDto.height;
    progress.weight = progressDto.weight;
    progress.activity_level = progressDto.activity_level;
    progress.goal = progressDto.goal;

    return this.progressRepository.save(progress);
  }

  getProgress(): Promise<Progress[]> {
    return this.progressRepository
      .createQueryBuilder('progress')
      .leftJoinAndSelect('progress.user', 'user')
      .getMany();
  }

  
  async getTDEE(): Promise<Object> {
    const progress = await this.getProgressForUser();

    if (!progress) {
      throw new Error('Progress not found for the user.');
    }
    const { birthday, gender } = progress.user;
    const { weight, height, activity_level, goal } = progress;
    let bmr = null;

    if (gender === 'man') {
      bmr = BMR_MAN(weight, height, calculateAge(birthday));
    } else if (gender === 'woman') {
      bmr = BMR_WOMAN(weight, height, calculateAge(birthday));
    } else {
      throw new Error('User gender invalid!');
    }

    const activityFactor = ACTIVITY_FACTOR[activity_level]; // LEVANDO EM CONTA ATIVIDADE LEVE!
    const goalFactor = GOAL_FACTOR[goal];
    const macros = MACROS[activity_level];

    const dailyGoalandMacros = {
      daily_goal: this.totalEnergyExpenditure(bmr, activityFactor, goalFactor),
      macros: macros[goal]
    }

    return dailyGoalandMacros;
  }

  totalEnergyExpenditure(
    bmr: number,
    activityFactor: number,
    goalFactor: number,
  ) {
    const tdee = bmr * activityFactor + goalFactor;
    return tdee;
  }

  async getProgressForUser(): Promise<Progress | null> {
    return await this.progressRepository
      .createQueryBuilder('progress')
      .leftJoinAndSelect('progress.user', 'user')
      .getOne();
  }
}
