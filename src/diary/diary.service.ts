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

    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);
    const currentYear = currentDate.getUTCFullYear();
    const currentMonth = currentDate.getUTCMonth() + 1;
    const currentDay = currentDate.getUTCDate();

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
    const dateValid = new Date(date + 'T00:00:00.000');
    dateValid.setUTCHours(0, 0, 0, 0);

    if (isNaN(dateValid.getTime())) {
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
      .andWhere('progress.year = :year', { year: dateValid.getUTCFullYear() })
      .andWhere('progress.month = :month', { month: dateValid.getUTCMonth() + 1 })
      .andWhere('progress.day = :day', { day: dateValid.getUTCDate() })
      .andWhere('diary.year = :year', { year: dateValid.getUTCFullYear() })
      .andWhere('diary.month = :month', { month: dateValid.getUTCMonth() + 1 })
      .andWhere('diary.day = :day', { day: dateValid.getUTCDate() })
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
      .andWhere('diary.year = :year', { year: dateValid.getUTCFullYear() })
      .andWhere('diary.month = :month', { month: dateValid.getUTCMonth() + 1 })
      .andWhere('diary.day = :day', { day: dateValid.getUTCDate() })
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
    const foundProgress = await this.findProgressById(user.id);
    if (!foundProgress) {
      return;
    }

    const currentDate = this.getCurrentNextDate();
    newDiary.year = currentDate.currentYear;
    newDiary.month = currentDate.currentMonth;
    newDiary.day = currentDate.currentDay;

    newDiary.user = user;
    newDiary.progress = foundProgress;

    const diary = await this.diaryRepository.save(newDiary);

    await this.createDefaultMeals(diary);
  }

  @Cron('50 22 * * *', {
    name: 'createNextDiary',
    timeZone: 'America/Campo_Grande',
  }) // 23:50 cg-mss

  //@Cron('20 * * * * *', {
  //   name: 'createNextDiary',
  //   timeZone: 'America/Campo_Grande',
  //}) // para testar 20s cg-ms
  async handleCron() {
    const users = await this.usersRepository.find({});
    console.log('\ncron-job\n');
    if (!users) {
      return;
    }
    for (const user of users) {
      await this.createDiaryScheduled(user);
    }
  }

  getCurrentNextDate() {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);
    let currentYear = currentDate.getUTCFullYear();
    let currentMonth = currentDate.getUTCMonth() + 1;
    let currentDay = currentDate.getUTCDate();

    if (
      currentMonth === 12 &&
      currentDay === new Date(currentYear, currentMonth, 0).getUTCDate()
    ) {
      currentYear = currentYear + 1;
      currentMonth = 1;
      currentDay = 1;
    } else if (
      currentDay === new Date(currentYear, currentMonth, 0).getUTCDate()
    ) {
      currentYear = currentYear;
      currentMonth = currentMonth + 1;
      currentDay = 1;
    } else {
      currentYear = currentYear;
      currentMonth = currentMonth;
      currentDay = currentDay + 1;
    }

    return {
      currentYear,
      currentMonth,
      currentDay,
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
