import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Measure } from "./measure.entity";
import { MeasureDto } from "./dtos/measure.dto";

@Injectable()
export class MeasureService {
  constructor(
    @InjectRepository(Measure) private readonly measureRepository: Repository<Measure>,
  ) { }

  async getMeasures(): Promise<Measure[]> {
    let measures = await this.measureRepository.find({});
    return measures;
  }

  async getMeasureById(id: string): Promise<Measure> {
    const numberId = parseInt(id);
    let measure = await this.measureRepository.findOneBy({id : numberId});
    return measure;
  }
}