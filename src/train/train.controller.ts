import { Body, Controller, Post } from "@nestjs/common";
import { TrainService } from "./train.service";
import { TrainsDto } from "./dtos/train.dto";

@Controller()
export class TrainsController{
   constructor(private readonly trainService:TrainService){}

@Post('me/treino')
async createTrains(
   @Body() TrainsData:TrainsDto
 ){
  return this.trainService.createTrains(TrainsData)
 }
}