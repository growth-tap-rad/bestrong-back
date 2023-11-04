import { Diary } from "src/diary/diary.entity";
import { TrainsExercises } from "src/trains_exercises/trains_exercises.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Train {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    repetition: number

    @Column()
    weight: number

    @Column()
    duration: number

    @ManyToOne(() => Diary, (diary) => diary.train)
    diary: Diary

    @OneToMany(() => TrainsExercises, (trains_exercises) => trains_exercises.trains)
    trains_exercises: TrainsExercises[];


}
