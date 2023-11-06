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

@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

 @UseGuards(AuthGuard)
  @Get('')
  async getFoods(
    @Query('') paginationDto: FoodPaginationDto,
    @Query('search') search: string,
  ) {
    return this.foodService.getFoods(paginationDto, search);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getFoodById(
    @Param('id') id: string
  ) {
    return this.foodService.getFoodById(id);
  }
  @UseGuards(AuthGuard)
  @Get('/:idIbge')
  async getFoodByIdIbge(
    @Param('idIbge') idIbge: string
  ) {
    return this.foodService.getFoodByIdIbge(idIbge);
  }
}
