import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Progress } from 'src/progress/progress.entity';
import { Meal } from 'src/meal/meal.entity';
import { Water } from 'src/water/water.entity';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: "0"})
  remaning_daily_goal_kcal: number;

  @Column({default: "0"})
  burned_kcal: number;

  @Column({default: "0"})
  consumed_kcal: number;

  @Column({default: "0"})
  consumed_carb: number;

  @Column({default: "0"})
  consumed_protein: number;

  @Column({default: "0"})
  consumed_fat: number;

  @Column({default: "0"})
  consumed_water:number

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date

  @ManyToOne(() => User, (user) => user.diary)
  user: User;

  @ManyToOne(() => Progress, (progress) => progress.diary)
  progress: Progress;
  
  @OneToMany (()=> Meal, (meal)=> meal.diary)
  meals: Meal[];

  // criar relação com o diary

  @OneToMany(()=> Water, (water) => water.diary)
  water: Water[];

}


