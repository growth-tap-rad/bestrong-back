import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Water } from "./water.entity";
import { WaterService } from "./water.service";
import { WaterController } from "./water.controller";
import { User } from "src/users/user.entity";
@Module({
    imports: [
        TypeOrmModule.forFeature([Water, User])
    ],
    providers: [WaterService],
    controllers: [WaterController]
})

export class WaterModule { }