import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Train } from "./train.entity";
import { TrainsDto } from "./dtos/train.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TrainService{
    constructor(
        @InjectRepository(Train)private readonly trainRepository: Repository<Train>
    ){}
    async createTrains(TrainsData:TrainsDto){
        let newTrains = new Train
        Object.assign(newTrains, TrainsData)
   
    return this.trainRepository.save(newTrains)
    }
}

