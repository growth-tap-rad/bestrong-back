import { Diary } from "src/diary/diary.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Water {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  consumed_water: number

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @ManyToOne(() => Diary, (diary) => diary.water)
  diary: Diary;

}