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

 // @UseGuards(AuthGuard) // COLOCAR
  @Get('')
  async getFoods(
    @Query() per_page: FoodPaginationDto
  ) {
    return this.foodService.getFoods(per_page);
  }

   // @UseGuards(AuthGuard) // COLOCAR
  @Get('/:id')
  async getFoodById(
    @Param('id') id: string
  ) {
    return this.foodService.getFoodById(id);
  }

  @Get('/:idIbge')
  async getFoodByIdIbge(
    @Param('idIbge') idIbge: string
  ) {
    return this.foodService.getFoodByIdIbge(idIbge);
  }
}
