import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { WaterService } from "./water.service";
import { WaterDto } from "./dtos/water.dto";


@Controller()
export class WaterController{
  constructor(private readonly waterService: WaterService){}

//criando as rotas crud post, get,delete para chamar na service
@Post('me/water')
async createWater(
    @Body() waterData: WaterDto
){
   return this.waterService.createWater(waterData)
}

@Get('me/water')
async getWater(
   @Body() waterData: WaterDto
){
    return this.waterService.getWater(waterData)
}


@Delete('me/water')
async deleteWater (
    @Body () waterData: WaterDto
){
    return this.waterService.deleteWater(waterData)
}

}


