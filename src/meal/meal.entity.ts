
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,

} from 'typeorm';

import { Diary } from 'src/diary/diary.entity';

export enum TypeMealEnum {
  cafeManha = 'cafeDaManha',
  lanche = 'lanche',
  almoco = 'almoço',
  lancheTarde = 'lancheDaTarde',
  jantar = 'jantar',
  ceia = 'ceia'
}

@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: TypeMealEnum
  })
  type: string 


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

 
  @ManyToOne(() => Diary, (diary) => diary.meal)
  diary: Diary
}
