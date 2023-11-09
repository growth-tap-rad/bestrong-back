import { Diary } from 'src/diary/diary.entity';
import { TrainExercise } from 'src/trains_exercises/train_exercise.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Train {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  name: string;

  @Column({ default: 'hipertrofia' })
  goal: string;

  @Column({ default: 'all' })
  level: string;


  // @Column()
  // type: string; // verificar, like A, AB, ABC...

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

  @ManyToOne(() => Diary, (diary) => diary.train)
  diary: Diary;

  @OneToMany(() => TrainExercise, (trains_exercises) => trains_exercises.trains)
  trains_exercises: TrainExercise[];
}
