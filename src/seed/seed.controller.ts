import { Controller, Get, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('seeds')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('')
  async seed() {
    return await this.seedService.seed();
  }
}
