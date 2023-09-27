import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
<<<<<<< Updated upstream
=======
  OneToMany,
>>>>>>> Stashed changes
} from 'typeorm';
import { User } from '../users/user.entity';
import { Progress } from 'src/progress/progress.entity';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: "0"})
  consumed_daily_goal_kcal: number;

  @Column({default: "0"})
  burned_kcal: number;

  @Column({default: "0"})
  consumed_kcal: number;

  @Column({default: "0"})
  consumed_carb: number;

  @Column({default: "0"})
  consumed_protein: number;

  @Column({default: "0"})
  consumed_fat: number;

  @Column({default: "0"})
  consumed_water:number

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date

  @ManyToOne(() => User, (user) => user.diary)
  user: User;

  @ManyToOne(() => Progress, (progress) => progress.diary)
  progress: Progress;
}

