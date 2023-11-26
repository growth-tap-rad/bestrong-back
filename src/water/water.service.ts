import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Water } from './water.entity';
import { Repository } from 'typeorm';
import { WaterDto } from './dtos/water.dto';
import { User } from 'src/users/user.entity';
import { Diary } from 'src/diary/diary.entity';

@Injectable()
export class WaterService {
  constructor(
    @InjectRepository(Water)
    private readonly waterRepository: Repository<Water>,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}

  async createWater(waterData: WaterDto, user: User): Promise<Water> {
    let newWater = new Water();
    Object.assign(newWater, waterData);

    const dateValid = new Date(waterData.date + 'T00:00:00.000');
    dateValid.setUTCHours(0, 0, 0, 0);

    if (isNaN(dateValid.getTime())) {
      throw new BadRequestException('Data especificada inválida');
    }

    const foundDiary = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.water', 'water')
      .where('diary.userId = :userId', { userId: user.id })
      .andWhere('diary.year = :year', { year: dateValid.getUTCFullYear() })
      .andWhere('diary.month = :month', { month: dateValid.getUTCMonth() + 1 })
      .andWhere('diary.day = :day', { day: dateValid.getUTCDate() })
      .orderBy('diary.id', 'DESC')
      .getOne();

    if (!foundDiary) {
      throw new NotFoundException(
        'Diário não encontrado para a data especificada',
      );
    }

    newWater.diary = foundDiary;
    return this.waterRepository.save(newWater);
  }

  async getWater(user: User, date: string) {
    const dateValid = new Date(date + 'T00:00:00.000');
    dateValid.setUTCHours(0, 0, 0, 0);

    if (isNaN(dateValid.getTime())) {
      throw new BadRequestException('Data especificada inválida');
    }

    const foundDiary = await this.waterRepository
      .createQueryBuilder('water')
      .leftJoinAndSelect('water.diary', 'diary')
      .where('diary.userId = :userId', { userId: user.id })
      .andWhere('diary.year = :year', { year: dateValid.getUTCFullYear() })
      .andWhere('diary.month = :month', { month: dateValid.getUTCMonth() + 1 })
      .andWhere('diary.day = :day', { day: dateValid.getUTCDate() })
      .orderBy('diary.id', 'DESC')
      .getMany();

    if (!foundDiary) {
      throw new NotFoundException(
        'Diário não encontrado para a data especificada',
      );
    }

    return foundDiary;
  }

  async deleteWater(id: string) {
    return this.waterRepository.delete(id);
  }
}
