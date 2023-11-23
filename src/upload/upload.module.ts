import { Module } from "@nestjs/common";
import { UpLoadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";


@Module({
     imports: [
      ConfigModule,
      TypeOrmModule.forFeature([User]),
     ],
    providers: [UploadService],
    controllers: [UpLoadController],
  })
  export class UploadModule {}