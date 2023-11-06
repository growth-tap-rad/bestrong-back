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
import { WaterModule } from './water/water.module';
import { FoodModule } from './food/food.module';
import { MealFoodModule } from './meal_food/meal_food.module';
import { MeasureModule } from './measure/measure.module';
import { SeedModule } from './seed/seed.module';
import { ExercisesModule } from './exercises/exercises.module';
import { TrainsModule } from './trains/trains.module';
import { TrainsExercisesModule } from './trains_exercises/trains_exercises.module';
import { MuscleModule } from './muscle/muscle.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProgressModule,
    DiaryModule,
    MealModule,
    WaterModule,
    FoodModule,
    MeasureModule,
    MealFoodModule,
    SeedModule,
    ExercisesModule,
    TrainsModule,
    TrainsExercisesModule,
    MuscleModule,
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
            path: '/',
            module: MealModule,
          },
          {
            path: '/',
            module: WaterModule,
          },
          {
            path: '/',
            module: TrainsModule,
          },
        ],
      },
      {
        path: 'exercises',
        module: ExercisesModule,
        children: [
          {
            path: '/',
            module: MuscleModule,
          },
        ],
      },
    ]),
    // TypeOrmModule.forRoot({ sql-lite
    //   type: 'sqlite',
    //   database: 'users',
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.host,
      port: parseInt(process.env.port),
      username: process.env.dbusername,
      password: process.env.dbpassword,
      database: process.env.database,
      autoLoadEntities: Boolean(process.env.autoLoadEntities),
      synchronize: Boolean(process.env.synchronize),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
