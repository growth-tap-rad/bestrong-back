
import { Food } from 'src/food/food.entity';
import { Meal } from 'src/meal/meal.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,

} from 'typeorm';


@Entity()
export class MealFood {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  unity: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Meal, (meal) => meal.meal_food)
  @JoinColumn({ name: 'mealId' })
  meal: Meal;

  @ManyToOne(() => Food, (food) => food.meal_food)
  @JoinColumn({ name: 'foodId' })
  food: Food;
}
