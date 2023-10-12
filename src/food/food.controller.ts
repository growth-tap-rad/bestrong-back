import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { FoodService } from './food.service';
import { FoodDto } from './dtos/food.dto';

@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

 // @UseGuards(AuthGuard) // COLOCAR
  @Get('')
  async getFoods() {
    return this.foodService.getFoods();
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
