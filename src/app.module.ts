import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProgressModule } from './progress/progress.module';
import { DiaryModule } from './diary/diary.module';
import { MealModule } from './meal/meal.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProgressModule,
    DiaryModule,
    MealModule,
    RouterModule.register([
      {
        path: 'users',
        module: UsersModule,
        children: [
          {
            path: '/',
            module: ProgressModule,

          },
          {
            path: '/',
            module: DiaryModule,
          },
          {
            path:'/',
            module: MealModule
          },
        ],
      },
    ]),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'users',
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'ucdb',
      database: 'bestrong',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
