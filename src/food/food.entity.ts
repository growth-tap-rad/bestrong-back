import { MealFood } from 'src/meal_food/meal_food.entity';
import { Measure } from 'src/measure/measure.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: ""})
  id_ibge: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  energy: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  carb: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  protein: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fat: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fiber: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  sodium: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  iron: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fat_sat: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fat_trans: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  sugar: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  calcium: number | null;

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

  @OneToMany(() => Measure, (measure) => measure.food)
  measures: Measure[];

  @OneToMany(() => MealFood, (mealFood) => mealFood.food)
  meal_food: MealFood[];
}
