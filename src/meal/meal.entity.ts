
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,

} from 'typeorm';

import { Diary } from 'src/diary/diary.entity';
import { MealFood } from 'src/meal_food/meal_food.entity';

@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: "0" })
  meal_consumed_kcal: number

  @Column({ default: "0" })
  meal_consumed_protein: number

  @Column({ default: "0" })
  meal_consumed_carb: number

  @Column({ default: "0" })
  meal_consumed_fat: number

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

  @ManyToOne(() => Diary, (diary) => diary.meal)
  diary: Diary

  @OneToMany(() => MealFood, (mealFood) => mealFood.meal)
  meal_food: MealFood[];
}
