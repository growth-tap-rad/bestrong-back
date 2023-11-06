import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Train } from './train.entity';
import { TrainDto } from './dtos/train.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(Train)
    private readonly trainsRepository: Repository<Train>,
  ) {}
  async createTrain(trainDto: TrainDto) {
    let newTrain = new Train();
    Object.assign(newTrain, trainDto);

    return this.trainsRepository.save(newTrain);
  }
}
