import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
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
