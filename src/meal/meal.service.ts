import { BadRequestException, Injectable } from "@nestjs/common";
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
    const foundUser = await this.userRepository

      .createQueryBuilder('user')
      .leftJoinAndSelect('user.diary', 'diary')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('diary.id', 'DESC')
      .getOne();


    Object.assign(newMeal, mealDto)

    newMeal.diary = foundUser.diary[0]

    return this.mealRepository.save(newMeal);
  }
  async findMeal(id: string): Promise<Meal> {
    return await this.mealRepository
      .createQueryBuilder('meal')
      .where('meal.id = :id', { id })
      .getOne();

    // ver como relaciona essa parte

  }
  async editMeal(mealData: MealDto, id: string): Promise<Meal> {

    let meal = await this.mealRepository
      .createQueryBuilder('meal')
      .where('meal.id= :id', { id })
      .getOne()

    Object.assign(meal, mealData)
    return await this.mealRepository.save(meal)
  }

}