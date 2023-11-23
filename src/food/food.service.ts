import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Food } from './food.entity';
import { FoodPaginationDto } from './dtos/food.pagination';


@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
  ) { }
  async getFoods(pageDto: FoodPaginationDto, search: string): Promise<Food[]> {

    const pagination = {
      page: pageDto?.page || 0,
      limit: pageDto?.limit || 20,
    };

    let query = this.foodRepository

      .createQueryBuilder('food')
      .skip(pagination.page)
      .take(pagination.limit)
      .orderBy('food.description');

    if (search) {
      query = query.andWhere('food.description LIKE :description', {
        description: `%${search}%`,
      });
    }

    const foods = await query.getMany();

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
