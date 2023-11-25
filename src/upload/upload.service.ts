import { Injectable } from "@nestjs/common";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UploadService {

    private readonly s3Client = new S3Client({
        region: this.configService.getOrThrow('AWS_S3_REGION'),
        credentials: {
            accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACESS_KEY')
        }
    });

    constructor(private readonly configService: ConfigService,

        @InjectRepository(User) private readonly usersRepository: Repository<User>,) { }

    async Upload(fileName: string, file: Buffer, user: User): Promise<string> {
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: 'bestrong-teste',
                Key: `ibagens/${fileName}`,
                Body: file,
            })
        )

        const s3Url = `https://bestrong-teste.s3.amazonaws.com/ibagens/${fileName}`;

        const foundUser = await this.usersRepository.findOneBy({ id: user.id });
        foundUser.avatar = s3Url

        this.usersRepository.save(foundUser)
        return s3Url;
    }

}





