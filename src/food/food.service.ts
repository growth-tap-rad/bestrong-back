import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Food } from './food.entity';
import { FoodPaginationDto } from './dtos/food.pagination';
import { Measure } from 'src/measure/measure.entity';

@Injectable()
export class FoodService {
  constructor(

    @InjectRepository(Measure)
    private readonly measureRepository: Repository<Measure>,
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) { }
  async getFoods(pageDto: FoodPaginationDto, search: string): Promise<Food[]> {
    const pagination = {
      page: pageDto?.page || 0,
      limit: pageDto?.limit || 20,
    };

    let query = this.foodRepository
      .createQueryBuilder('food')
      .innerJoin('food.measures', 'measure');

    if (search) {
      query = query.andWhere(
        'LOWER(food.description) LIKE LOWER(:description)',
        {
          description: `%${search.toLowerCase()}%`,
        },
      );
    }

    const foods = await query
      .skip(pagination.page)
      .take(pagination.limit)
      .orderBy('food.description', 'ASC')
      .getMany();

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
