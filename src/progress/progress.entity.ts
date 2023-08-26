import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { ActivityLevelEnum, GoalEnum } from './progress.enums';

@Entity()
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.progress)
  user: User;

  @Column()
  height: number;

  @Column()
  weight: number;

  // @Column({
  //   type: 'enum',
  //   enum: ActivityLevelEnum,
  //   default: ActivityLevelEnum.Sedentary, // Doesnt work on Sqlite, but in mysql Do
  // })
  @Column()
  activity_level: string;

  // @Column({
  //   type: 'enum',
  //   enum: GoalEnum,
  //   default: GoalEnum.Maintain,// Doesnt work on Sqlite, but in mysql Do
  // })
  @Column()
  goal: string;
}
