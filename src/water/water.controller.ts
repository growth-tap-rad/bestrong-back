import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request, Query } from "@nestjs/common";
import { WaterService } from "./water.service";
import { WaterDto } from "./dtos/water.dto";
import { AuthGuard } from "src/auth/auth.guard";

@UseGuards(AuthGuard)
@Controller()
export class WaterController {
    constructor(private readonly waterService: WaterService) { }

    @Post('me/water')
    async createWater(
        @Body() waterData: WaterDto,
        @Request() request: Request
    ) {
        return this.waterService.createWater(waterData, request['user'])
    }
    @Get('me/water')
    async getWater(
        @Request() request: Request, @Query('date') date: string
    ) {
        return this.waterService.getWater(request['user'], date)
    }

    @Delete('me/water/:id')
    async deleteWater(
        @Param('id') id: string
    ) {

        return this.waterService.deleteWater(id)
    }

}


