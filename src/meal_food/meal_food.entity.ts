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
  amount: number;

  @Column()
  quantity: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @ManyToOne(() => Meal, (meal) => meal.meal_food)
  @JoinColumn({ name: 'mealId' })
  meal: Meal;

  @ManyToOne(() => Food, (food) => food.meal_food)
  @JoinColumn({ name: 'foodId' })
  food: Food;
}
