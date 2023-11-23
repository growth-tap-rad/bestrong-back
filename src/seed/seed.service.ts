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
import { EntityManager } from 'typeorm';
import { Readable } from 'typeorm/platform/PlatformTools';

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
    private readonly entityManager: EntityManager,
  ) {}

  async seed(): Promise<string> {
    try {
      console.time('SeedTime');
      console.log('\nSeeding...\n');

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

      await this.seedMeasureIbge('src/assets/seeds/ibge_medidas.csv');

      await this.seedMuscles();

      await this.seedExercises();

      // await this.updateNullFieldsFoodToZero();

      console.timeEnd('SeedTime');
      console.log('Seeds Successfull Finished!');

      return `Seeds Successfull Finished!`;
    } catch (error) {
      throw error;
    }
  }

  async truncateSeededTables(): Promise<string> {
    console.time('time truncate');
    console.log('Truncating tables...');

    try {
      const tables = ['measure', 'food', 'exercise', 'muscle'];
      await this.entityManager.query('SET foreign_key_checks = 0');

      for (const table of tables) {
        await this.entityManager.query(`TRUNCATE TABLE ${table}`);
        console.log(`Droped rows from: ${table} \n`);
      }

      await this.entityManager.query('SET foreign_key_checks = 1');
      console.timeEnd('time truncate');
      return `Truncates Successfull Finished!`;
    } catch (error) {
      console.error('Error deleting tables:', error);
      throw error;
    }
  }

  async truncate(table: string): Promise<string> {
    console.time('time truncate table');
    console.log(`Truncating table ${table}...`);

    try {
      await this.entityManager.query('SET foreign_key_checks = 0');

      await this.entityManager.query(`TRUNCATE TABLE ${table}`);
      console.log(`Droped rows from: ${table} \n`);

      await this.entityManager.query('SET foreign_key_checks = 1');
      console.timeEnd('time truncate table');
      return `Truncate Successfull Finished!`;
    } catch (error) {
      console.error('Error deleting table:', error);
      throw error;
    }
  }

  async seedFoodProductsGrowth(filePath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const batchSize = 100;
      let results = [];

      console.log('Seeding Products Growth...');
      console.time('time prod growth');

      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', async (row) => {
          try {
            //console.log('Linha do CSV:', row);
            const food = new Food();

            food.description = row[1] || '';
            food.energy = row[4] != '-' ? parseFloat(row[4]) : 0;
            food.carb = row[6] != '-' ? parseFloat(row[6]) : 0;
            food.protein = row[5] != '-' ? parseFloat(row[5]) : 0;
            food.fat = row[7] != '-' ? parseFloat(row[7]) : 0;

            results.push(food);

            if (results.length === batchSize) {
              await this.entityManager.transaction(
                async (transactionalEntityManager) => {
                  await transactionalEntityManager.save(Food, results);
                },
              );

              results = [];
            }
          } catch (error) {
            console.error(
              'Erro em seed products growth row:',
              row[1],
              'error:',
              error,
            );
            reject(error);
          }
        })
        .on('end', async () => {
          try {
            if (results.length > 0) {
              await this.entityManager.transaction(
                async (transactionalEntityManager) => {
                  await transactionalEntityManager.save(Food, results);
                },
              );
            }

            console.timeEnd('time prod growth');
            console.log('>Finished products growth seed. \n');

            resolve();
          } catch (error) {
            console.error('Erro em seed Products growth:', error);
            reject(error);
          }
        });
    });
  }

  async seedFoodFoodsGrowth(filePath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const batchSize = 100;
      let results = [];

      console.log('Seeding Foods Growth...');
      console.time('time food growth');

      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', async (row) => {
          try {
            // const existingFood = results.find((f) => f.description === row[1]);
            // if (existingFood) return;

            // console.log('Linha do CSV:', row);
            const food = new Food();

            food.description = row[1] || '';
            food.energy = row[6] != '-' ? parseFloat(row[6]) / 100 : 0;
            food.carb = row[7] != '-' ? parseFloat(row[7]) / 100 : 0;
            food.protein = row[5] != '-' ? parseFloat(row[5]) / 100 : 0;
            food.fat = row[8] != '-' ? parseFloat(row[8]) / 100 : 0;
            food.fiber = row[10] != '-' ? parseFloat(row[10]) / 100 : 0;
            food.sodium = row[12] != '-' ? parseFloat(row[12]) / 100 : 0;

            results.push(food);

            if (results.length === batchSize) {
              await this.entityManager.transaction(
                async (transactionalEntityManager) => {
                  await transactionalEntityManager.save(Food, results);
                },
              );

              results = [];
            }
          } catch (error) {
            console.error(
              'Erro em seed foods growth row:',
              row[1],
              'error:',
              error,
            );
            reject(error);
          }
        })
        .on('end', async () => {
          try {
            if (results.length > 0) {
              await this.entityManager.transaction(
                async (transactionalEntityManager) => {
                  await transactionalEntityManager.save(Food, results);
                },
              );
            }

            console.timeEnd('time food growth');
            console.log('>Finished foods growth seed. \n');

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
      console.time('time update food');

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

      console.log('Seeding update Null fileds on Food... ');

      try {
        const promises = fieldsToUpdate.map(async (field) => {
          try {
            await this.entityManager.transaction(
              async (transactionalEntityManager) => {
                await transactionalEntityManager
                  .createQueryBuilder()
                  .update(Food)
                  .set({ [field]: 0 })
                  .where(`${field} IS NULL`)
                  .execute();
              },
            );
          } catch (error) {
            console.error(`Error updating field - ${field}: ${error}`);
          }
        });

        await Promise.allSettled(promises);

        console.timeEnd('time update food');
        console.log('Finished Updated Null fields on Food seed. \n');
        resolve();
      } catch (error) {
        console.error('Erro em seed update null fields:', error);
        reject(error);
      }
    });
  }

  async seedMeasureProductsGrowth(filePath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      console.log('Seeding Measure Products Growth...');
      console.time('time measure prods growth');
      await this.entityManager.query('SET foreign_key_checks = 0');
      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', async (row) => {
          try {
            // console.log('Linha do CSV:', row);
            const measure = new Measure();

            const food = await this.foodRepository.findOneBy({
              description: row[1],
            });

            if (!food) {
              return;
            }

            const DESC = row[2];

            const SCOOP = 'scoop';
            const BARRA = 'barra';
            const COMP = 'comprimido';
            const CAPS = 'capsulas';

            measure.food = food;
            measure.description = row[2];
            measure.amount = parseFloat(row[3]) || 1;

            if (
              !(
                DESC.includes(SCOOP) ||
                DESC.includes(BARRA) ||
                DESC.includes(COMP) ||
                DESC.includes(CAPS)
              )
            ) {
              // await this.entityManager.delete(Food, food);
              return;
            }

            await this.entityManager.save(Measure, measure);
          } catch (error) {
            console.error(
              'Erro em seed measure products growth row:',
              row[1],
              'error:',
              error,
            );
            reject(error);
          }
        })
        .on('end', async () => {
          console.timeEnd('time measure prods growth');
          console.log('>Finished measure products growth seed. \n');
          await this.entityManager.query('SET foreign_key_checks = 1');
          resolve();
        });
    });
  }

  async seedMeasureFoodsGrowth(filePath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      console.log('Seeding Measure Foods Growth...');
      console.time('time measure foods growth');

      await this.entityManager.query('SET foreign_key_checks = 0');
      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', async (row) => {
          try {
            // console.log('Linha do CSV:', row);
            const measure = new Measure();

            const food = await this.foodRepository.findOneBy({
              description: row[1],
            });

            if (!food) return;

            const DESC = row[2];
            const GRAMA = 'Grama';
            const UNIDADE = 'Unidade';
            const ML = 'Mililitro';

            measure.food = food;
            measure.description = row[2];
            measure.amount = 1; // 100 // Regra de contexto

            if (
              !(
                DESC.includes(GRAMA) ||
                DESC.includes(UNIDADE) ||
                DESC.includes(ML)
              )
            ) {
              //await this.entityManager.delete(Food, food);
              return;
            }

            await this.entityManager.save(Measure, measure);
          } catch (error) {
            console.error(
              'Erro em seed measure foods growth row:',
              row[1],
              'error:',
              error,
            );
            reject(error);
          }
        })
        .on('end', async () => {
          console.timeEnd('time measure foods growth');
          console.log('>Finished measure foods growth seed. \n');
          await this.entityManager.query('SET foreign_key_checks = 1');
          resolve();
        });
    });
  }

  async seedFoodsIbge(filePath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const batchSize = 100;
      let results = [];

      console.log('Seeding Foods ibge...');
      console.time('time food ibge');

      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', async (row) => {
          try {
            // const existingFood = results.find((f) => f.description === row[2]);
            // if (existingFood) return;
            // console.log('Linha do CSV:', row);
            const food = new Food();

            food.id_ibge = row[1] || '';
            food.description = row[2];
            food.energy = row[4] != '-' ? parseFloat(row[4]) / 100 : 0;
            food.carb = row[7] != '-' ? parseFloat(row[7]) / 100 : 0;
            food.protein = row[5] != '-' ? parseFloat(row[5]) / 100 : 0;
            food.fat = row[6] != '-' ? parseFloat(row[6]) / 100 : 0;
            food.fat_sat = row[33] != '-' ? parseFloat(row[33]) / 100 : 0;
            food.fat_trans = row[38] != '-' ? parseFloat(row[38]) / 100 : 0;
            food.fiber = row[8] != '-' ? parseFloat(row[8]) / 100 : 0;
            food.sugar = row[39] != '-' ? parseFloat(row[39]) / 100 : 0;
            food.sodium = row[14] != '-' ? parseFloat(row[14]) / 100 : 0;
            food.calcium = row[9] != '-' ? parseFloat(row[9]) / 100 : 0;
            food.iron = row[13] != '-' ? parseFloat(row[13]) / 100 : 0;

            // DIVIDIR VALOR POR 100 AI VAI SER EM GRAMAS JG.. ja fazend
            // Testar...

            results.push(food);

            if (results.length === batchSize) {
              await this.entityManager.transaction(
                async (transactionalEntityManager) => {
                  await transactionalEntityManager.save(Food, results);
                },
              );

              results = [];
            }
          } catch (error) {
            console.error(
              'Erro em seed foods ibge row:',
              row[1],
              'error:',
              error,
            );
            reject(error);
          }
        })
        .on('end', async () => {
          try {
            if (results.length > 0) {
              await this.entityManager.transaction(
                async (transactionalEntityManager) => {
                  await transactionalEntityManager.save(Food, results);
                },
              );
            }

            console.timeEnd('time food ibge');
            console.log('>Finished foods ibge seed. \n');

            resolve();
          } catch (error) {
            console.error('Erro em seed foods ibge:', error);
            reject(error);
          }
        });
    });
  }

  async seedMeasureIbge(filePath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      console.log('Seeding Measure Ibge...');
      console.time('time measure ibge');
      await this.entityManager.query('SET foreign_key_checks = 0');
      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', async (row) => {
          //console.log('Linha do CSV:', row);
          const measure = new Measure();

          const food = await this.foodRepository.findOneBy({
            id_ibge: row[0],
          });

          if (!food) return;

          const DESC = row[2];
          const AMOUNT = row[3];

          const GRAMA = 'Grama';
          const ML = 'Mililitro';

          if (!(DESC.includes(GRAMA) || DESC.includes(ML))) {
            //await this.entityManager.delete(Food, food); // estava quebrando
            return;
          }

          measure.food = food;
          measure.description = DESC || '';
          measure.amount = parseFloat(AMOUNT) || 1;

          try {
            await this.entityManager.save(Measure, measure);
          } catch (error) {
            console.error(
              'Erro em seed mesure foods ibge: row:',
              row[1],
              'error:',
              error,
            );
            reject(error);
          }
        })
        .on('end', async () => {
          console.timeEnd('time measure ibge');
          console.log('>Finished measure ibge seed. \n');
          await this.entityManager.query('SET foreign_key_checks = 1');
          resolve();
        });
    });
  }

  async seedMuscles(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      console.log('Seeding Muscles...');
      console.time('time muscles');

      try {
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

        const musclesPromises = MUSCLES_DEFAULT.map((name) => {
          const newMuscle = new Muscle();
          newMuscle.name = name;
          return this.muscleRepository.save(newMuscle);
        });

        await Promise.all(musclesPromises);

        console.timeEnd('time muscles');
        console.log('>Finished muscles seed. \n');
        resolve();
      } catch (error) {
        console.error('Erro em seed muscles:', error);
        reject(error);
      }
    });
  }

  async seedExercises(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      console.log('Seeding Exercises...');
      console.time('time exercises');

      try {
        const exercisesArray = EXERCISES.map((exercise) => {
          const newExercise = new Exercise();
          newExercise.name = exercise.name;
          newExercise.level = exercise.level;
          newExercise.muscleId = exercise.muscleId;

          return newExercise;
        });

        const muscleIds = exercisesArray.map((ex) => ex.muscleId);

        const muscles = await Promise.all(
          muscleIds.map((id) => this.muscleRepository.findOneBy({ id })),
        );

        exercisesArray.forEach((ex, index) => {
          ex.muscle = muscles[index];
        });

        const batchSize = 20; //47
        const savePromises = [];

        for (let i = 0; i < exercisesArray.length; i += batchSize) {
          const currentBatch = exercisesArray.slice(i, i + batchSize);

          const savePromise = this.entityManager.transaction(
            async (transactionalEntityManager) => {
              await transactionalEntityManager.save(Exercise, currentBatch);
            },
          );

          savePromises.push(savePromise);
        }

        await Promise.all(savePromises);

        console.timeEnd('time exercises');
        console.log('>Finished Exercises seed. \n');
        resolve();
      } catch (error) {
        console.error('Erro em seed exercises:', error);
        reject(error);
      }
    });
  }

  // convertToCSV(arr) {
  //   const array = [Object.keys(arr[0])].concat(arr);

  //   return array
  //     .map((it) => {
  //       return Object.values(it).map(String).join(';');
  //     })
  //     .join('\n');
  // }
}
