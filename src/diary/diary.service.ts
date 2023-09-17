import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Diary } from "./diary.entity";
import { Repository } from "typeorm";
import { DiaryDto } from "./dtos/diary.dto";
import { User } from "src/users/user.entity";

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary) private readonly diaryRepository: Repository<Diary>,
  ) { }

  createDiary(diary: DiaryDto, user: User): Promise<object> {

    let newDiary = new Diary();
    newDiary.daily_goal_kcal = diary.daily_goal_kcal;
    newDiary.burned_kcal = diary.burned_kcal;
    newDiary.consumed_kcal = diary.consumed_kcal;
    newDiary.carb = diary.carb;
    newDiary.protein = diary.protein;
    newDiary.fat = diary.fat;
    newDiary.user = user;
    
    return this.diaryRepository.save(newDiary);
  }
}