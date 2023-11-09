import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Food } from 'src/food/food.entity';
import { Measure } from 'src/measure/measure.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { Muscle } from 'src/muscle/muscle.entity';
import { EXERCISES } from './definitions/Exercises';
import { Exercise } from 'src/exercises/exercise.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Measure)
    private readonly measureRepository: Repository<Measure>,
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
    @InjectRepository(Muscle)
    private readonly muscleRepository: Repository<Muscle>,
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
  ) {}

  async seed(): Promise<string> {
    try {
      await this.seedFoodProductsGrowth(
        'src/assets/seeds/planilha_produtos_growth.csv',
      );

      await this.seedFoodFoodsGrowth('src/assets/seeds/alimentos_growth.csv');

      await this.seedMeasureProductsGrowth(
        'src/assets/seeds/planilha_produtos_growth.csv',
      );

      await this.seedMeasureFoodsGrowth(
        'src/assets/seeds/alimentos_growth.csv',
      );

      await this.seedFoodsIbge('src/assets/seeds/ibge.csv');

      await this.updateNullFieldsFoodToZero();

      await this.seedMeasureIbge('src/assets/seeds/ibge_medidas.csv');

      await this.seedMuscles();
      await this.seedExercises();

      console.log('\nSeeds Successfull Finished!');

      return 'Seeds Successfull Finished!';
    } catch (error) {
      throw error;
    }
  }

  async seedFoodProductsGrowth(filePath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const results = [];

      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', (row) => {
          //console.log('Linha do CSV:', row);
          const food = new Food();

          food.description = row[1] || '';
          food.energy = row[4] != '-' ? parseFloat(row[4]) : 0;
          food.carb = row[6] != '-' ? parseFloat(row[6]) : 0;
          food.protein = row[5] != '-' ? parseFloat(row[5]) : 0;
          food.fat = row[7] != '-' ? parseFloat(row[7]) : 0;

          results.push(food);
        })
        .on('end', async () => {
          //console.log('Dados de Food:', results);
          try {
            console.log('Seeding Products Growth...\n');
            await this.foodRepository.save(results);
            resolve();
          } catch (error) {
            console.error('Erro em seed products growth:', error);
            reject(error);
          }
        });
    });
  }

  async seedFoodFoodsGrowth(filePath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const results = [];

      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', (row) => {
          // console.log('Linha do CSV:', row);
          const food = new Food();

          food.description = row[1] || '';
          food.energy = row[6] != '-' ? parseFloat(row[6]) : 0;
          food.carb = row[7] != '-' ? parseFloat(row[7]) : 0;
          food.protein = row[5] != '-' ? parseFloat(row[5]) : 0;
          food.fat = row[8] != '-' ? parseFloat(row[8]) : 0;
          food.fiber = row[10] != '-' ? parseFloat(row[10]) : 0;
          food.sodium = row[12] != '-' ? parseFloat(row[12]) : 0;

          results.push(food);
        })
        .on('end', async () => {
          // console.log('Dados de Food:', results);
          try {
            console.log('Seeding Foods Growth...\n');
            await this.foodRepository.save(results);

            // await this.updateNullFieldsFoodToZero();

            resolve();
          } catch (error) {
            console.error('Erro em seed foods growth:', error);
            reject(error);
          }
        });
    });
  }

  async updateNullFieldsFoodToZero(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const fieldsToUpdate = [
        'carb',
        'energy',
        'protein',
        'fat',
        'fat_trans',
        'fat_sat',
        'fiber',
        'sugar',
        'sodium',
        'calcium',
        'iron',
      ];

      try {
        console.log('Seeding update Null fileds on Food... \n');
        for (const field of fieldsToUpdate) {
          try {
            // console.log('Updating field:', field);
            await this.foodRepository
              .createQueryBuilder()
              .update(Food)
              .set({ [field]: 0 })
              .where(`${field} IS NULL`)
              .execute();
          } catch (error) {
            console.error(`Error updating field - ${field}: ${error}`);
          }
        }
        console.log('Updated Null fileds on Food. \n');
        resolve();
      } catch (error) {
        console.error('Erro em seed update null fileds:', error);
        reject(error);
      }
    });
  }

  async seedMeasureProductsGrowth(filePath: string): Promise<void> {
    console.log('Seeding Measure Products Growth...\n');

    return new Promise(async (resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', async (row) => {
          // console.log('Linha do CSV:', row);
          const measure = new Measure();

          const food = await this.foodRepository.findOneBy({
            description: row[1],
          });

          const DESC = row[2];

          const SCOOP = 'scoop';
          const BARRA = 'barra';
          const COMP = 'comprimido';
          const CAPS = 'capsulas';

          if (food) {
            measure.food = food;
            measure.description = row[2] || '';
            measure.amount = parseFloat(row[3]) || 1;

            //         if (!DESC.includes('Grama')) {
            // //CALCULO AINDA NAO FUNCIONANDO COM GRAMAS, DE SUPLEMENTOS GROWTH, POIS OS MACROS
            // // E CALORIAS DELES SAO BASEADOS EM SCOOPS POR EXEMPLO 1 SCOOP, POSSUI 30 GRAMAS
            // // E O WHEY CALCULA A CALORIA BASEADO EM 1 SCOOP, E NAO EM 1 GRAMA
            //           const measureGram = new Measure();
            //           measureGram.food = food;
            //           measureGram.description = 'Gramas';
            //           measureGram.amount = 1;
            //           await this.measureRepository.save(measureGram);
            //         }

            if (
              !DESC.includes(SCOOP) &&
              !DESC.includes(BARRA) &&
              !DESC.includes(COMP) &&
              !DESC.includes(CAPS)
            ) {
              await this.foodRepository.delete(food)
              return;
            }

            try {
              return await this.measureRepository.save(measure);
            } catch (error) {
              console.error('Erro em seed measure products growth:', error);
              reject(error);
            }
          }
        })
        .on('end', async () => {
          resolve();
        });
    });
  }

  async seedMeasureFoodsGrowth(filePath: string): Promise<void> {
    console.log('Seeding Measure Foods Growth...\n');

    return new Promise(async (resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', async (row) => {
          // console.log('Linha do CSV:', row);
          const measure = new Measure();

          const food = await this.foodRepository.findOneBy({
            description: row[1],
          });

          const DESC = row[2];

          const GRAMA = 'Grama';
          const UNIDADE = 'Unidade';
          const ML = 'Mililitro';

          if (food) {
            measure.food = food;
            measure.description = row[2] || '';
            measure.amount = 100; // Regra de contexto

            if (
              !DESC.includes(GRAMA) &&
              !DESC.includes(UNIDADE) &&
              !DESC.includes(ML)
            ) {
              await this.foodRepository.delete(food)
              return;
            }

            try {
              return await this.measureRepository.save(measure);
            } catch (error) {
              console.error('Erro em seed mesure foods growth:', error);
              reject(error);
            }
          }
        })
        .on('end', async () => {
          resolve();
        });
    });
  }

  async seedFoodsIbge(filePath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const results = [];

      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', (row) => {
          // console.log('Linha do CSV:', row);
          const food = new Food();

          food.id_ibge = row[1] || '';
          food.description = row[2] || '';
          food.energy = row[4] != '-' ? parseFloat(row[4]) : 0;
          food.carb = row[7] != '-' ? parseFloat(row[7]) : 0;
          food.protein = row[5] != '-' ? parseFloat(row[5]) : 0;
          food.fat = row[6] != '-' ? parseFloat(row[6]) : 0;
          food.fat_sat = row[33] != '-' ? parseFloat(row[33]) : 0;
          food.fat_trans = row[38] != '-' ? parseFloat(row[38]) : 0;
          food.fiber = row[8] != '-' ? parseFloat(row[8]) : 0;
          food.sugar = row[39] != '-' ? parseFloat(row[39]) : 0;
          food.sodium = row[14] != '-' ? parseFloat(row[14]) : 0;
          food.calcium = row[9] != '-' ? parseFloat(row[9]) : 0;
          food.iron = row[13] != '-' ? parseFloat(row[13]) : 0;

          results.push(food);
        })
        .on('end', async () => {
          // console.log('Dados de Food Ibge:', results);
          try {
            console.log('Seeding Foods Ibge...\n');
            await this.foodRepository.save(results);

            // await this.updateNullFieldsFoodToZero();

            resolve();
          } catch (error) {
            console.error('Erro em seed ibge foods:', error);
            reject(error);
          }
        });
    });
  }

  async seedMeasureIbge(filePath: string): Promise<void> {
    console.log('Seeding Measure Ibge...\n');

    return new Promise(async (resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', async (row) => {
          //console.log('Linha do CSV:', row);
          const measure = new Measure();

          const food = await this.foodRepository.findOneBy({
            id_ibge: row[0],
          });

          const DESC = row[2];
          const AMOUNT = row[3];

          const GRAMA = 'Grama';
          const UNIDADE = 'Unidade';
          const ML = 'Mililitro';

          if (food) {
            if (
              !DESC.includes(GRAMA) &&
              !DESC.includes(UNIDADE) &&
              !DESC.includes(ML)
            ) {
              await this.foodRepository.delete(food)
              return;
            }

            measure.food = food;
            measure.description = DESC || '';
            measure.amount = parseFloat(AMOUNT) || 1;

            // if (!measure.description) {
            //   return;
            // }

            try {
              await this.measureRepository.save(measure);
              // console.log('\n -Seed finished- \n');
            } catch (error) {
              console.error('Erro em seed mesure foods ibge:', error);
              reject(error);
            }
          }
        })
        .on('end', async () => {
          resolve();
        });
    });
  }

  async seedMuscles(): Promise<void> {
    console.log('Seeding Muscles...\n');

    const MUSCLES_DEFAULT = [
      'Peitoral',
      'Dorsal',
      'Deltóides',
      'Quadríceps',
      'Femural',
      'Bíceps',
      'Tríceps',
      'Abdominal',
      'Panturrilha',
    ];

    return new Promise(async (resolve, reject) => {
      const muscles_array = [];

      MUSCLES_DEFAULT.forEach(async (name) => {
        const newMuscle = new Muscle();
        newMuscle.name = name;
        muscles_array.push(newMuscle);
      });

      try {
        await this.muscleRepository.save(muscles_array);
        resolve();
      } catch (error) {
        console.error('Erro em seed muscles:', error);
        reject(error);
      }
    });
  }

  async seedExercises(): Promise<void> {
    console.log('Seeding Exercises...\n');

    return new Promise(async (resolve, reject) => {
      const exercisesArray = [];

      for (const exercise of EXERCISES) {
        const newExercise = new Exercise();
        newExercise.name = exercise.name;
        newExercise.level = exercise.level;

        const muscle = await this.muscleRepository.findOneBy({
          id: exercise.muscleId,
        });
        newExercise.muscle = muscle;

        exercisesArray.push(newExercise);
      }

      try {
        await this.exerciseRepository.save(exercisesArray);
        resolve();
      } catch (error) {
        console.error('Erro em seed exercises:', error);
        reject(error);
      }
    });
  }
}
