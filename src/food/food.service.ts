import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Food } from './food.entity';
import { FoodDto } from './dtos/food.dto';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
  ) {}

  async getFoods(): Promise<Food[]> {
    let foods = await this.foodRepository.find({});
    return foods;
  }

  async getFoodById(id: string): Promise<Food> {
    const numberId = parseInt(id);
    let food = await this.foodRepository.findOneBy({id : numberId});
    return food;
  }

  async getFoodByIdIbge(idIbge: string): Promise<Food> {
    let food = await this.foodRepository.findOneBy({id_ibge : idIbge});
    return food;
  }
}
