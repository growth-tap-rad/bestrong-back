import { Controller, Post, Body, UseGuards, Request, Put, Patch, Get } from "@nestjs/common";
import { DiaryService } from "./diary.service";
import { Diary } from "./diary.entity";
import { DiaryDto } from "./dtos/diary.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { request } from "http";



@Controller('')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) { }

  @UseGuards(AuthGuard)
  @Post('me/diary')
  async createDiary(
    @Body() diaryData: DiaryDto,
    @Request() request: Request,

  ) {
    return this.diaryService.createDiary(diaryData, request['user'])
  }
  @UseGuards(AuthGuard)
  @Get('me/diary')
  async getDiary(
    @Request() request: Request,
  ) {
    return this.diaryService.getDiary(request['user'])
  }

  @UseGuards(AuthGuard)
  @Put('me/edit-diary')
  async editDiary(
    @Body() diaryData: DiaryDto,
    @Request() request: Request,

  ) {
    return this.diaryService.editDiary(diaryData, request['user'])
  }



}


