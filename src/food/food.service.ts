import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Food } from './food.entity';
import { FoodDto } from './dtos/food.dto';
import { FoodPaginationDto } from './dtos/food.pagination';
import { skip } from 'node:test';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
  ) { }
  async getFoods(pageDto: FoodPaginationDto): Promise<Food[]> {

    const { page, limit } = pageDto
    const pagination = {
      page: page || 0,
      limit: limit || 20
    }
    let foods = await this.foodRepository
      .createQueryBuilder('food')
      .skip(pagination.page)
      .take(pagination.limit)
      .getMany()

    return foods;
  }

  async getFoodById(id: string): Promise<Food> {
    const numberId = parseInt(id);
    let food = await this.foodRepository.findOneBy({ id: numberId });
    return food;
  }

  async getFoodByIdIbge(idIbge: string): Promise<Food> {
    let food = await this.foodRepository.findOneBy({ id_ibge: idIbge });
    return food;
  }
}
