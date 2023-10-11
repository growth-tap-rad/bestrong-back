import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Water } from "./water.entity";
import { WaterService } from "./water.service";
import { WaterController } from "./water.controller";


@Module({
    imports:[
        //passar a entidade na forFeature
        TypeOrmModule.forFeature([Water])     
    ],
    providers:[WaterService],
    controllers:[WaterController]
})

export class WaterModule{}