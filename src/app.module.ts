import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProgressModule } from './progress/progress.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProgressModule,
    RouterModule.register([
      {
        path: 'users',
        module: UsersModule,
        children: [
          {
            path: '/',
            module: ProgressModule,
          }
        ],
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'users',
      autoLoadEntities: true,
      synchronize: true,
    }), // temporary.. TODO: trade to mysql
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
