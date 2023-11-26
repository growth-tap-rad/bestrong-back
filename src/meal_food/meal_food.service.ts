import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MealFood } from './meal_food.entity';
import { User } from 'src/users/user.entity';
import { MealFoodDto } from 'src/meal_food/dtos/meal_food.dto';
import { Food } from 'src/food/food.entity';
import { Meal } from 'src/meal/meal.entity';
import { Console } from 'console';

@Injectable()
export class MealFoodService {
  constructor(
    @InjectRepository(MealFood)
    private readonly mealFoodRepository: Repository<MealFood>,
    @InjectRepository(Food) private readonly FoodRepository: Repository<Food>,
    @InjectRepository(Meal) private readonly MealRepository: Repository<Meal>,
  ) {}

  async createMealFood(mealFoodDto: MealFoodDto) {
    const meal_food = new MealFood();
    const food = await this.FoodRepository.findOneBy({
      id: mealFoodDto.food_id,
    });
    const meal = await this.MealRepository.findOneBy({
      id: mealFoodDto.meal_id,
    });

    if (!(food && meal)) {
      throw new NotFoundException('food ou meal não existe');
    }

    Object.assign(meal_food, mealFoodDto);
    meal_food.food = food;
    meal_food.meal = meal;

    return this.mealFoodRepository.save(meal_food);
  }

  async deleteMealFood(id: number) {
    return await this.mealFoodRepository.delete(id);
  }

  async editMealFood(mealFoodDto: MealFoodDto, id: number) {
    const meal_food = await this.mealFoodRepository.findOneBy({ id: id });

    if (!meal_food) {
      throw new NotFoundException('meal_food não existe');
    }

    Object.assign(meal_food, mealFoodDto);

    return this.mealFoodRepository.save(meal_food);
  }

  getMealFood(id: string): Promise<MealFood> {
    return this.mealFoodRepository.findOneBy({ id: parseInt(id) });
  }
}
