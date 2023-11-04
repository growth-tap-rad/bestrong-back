import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diary } from './diary.entity';
import { DiaryDto } from './dtos/diary.dto';
import { User } from 'src/users/user.entity';
import { Progress } from 'src/progress/progress.entity';
import { Water } from 'src/water/water.entity';
import { MealFood } from 'src/meal_food/meal_food.entity';
import { Meal } from 'src/meal/meal.entity';
import { Train } from 'src/train/train.entity';


@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
    @InjectRepository(Water)
    private readonly waterRepository: Repository<Water>,
    @InjectRepository(Water)
    private readonly mealFoodRespository: Repository<MealFood>,
  ) { }

  async createDiary(diaryDto: DiaryDto, user: User): Promise<Diary> {
    const newDiary = new Diary();
    const foundProgress = await this.findProgressById(user.id);
    if (!foundProgress) {
      throw new NotFoundException('progresso não encontrado');
    }
    Object.assign(newDiary, diaryDto);

    newDiary.user = user;
    newDiary.progress = foundProgress;

    return this.diaryRepository.save(newDiary);
  }

  async editDiary(diaryDto: DiaryDto, user: User): Promise<Diary> {
    console.log(diaryDto)
    const diary = await this.diaryRepository
      .createQueryBuilder('diary')
      .where('diary.userId = :userId', { userId: user.id })
      .getOne();
    Object.assign(diary, diaryDto)
    return this.diaryRepository.save(diary);
  }
  
  async getDiary(user: User): Promise<Diary> {
    const diary = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.progress', 'progress')
      .leftJoinAndSelect('diary.water', 'water')
      .leftJoinAndSelect('diary.meal', 'meal')
      .leftJoinAndSelect('meal.meal_food', 'foods')
      // aqui tenho que fazer um leftjoin com treino?
      .leftJoinAndSelect('diary.train', 'train')
      .where('diary.userId = :userId', { userId: user.id })
      .orderBy('diary.id', 'DESC')
      .getOne();
 
    return diary;
  }



  findProgressById(userId: number): Promise<Progress> {
    return this.progressRepository
      .createQueryBuilder('progress')
      .where('progress.userId = :userId', { userId })
      .orderBy('progress.id', 'DESC')
      .getOne();
  }
}
