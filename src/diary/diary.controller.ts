import { Controller, Post, Body, UseGuards, Request, Put, Get } from "@nestjs/common";
import { DiaryService } from "./diary.service";
import { DiaryDto } from "./dtos/diary.dto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller('')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) { }

  @UseGuards(AuthGuard)
  @Post('/me/diary')
  async createDiary(
    @Body() diaryData: DiaryDto,
    @Request() request: Request,

  ) {
    return this.diaryService.createDiary(diaryData, request['user'])
  }
  @UseGuards(AuthGuard)
  @Get('/me/diary')
  async getDiary(
    @Request() request: Request,
  ) {
    return this.diaryService.getDiary(request['user'])
  }

  @UseGuards(AuthGuard)
  @Put('/me/diary')
  async editDiary(
    @Body() diaryData: DiaryDto,
    @Request() request: Request,

  ) {
    return this.diaryService.editDiary(diaryData, request['user'])
  }
}


