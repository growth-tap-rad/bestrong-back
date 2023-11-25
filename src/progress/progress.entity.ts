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
import { ActivityLevelEnum, GoalWheightEnum } from './constants/progress.enums';
import { Diary } from 'src/diary/diary.entity';

@Entity()
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  height: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
  })
  weight: number;

  @Column({
    type: 'enum',
    enum: ActivityLevelEnum,
  })
  activity_level: string;

  @Column({
    type: 'enum',
    enum: GoalWheightEnum,
  })
  goal: string;

  @Column()
  daily_goal_kcal: number;

  @Column()
  carb: number;

  @Column()
  protein: number;

  @Column()
  fat: number;

  @Column({ type: 'int', default: "0" })
  year: number;

  @Column({ type: 'int', default: "0" })
  month: number;

  @Column({ type: 'int', default: "0" })
  day: number;

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

  @ManyToOne(() => User, (user) => user.progress)
  user: User;

  @OneToMany(() => Diary, (diary) => diary.progress)
  diary: Diary[];
}
