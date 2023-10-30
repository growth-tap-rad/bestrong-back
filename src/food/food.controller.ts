import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { FoodService } from './food.service';
import { FoodDto } from './dtos/food.dto';
import { FoodPaginationDto } from './dtos/food.pagination';

@Controller('')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

 // @UseGuards(AuthGuard) // COLOCAR
  @Get('')
  async getFoods(
    @Query('') paginationDto: FoodPaginationDto,
    @Query('search') search: string,
  ) {
    return this.foodService.getFoods(paginationDto, search);
  }

   // @UseGuards(AuthGuard) // COLOCAR
  @Get('/:id')
  async getFoodById(
    @Param('id') id: string
  ) {
    return this.foodService.getFoodById(id);
  }
// @UseGuards(AuthGuard) // COLOCAR
  @Get('/:idIbge')
  async getFoodByIdIbge(
    @Param('idIbge') idIbge: string
  ) {
    return this.foodService.getFoodByIdIbge(idIbge);
  }
}
