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
      .orderBy('diary.created_at', 'DESC')
      .getOne();


    Object.assign(newMeal, mealDto)

    newMeal.diary = foundUser.diary[0]

    return this.mealRepository.save(newMeal);
  }
  async getMeal(user: User): Promise<Meal> {

    return await this.mealRepository
      .createQueryBuilder('meal')
      .where('meal.diaryId = :userId', { userId: user.id })
      .getOne();

    // ver como relaciona essa parte

  }

}