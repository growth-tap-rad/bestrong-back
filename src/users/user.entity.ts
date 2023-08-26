import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Progress } from '../progress/progress.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Progress, progress => progress.user)
  progress: Progress[];

  @Column()
  name: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  birthday: Date;

}
