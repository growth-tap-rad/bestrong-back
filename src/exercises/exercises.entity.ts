import { TrainsExercises } from "src/trains_exercises/trains_exercises.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Exercises{

@PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(()=>TrainsExercises, (trains_exercises)=>trains_exercises.exercises)
  trains_exercises:TrainsExercises[];

}