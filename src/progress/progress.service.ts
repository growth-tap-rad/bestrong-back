import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Progress } from './progress.entity';
import { ProgressDto } from './dtos/progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress) private progressRepository: Repository<Progress>,
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

  
}
