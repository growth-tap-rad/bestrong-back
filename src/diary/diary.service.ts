import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { Repository } from 'typeorm';
import { DiaryDto } from './dtos/diary.dto';
import { User } from 'src/users/user.entity';
import { Progress } from 'src/progress/progress.entity';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
  ) {}

  async createDiary(diaryDto: DiaryDto, user: User): Promise<Diary> {
    let newDiary = new Diary();
    let foundProgress = await this.findProgressById(user.id);
    if (!foundProgress) {
      throw new Error('progresso não encontrado');
    }
    Object.assign(newDiary, diaryDto);

    newDiary.user = user;
    newDiary.progress = foundProgress;

    return this.diaryRepository.save(newDiary);
  }

  async editDiary(diaryDto: DiaryDto, user: User): Promise<Diary> {
    let diary = await this.diaryRepository
      .createQueryBuilder('diary')
      .where('diary.userId = :userId', { userId: user.id })
      .getOne();
    /* Object.assign(diary, diaryDto)*/

    diary.consumed_water += diaryDto.consumed_water;
    // Fazer somente =, para sobrescever, caso ele precise adicionar agua
    //faca isso no front pegando o valor da agua atual da req, e somando com oq ele adicionar na agua
    // ai nesta rota ele recebe somente o valor  diary.water = diaryDto.water

    return this.diaryRepository.save(diary);
  }
  async getDiary(user: User): Promise<Diary> {
    let diary = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.progress', 'progress')
      .where('diary.userId = :userId', { userId: user.id })
      .orderBy('diary.created_at', 'DESC')
      .getOne();

    return diary;
  }

  findProgressById(userId: number): Promise<Progress> {
    return this.progressRepository
      .createQueryBuilder('progress')
      .where('progress.userId = :userId', { userId })
      .orderBy('progress.created_at', 'DESC')
      .getOne(); // ver se pega é o ultimo
  }
}
