import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Progress } from '../progress/progress.entity';

export enum GenderEnum {
  man = 'man',
  woman = 'woman',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ select: false })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  birthday: Date;

  @Column({
    type: 'enum',
    enum: GenderEnum, // Doesnt work on Sqlite, but in mysql Do
  }) // MYSQL
 // @Column() // sqlite
  gender: string;

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

  @OneToMany(() => Progress, (progress) => progress.user)
  progress: Progress[];
}
