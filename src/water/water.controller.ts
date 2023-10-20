import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request } from "@nestjs/common";
import { WaterService } from "./water.service";
import { WaterDto } from "./dtos/water.dto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller()
export class WaterController {
    constructor(private readonly waterService: WaterService) { }

    @UseGuards(AuthGuard)
    @Post('me/water')
    async createWater(
        @Body() waterData: WaterDto,
        @Request() request: Request
    ) {
        return this.waterService.createWater(waterData, request['user'])
    }
    @UseGuards(AuthGuard)
    @Get('me/water')
    async getWater(
        @Request() request: Request,
    ) {
        return this.waterService.getWater(request['user'])
    }

    @UseGuards(AuthGuard)
    @Delete('me/water/:id')
    async deleteWater(
        @Param() id: string
    ) {

        return this.waterService.deleteWater(id)
    }

}


