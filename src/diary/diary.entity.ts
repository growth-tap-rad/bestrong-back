import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { generateKeyPair } from 'crypto';
import { Progress } from 'src/progress/progress.entity';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  daily_goal_kcal: number

  @Column()
  burned_kcal: number

  @Column()
  consumed_kcal: number

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date

  @Column()
  carb: number

  @Column()
  protein: number

  @Column()
  fat: number

  @Column({
    default: '0'
  })
  water: number


  @ManyToOne(() => User, (user) => user.diary)
  user: User;

  @ManyToOne(() => Progress, (progress) => progress.diary)
  progress: Progress;
  
} 