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

  createDiary(diaryDto: DiaryDto, user: User): Promise<Diary> {

    let newDiary = new Diary();

    Object.assign(newDiary, diaryDto);
    newDiary.user = user;
    return this.diaryRepository.save(newDiary);
  }
  async editDiary(diaryDto: DiaryDto, user: User): Promise<Diary> {

    let diary = await this.diaryRepository
      .createQueryBuilder('diary')
      .where('diary.userId = :userId', { userId: user.id })
      .getOne();
    /* Object.assign(diary, diaryDto)*/

    diary.water += diaryDto.water

    return this.diaryRepository.save(diary)
  }
  async getDiary(user: User): Promise<Diary> {
    let diary = await this.diaryRepository
      .createQueryBuilder('diary')
      .where('diary.userId = :userId', { userId: user.id })
      .getOne();
    return diary
  }


}