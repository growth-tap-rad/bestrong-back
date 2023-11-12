import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Put,
  Get,
  Query,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryDto } from './dtos/diary.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post('/me/diary')
  async createDiary(@Body() diaryData: DiaryDto, @Request() request: Request) {
    return this.diaryService.createDiary(diaryData, request['user']);
  }

  @Get('/me/diary')
  async getDiary(@Request() request: Request, @Query('date') date: string) {
    return this.diaryService.getDiary(request['user'], date);
  }

  @Put('/me/diary')
  async editDiary(@Body() diaryData: DiaryDto, @Request() request: Request) {
    return this.diaryService.editDiary(diaryData, request['user']);
  }
}
