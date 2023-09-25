
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,

  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,

} from 'typeorm';

import { Diary } from 'src/diary/diary.entity';


@Entity()

export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

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

 
  @ManyToMany((type) => Diary, (diary) => diary.meals)
  diaries: Diary[]


}
