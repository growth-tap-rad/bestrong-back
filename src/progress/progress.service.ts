import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Progress } from './progress.entity';
import { ProgressDto } from './dtos/progress.dto';
import { CALC_AGE } from './constants/calc_age';
import { MACROS } from './constants/macros.constants';

const BMR_MAN = (wheight: number, cmHeight: number, age: number): number => {
  return 66 + 13.7 * wheight + 5 * cmHeight - 6.8 * age;
};

const BMR_WOMEN = (wheight: number, cmHeight: number, age: number): number => {
  return 665 + 9.6 * wheight + 1.8 * cmHeight - 4.7 * age;
};

const PER_GRAM_CALORIE = {
  protein: 4,
  carb: 4,
  fat: 9,
};

const ACTIVITY_FACTOR = {
  low: 1.375,
  moderate: 1.55,
  intense: 1.725,
};

const GOAL_FACTOR = {
  lose: 0.8,
  maintain: 1,
  gain: 1.2,
};

const MAN = 'man';
const WOMEN = 'women';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
  ) {}

  recordProgress(progressDto: ProgressDto, user: User) {
    const progress = new Progress();
    progress.user = user;
    // Todo: Tratar com ifs ..
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

  getProgresses(): Promise<Progress[]> {
    return this.progressRepository.find({});
  } // Fins de teste, deixara de existir

  async getTDEE(): Promise<Object> {
    const progress = await this.getProgressForUser();

    if (!progress) {
      throw new Error('Progress not found for the user.');
    }
    const { birthday, gender } = progress.user;
    const { weight, height, activity_level, goal } = progress;
    let bmr = null;

    if (!birthday) {
      throw new Error('User needs a birthday.');
    }

    if (gender === MAN) {
      bmr = BMR_MAN(weight, height, CALC_AGE(birthday));
    } else if (gender === WOMEN) {
      bmr = BMR_WOMEN(weight, height, CALC_AGE(birthday));
    } else {
      throw new Error('User gender invalid!');
    }

    const activityFactor = ACTIVITY_FACTOR[activity_level];
    const goalFactor = GOAL_FACTOR[goal];
    const macros = MACROS[activity_level];

    const per_gram_porcents = {
      protein: macros[goal].protein,
      carb: macros[goal].carb,
      fat: macros[goal].fat,
    };

    const protein = this.macroCalorieToGrams(
      per_gram_porcents['protein'],
      this.totalEnergyExpenditure(bmr, activityFactor, goalFactor),
      PER_GRAM_CALORIE.protein,
    );
    const carb = this.macroCalorieToGrams(
      per_gram_porcents['carb'],
      this.totalEnergyExpenditure(bmr, activityFactor, goalFactor),
      PER_GRAM_CALORIE.carb,
    );
    const fat = this.macroCalorieToGrams(
      per_gram_porcents['fat'],
      this.totalEnergyExpenditure(bmr, activityFactor, goalFactor),
      PER_GRAM_CALORIE.fat,
    );

    const weightMacros = {
      protein: protein,
      carb: carb,
      fat: fat,
    };

    const dailyGoal = this.dailyGoalFormated(
      this.totalEnergyExpenditure(bmr, activityFactor, goalFactor),
    );

    return {
      daily_goal: dailyGoal,
      macros: weightMacros,
    };
  }

  dailyGoalFormated(dailyGoal: number): number {
    return parseFloat(dailyGoal.toFixed(2));
  }

  macroCalorieToGrams(
    type: number,
    totalExpenditure: number,
    caloriePerGram: number,
  ): number {
    const macroCalorie = type * totalExpenditure;

    return parseFloat((macroCalorie / caloriePerGram).toFixed(2));
  }

  totalEnergyExpenditure(
    bmr: number,
    activityFactor: number,
    goalFactor: number,
  ) {
    const tdee = bmr * activityFactor * goalFactor;

    return tdee;
  }

  async getProgressForUser(): Promise<Progress | null> {
    return await this.progressRepository
      .createQueryBuilder('progress')
      .leftJoinAndSelect('progress.user', 'user')
      .getOne();
  }
}
