import { Controller, Request, ParseFilePipe, UploadedFile, UseGuards, UseInterceptors, Put } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/auth/auth.guard";

@Controller('upload')
export class UpLoadController {
    constructor(private readonly uploadService: UploadService) { }
    @UseGuards(AuthGuard)
    @Put('/')
    @UseInterceptors(FileInterceptor('file'))
    async Upload(@Request() request: Request, @UploadedFile(

        
        new ParseFilePipe({
            validators: [
                // new MaxFileSizeValidator({maxSize:1000}),
                // new FileTypeValidator({fileType:'image/jpeg'})
            ]
        })
    ) file: Express.Multer.File,
    ) {
        
        const url =await this.uploadService.Upload(file.originalname, file.buffer, request['user'])
        return url;
    }

   
}