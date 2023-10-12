
import { Food } from 'src/food/food.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,

} from 'typeorm';


@Entity()
export class Measure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number | null;

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

  @ManyToOne(() => Food, (food) => food.measures)
  food: Food;
}