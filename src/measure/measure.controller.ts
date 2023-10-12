
import { Controller, Post, Body, UseGuards, Request, Get, Param} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { MeasureService } from "./measure.service";
import { MeasureDto } from "./dtos/measure.dto";

@Controller('measures')
export class MeasureController {
  constructor(private readonly measureService: MeasureService) { }

 // @UseGuards(AuthGuard) // COLOCAR
 @Get('')
 async getMeasures() {
   return this.measureService.getMeasures();
 }

  // @UseGuards(AuthGuard) // COLOCAR
 @Get('/:id')
 async getMeasure(
   @Param('id') id: string
 ) {
   return this.measureService.getMeasureById(id);
 }
}