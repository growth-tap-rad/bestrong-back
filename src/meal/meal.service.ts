import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/users/user.entity";
import { Meal } from "./meal.entity";
import { MealDto } from "./dtos/meal.dto";

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal) private readonly mealRepository: Repository<Meal>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async createMeal(mealDto: MealDto, user: User): Promise<Meal> {

    let newMeal = new Meal();

    const dateValid = new Date(mealDto.date + 'T00:00:00.000');
    dateValid.setUTCHours(0, 0, 0, 0);

    const foundUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.diary', 'diary')
      .where('user.id = :userId', { userId: user.id })
      .where('diary.userId = :userId', { userId: user.id })
      .andWhere('diary.year = :year', { year: dateValid.getUTCFullYear() })
      .andWhere('diary.month = :month', { month: dateValid.getUTCMonth() + 1 })
      .andWhere('diary.day = :day', { day: dateValid.getUTCDate() })
      .orderBy('diary.id', 'DESC')
      .getOne();


    if (!foundUser) {
      throw new NotFoundException(
        'Diário não encontrado para a data especificada',
      );
    }
    Object.assign(newMeal, mealDto)
    newMeal.diary = foundUser.diary[0]
    return this.mealRepository.save(newMeal);
    
  }
  async findMeal(id: string): Promise<Meal> {
    return await this.mealRepository
      .createQueryBuilder('meal')
      .leftJoinAndSelect('meal.meal_food', 'meal_food')
      .leftJoinAndSelect('meal_food.food', 'foods')
      .where('meal.id = :id', { id })
      .getOne();
  }
  async editMeal(mealData: MealDto, id: string): Promise<Meal> {

    let meal = await this.mealRepository
      .createQueryBuilder('meal')
      .where('meal.id= :id', { id })
      .getOne()

    Object.assign(meal, mealData)
    return await this.mealRepository.save(meal)
  }

  async deleteMeal(id: string) {
    return await this.mealRepository.delete(id)
  }

}