import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Train } from './train.entity';
import { TrainDto } from './dtos/train.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(Train)
    private readonly trainsRepository: Repository<Train>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createTrain(trainDto: TrainDto, user: User) {
    let newTrain = new Train();
    Object.assign(newTrain, trainDto);

    const foundUser = await this.userRepository

      .createQueryBuilder('user')
      .leftJoinAndSelect('user.diary', 'diary')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('diary.created_at', 'DESC')
      .getOne();
    newTrain.diary = foundUser.diary[0];

    return this.trainsRepository.save(newTrain);
  }

  async getTrains(user: User): Promise<Train[]> {
    return await this.trainsRepository
      .createQueryBuilder('train')
      .leftJoin('train.diary', 'diary')
      .leftJoin('train.trains_exercises', 'trains_exercises')
      .where('diary.userId = :userId', { userId: user.id })
      .orderBy('diary.id', 'DESC')
      .getMany(); // todo: corrigir isso
  }

  async getTrain(id: string): Promise<Train> {
    return await this.trainsRepository
      .createQueryBuilder('train')
      .leftJoin('train.trains_exercises', 'trains_exercises')
      .leftJoin('trains_exercises.exercises', 'exercise')
      .where('train.id = :id', { id })
      .getOne();
  }

  async editTrain(trainDto: TrainDto, id: string): Promise<Train> {
    let train = await this.trainsRepository
      .createQueryBuilder('train')
      .where('train.id= :id', { id })
      .getOne();

    Object.assign(train, trainDto);
    return await this.trainsRepository.save(train);
  }
}
