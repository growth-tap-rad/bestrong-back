import { Muscle } from 'src/muscle/muscle.entity';
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
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 'all' })
  level: string;

  @Column({ nullable: true })
  muscleId: number;

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

  @ManyToOne(() => Muscle, (muscle) => muscle.exercises)
  muscle: Muscle;

  @OneToMany(
    () => TrainExercise,
    (trains_exercises) => trains_exercises.exercises,
  )
  trains_exercises: TrainExercise[];
}
