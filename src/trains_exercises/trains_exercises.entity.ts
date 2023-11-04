import { Exercises } from "src/exercises/exercises.entity";
import { Train } from "src/train/train.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TrainsExercises{
@PrimaryGeneratedColumn()
  id: number;
   
  @Column()
  name: string;

  @Column()
  quantity: number;
  
  @ManyToOne(() => Exercises, (exercises) => exercises.trains_exercises)
  @JoinColumn({ name: 'exercisesId' })
  exercises: Exercises;

  @ManyToOne(() => Train, (train) => train.trains_exercises)
  @JoinColumn({ name: 'trainId' })
  trains: Train;

}