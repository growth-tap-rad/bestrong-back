import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MealFood } from "./meal_food.entity";

@Injectable()
export class MealFoodService {
  constructor(
    @InjectRepository(MealFood) private readonly mealFoodRepository: Repository<MealFood>,
  ) { }


}