import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Diary } from "./diary.entity";
import { Repository } from "typeorm";
import { DiaryDto } from "./dtos/diary.dto";
import { User } from "src/users/user.entity";
import { Progress } from "src/progress/progress.entity";

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary) private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(Progress) private readonly progressRepository: Repository<Progress>
  ) { }

  async createDiary(diaryDto: DiaryDto, user: User): Promise<Diary> {

    let newDiary = new Diary();
    let foundProgress = await this.findProgressId(user.id)
    if(!foundProgress){
      throw ('progresso não encontrado')
    }
    Object.assign(newDiary, diaryDto);

    newDiary.user = user;
    newDiary.progress = foundProgress;

    return this.diaryRepository.save(newDiary);
  }
  findProgressId(id: number) {
    return this.progressRepository
      .createQueryBuilder('progress')
      .where('progress.userId = :userId', { userId: id })
      .getOne() // ver se pega é o ultimo
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
      .leftJoin('diary.progress', 'progress')
      .where('diary.userId = :userId', { userId: user.id })
      .getOne();
      
    console.log("passei aqui ", diary)
    return diary
  }


}