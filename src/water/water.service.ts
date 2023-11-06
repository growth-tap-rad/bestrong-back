import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Water } from "./water.entity";
import { Repository } from "typeorm";
import { WaterDto } from "./dtos/water.dto";
import { User } from "src/users/user.entity";


@Injectable()
export class WaterService {

    constructor(
        @InjectRepository(Water)
        private readonly waterRepository: Repository<Water>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

    ) { }

    async createWater(waterData: WaterDto, user: User): Promise<Water> {

        let newWater = new Water();
        Object.assign(newWater, waterData)
        const foundUser = await this.userRepository

            .createQueryBuilder('user')
            .leftJoinAndSelect('user.diary', 'diary')
            .where('user.id = :userId', { userId: user.id })
            .orderBy('diary.created_at', 'DESC')
            .getOne();
        newWater.diary = foundUser.diary[0]
        return this.waterRepository.save(newWater)
    }

    async getWater(user: User) {
        const waterAndDiary = await this.waterRepository
            .createQueryBuilder('water')
            .leftJoin('water.diary', 'diary')
            .where('diary.userId = :userId', { userId: user.id })
            .orderBy('diary.id', 'DESC')
            .getMany();

        return waterAndDiary;
    }

    async deleteWater(id: string) {
        return this.waterRepository.delete(id)
    }

}