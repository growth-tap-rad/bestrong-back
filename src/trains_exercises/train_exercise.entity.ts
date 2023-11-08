import { Exercise } from 'src/exercises/exercise.entity';
import { Train } from 'src/trains/train.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TrainExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: "30" })
  rest_duration: number;

  @Column({ default: "0" }) // tirar default
  reps: number;

  @Column({ default: "0" }) // tirar default
  wheight: number;

  @Column({ default: "1" }) 
  series: number;

  // @Column()
  // description: string; // verify

  // @Column()
  // how_todo: string; // verify

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

  @ManyToOne(() => Exercise, (exercises) => exercises.trains_exercises)
  @JoinColumn({ name: 'exercisesId' }) // trocar para exerciseId
  exercises: Exercise;

  @ManyToOne(() => Train, (train) => train.trains_exercises)
  @JoinColumn({ name: 'trainId' })
  trains: Train;
}
