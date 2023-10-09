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

  @Column()
  weight: number;

  @Column({
    type: 'enum',
    enum: ActivityLevelEnum, // MYSQL
  })
  // @Column() // sqlite
  activity_level: string;

  @Column({
    type: 'enum',
    enum: GoalWheightEnum, // MYSQL
  })
  //  @Column() // sqlite;
  goal: string;

  @Column()
  //  @Column() // sqlite;
  daily_goal_kcal: number;

  @Column()
  //  @Column() // sqlite;
  carb: number;

  @Column()
  //  @Column() // sqlite;
  protein: number;

  @Column()
  //  @Column() // sqlite;
  fat: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date; // MYSQL

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date; // MYSQL

  @ManyToOne(() => User, (user) => user.progress)
  user: User;
  
  @OneToMany(() => Diary, (diary) => diary.progress)
  diary: Diary[];
}
