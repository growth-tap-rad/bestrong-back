import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column()
  birthday: Date;

  @Column()
  height: number;

  @Column()
  weight: number;

  @Column()
  activity_level: string; // TODO enum not working

  @Column()
  goal: string; // TODO enum not working

}