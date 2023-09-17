import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

import { ActivityLevelEnum, GoalWheightEnum } from './constants/progress.enums';

@Entity()
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  height: number;

  @Column({
    type: "double"
  })
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
}
