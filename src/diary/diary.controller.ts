import { Controller, Post, Body, UseGuards ,Request} from "@nestjs/common";
import { DiaryService } from "./diary.service";
import { Diary } from "./diary.entity";
import { DiaryDto } from "./dtos/diary.dto";
import { AuthGuard } from "src/auth/auth.guard";


@Controller('')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) { }

  @UseGuards(AuthGuard)
  @Post('me/diary')
  async createDiary(
    @Body() diaryData: DiaryDto,
    @Request() request: Request,
    
  ) {
    return this.diaryService.createDiary(diaryData,request['user'])
  }


}


