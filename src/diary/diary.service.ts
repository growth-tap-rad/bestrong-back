import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diary } from './diary.entity';
import { DiaryDto } from './dtos/diary.dto';
import { User } from 'src/users/user.entity';
import { Progress } from 'src/progress/progress.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Meal } from 'src/meal/meal.entity';
import * as moment from 'moment-timezone';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Meal)
    private readonly mealsRepository: Repository<Meal>,
  ) {}

  async createDiary(diaryDto: DiaryDto, user: User): Promise<Diary> {
    const newDiary = new Diary();
    const foundProgress = await this.findProgressById(user.id);
    if (!foundProgress) {
      throw new NotFoundException('progresso não encontrado');
    }
    Object.assign(newDiary, diaryDto);

    const currentDate = moment().startOf('day').tz('America/Campo_Grande');

    const currentYear = currentDate.year();
    const currentMonth = currentDate.month() + 1;
    const currentDay = currentDate.date();

    newDiary.year = currentYear;
    newDiary.month = currentMonth;
    newDiary.day = currentDay;

    newDiary.user = user;
    newDiary.progress = foundProgress;

    const diary = await this.diaryRepository.save(newDiary);

    await this.createDefaultMeals(diary);

    return diary;
  }

  async editDiary(diaryDto: DiaryDto, user: User): Promise<Diary> {
    const diary = await this.diaryRepository
      .createQueryBuilder('diary')
      .where('diary.userId = :userId', { userId: user.id })
      .getOne();
    Object.assign(diary, diaryDto);
    return await this.diaryRepository.save(diary);
  }

  async getDiary(user: User, date: string): Promise<Diary> {
    const dateValid = moment(date, 'YYYY-MM-DD', true);

    if (!dateValid.isValid()) {
      throw new BadRequestException('Data especificada inválida para Diário');
    }

    const diary = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.user', 'user')
      .leftJoinAndSelect('user.progress', 'progress')
      .leftJoinAndSelect('diary.water', 'water')
      .leftJoinAndSelect('diary.meal', 'meal')
      .leftJoinAndSelect('meal.meal_food', 'foods')
      .leftJoinAndSelect('diary.train', 'train')
      .where('diary.userId = :userId', { userId: user.id })
      .andWhere('progress.year = :year', { year: dateValid.year() })
      .andWhere('progress.month = :month', {
        month: dateValid.month() + 1,
      })
      .andWhere('progress.day = :day', { day: dateValid.date() })
      .andWhere('diary.year = :year', { year: dateValid.year() })
      .andWhere('diary.month = :month', { month: dateValid.month() + 1 })
      .andWhere('diary.day = :day', { day: dateValid.date() })
      .orderBy('progress.id', 'ASC')
      .getOne();

    const diaryWithoutProgress = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.user', 'user')
      .leftJoinAndSelect('user.progress', 'progress')
      .leftJoinAndSelect('diary.water', 'water')
      .leftJoinAndSelect('diary.meal', 'meal')
      .leftJoinAndSelect('meal.meal_food', 'foods')
      .leftJoinAndSelect('diary.train', 'train')
      .where('diary.userId = :userId', { userId: user.id })
      .andWhere('diary.year = :year', { year: dateValid.year() })
      .andWhere('diary.month = :month', { month: dateValid.month() + 1 })
      .andWhere('diary.day = :day', { day: dateValid.date() })
      .orderBy('progress.id', 'ASC')
      .getOne();

    if (!diary) {
      if (diaryWithoutProgress) {
        return diaryWithoutProgress;
      }
      throw new NotFoundException(
        'Diário não encontrado para a data especificada',
      );
    }
    return diary;
  }

  findProgressById(userId: number): Promise<Progress> {
    return this.progressRepository
      .createQueryBuilder('progress')
      .where('progress.userId = :userId', { userId })
      .orderBy('progress.id', 'DESC')
      .getOne();
  }

  async createDiaryScheduled(user: User): Promise<Diary> {
    const newDiary = new Diary();
    const newProgress = new Progress();

    const foundProgress = await this.findProgressById(user.id);
    if (!foundProgress) {
      return;
    }

    const currentDate = this.getCurrentNextDate();
    newDiary.year = currentDate.currentYear;
    newDiary.month = currentDate.currentMonth;
    newDiary.day = currentDate.currentDay;
    newDiary.user = user;

    newProgress.activity_level = foundProgress.activity_level;
    newProgress.carb = foundProgress.carb;
    newProgress.fat = foundProgress.fat;
    newProgress.protein = foundProgress.protein;
    newProgress.daily_goal_kcal = foundProgress.daily_goal_kcal;
    newProgress.created_at = foundProgress.created_at;
    newProgress.goal = foundProgress.goal;
    newProgress.height = foundProgress.height;
    newProgress.updated_at = foundProgress.updated_at;
    newProgress.weight = foundProgress.weight;
    newProgress.year = currentDate.currentYear;
    newProgress.month = currentDate.currentMonth;
    newProgress.day = currentDate.currentDay;
    newProgress.user = user;

    const newProgressBasedOnLast = await this.progressRepository.save(
      newProgress,
    );

    newDiary.progress = newProgressBasedOnLast;

    const diary = await this.diaryRepository.save(newDiary);

    await this.createDefaultMeals(diary);
  }

  @Cron('50 22 * * *', {
    name: 'createNextDiary',
    timeZone: 'America/Campo_Grande',
  }) // 23:50 cg-ms

  // @Cron('50 19 * * *', {
  //   name: 'createNextDiary',
  //   timeZone: 'America/Campo_Grande',
  // }) // Teste horario especifico

  // @Cron('1 * * * * *', {
  //   name: 'createNextDiary',
  //   timeZone: 'America/Campo_Grande',
  // }) // para testar, esperar alguns segundos ate 'cron-finished' teste e desative senao vai criar 2 seguidos
  async handleCron() {
    const users = await this.usersRepository.find({});
    console.log('-cron-');
    if (!users) {
      return;
    }
    for (const user of users) {
      await this.createDiaryScheduled(user);
    }
    console.log('\ncron-finished..\n');
  }

  getCurrentNextDate() {
    const currentDate = moment().startOf('day').tz('America/Campo_Grande');
  
    return {
      currentYear: currentDate.year(),
      currentMonth: currentDate.month() + 1,
      currentDay: currentDate.date(),
    };
  }

  async createDefaultMeals(diary: Diary) {
    const defaultMealNames = ['Café da manhã', 'Almoço', 'Lanche', 'Jantar'];
    for (const name of defaultMealNames) {
      const meal = new Meal();
      meal.name = name;
      meal.diary = diary;
      await this.mealsRepository.save(meal);
    }
  }
}
