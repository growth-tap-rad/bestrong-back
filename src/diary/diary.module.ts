import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary])
  ],
  providers: [DiaryService],
  controllers: [DiaryController],
})
export class DiaryModule {}