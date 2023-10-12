import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seeds')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('')
  async seed() {
    return await this.seedService.seed();
  }
}
