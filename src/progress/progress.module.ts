import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { Progress } from './progress.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Progress, User])
  ],
  providers: [ProgressService],
  controllers: [ProgressController],
})
export class ProgressModule {}