import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { Progress } from 'src/progress/progress.entity';
import { Water } from 'src/water/water.entity';
import { Meal } from 'src/meal/meal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary, Progress, Water,Meal])
  ],
  providers: [DiaryService],
  controllers: [DiaryController],
})
export class DiaryModule {}