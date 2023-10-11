import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Water } from "./water.entity";
import { Repository } from "typeorm";
import { WaterDto } from "./dtos/water.dto";

@Injectable()
export class WaterService{
    constructor(
        @InjectRepository(Water)
        private readonly waterRepository: Repository<Water>
        // acho que terei que injatar o repositorio de diary tambem
    ){}
// criar o crud
//post, delete e get

    async createWater(waterData:WaterDto){
        let newWater = new Water();
        Object.assign(newWater, waterData)
        return this.waterRepository.save(newWater)

    }

    async getWater(waterData:WaterDto){
        let water = await this.waterRepository
        .createQueryBuilder('water')
        .where('water.id = :waterid',{waterid: waterData.id})
        .getOne()

        return water;
    }

     async deleteWater(waterData:WaterDto){
        let water = await this.waterRepository
        .createQueryBuilder('water')
        .where('water.id = :waterid', {waterid: waterData.id})
        .getOne()
         console.log(water,'o que vem ness merda')
        return this.waterRepository.delete(water)
     }






}