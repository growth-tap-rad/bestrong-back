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

      //await this.seedFoodsIbge('src/assets/seeds/ibge.csv'); // quebrando

      await this.updateNullFieldsFoodToZero();

      //await this.seedMeasureIbge('src/assets/seeds/ibge_medidas.csv'); // quebrando

      await this.seedMuscles();
      await this.seedExercises();

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

      for (const table of tables) {
        await this.entityManager.query('SET foreign_key_checks = 0');
        await this.entityManager.query(`TRUNCATE TABLE ${table}`);
        console.log(`Droped rows from: ${table} \n`);
      }

      console.timeEnd('time truncate');
      return `Truncates Successfull Finished!`;
    } catch (error) {
      console.error('Error deleting tables:', error);
      throw error;
    }
  }

  async seedFoodProductsGrowth(filePath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const batchSize = 1000;
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
              'Erro em seed measure products growth row:',
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
      const batchSize = 1000;
      let results = [];

      console.log('Seeding Foods Growth...');
      console.time('time food growth');

      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', async (row) => {
          try {
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
              'Erro em seed measure foods growth row:',
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
            measure.description = row[2] || '';
            measure.amount = parseFloat(row[3]) || 1;

            if (
              !(
                DESC.includes(SCOOP) ||
                DESC.includes(BARRA) ||
                DESC.includes(COMP) ||
                DESC.includes(CAPS)
              )
            ) {
              await this.foodRepository.delete(food);
              return;
            }

            this.measureRepository.save(measure);
          } catch (error) {
            console.error(
              'Erro em seed measure products growth row:',
              row[1],
              'error:',
              error,
            );
            reject(error);
          }
        });

      resolve();

      console.timeEnd('time measure prods growth');
      console.log('>Finished measure products growth seed. \n');
    });
  }

  async seedMeasureFoodsGrowth(filePath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      console.log('Seeding Measure Foods Growth...');
      console.time('time measure foods growth');

      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', async (row) => {
          try {
            // console.log('Linha do CSV:', row);
            const measure = new Measure();

            const food = await this.foodRepository.findOneBy({
              description: row[1],
            });

            if (food) {
              measure.food = food;
              measure.description = row[2] || '';
              measure.amount = 100; // Regra de contexto

              const DESC = row[2];

              const GRAMA = 'Grama';
              const UNIDADE = 'Unidade';
              const ML = 'Mililitro';

              if (
                !(
                  DESC.includes(GRAMA) ||
                  DESC.includes(UNIDADE) ||
                  DESC.includes(ML)
                )
              ) {
                await this.foodRepository.delete(food);
                return;
              }

              await this.measureRepository.save(measure);
            }
          } catch (error) {
            console.error(
              'Erro em seed measure foods growth row:',
              row[1],
              'error:',
              error,
            );
            reject(error);
          }
        });

      console.timeEnd('time measure foods growth');
      console.log('>Finished measure foods growth seed. \n');
      resolve();
    });
  }

  // async seedFoodsIbge(filePath: string): Promise<void> {
  //   return new Promise(async (resolve, reject) => {
  //     const results = [];

  //     fs.createReadStream(filePath)
  //       .pipe(csvParser({ separator: ';', headers: false }))
  //       .on('data', (row) => {
  //         // console.log('Linha do CSV:', row);

  //         //const rowArray = Object.values(row);
  //         const food = new Food();

  //         // para melhor entendimento, e testes
  //         //console.log(rowArray);
  //         //console.log(rowArray.slice(rowArray.indexOf('-') + 1))
  //         // if (row[1] != 6300101) {
  //         //   return;
  //         // }

  //         food.id_ibge = row[1] || '';
  //         food.description = row[2] || '';
  //         food.energy = row[4] != '-' ? parseFloat(row[4]) : 0;
  //         food.carb = row[7] != '-' ? parseFloat(row[7]) : 0;
  //         food.protein = row[5] != '-' ? parseFloat(row[5]) : 0;
  //         food.fat = row[6] != '-' ? parseFloat(row[6]) : 0;
  //         food.fat_sat = row[33] != '-' ? parseFloat(row[33]) : 0;
  //         food.fat_trans = row[38] != '-' ? parseFloat(row[38]) : 0;
  //         food.fiber = row[8] != '-' ? parseFloat(row[8]) : 0;
  //         food.sugar = row[39] != '-' ? parseFloat(row[39]) : 0;
  //         food.sodium = row[14] != '-' ? parseFloat(row[14]) : 0;
  //         food.calcium = row[9] != '-' ? parseFloat(row[9]) : 0;
  //         food.iron = row[13] != '-' ? parseFloat(row[13]) : 0;

  //         results.push(food);

  //         // Tem mais de um alimentos apos o "-", por isso adicionar mais de uma medida
  //         // nao vai funcionar, e como nao  tem padrao no csv de aliemtnos
  //         // nao sei qual parte vai ser grama, unidade pedaço ou etc..

  //         // if (rowArray.includes('-')) {
  //         //   results.push(food);
  //         //   const remainingFields = rowArray.slice(rowArray.indexOf('-') + 1);

  //         //   const newFood = {
  //         //     ...food,
  //         //     id_ibge: String(remainingFields[0] || ''),
  //         //   } as Food;

  //         //   results.push(newFood);
  //         // } else {
  //         //   results.push(food);
  //         // }
  //       })
  //       .on('end', async () => {
  //         // console.log('Dados de Food Ibge:', results);
  //         try {
  //           console.log('Seeding Foods Ibge...\n');
  //           await this.foodRepository.save(results);

  //           // await this.updateNullFieldsFoodToZero();

  //           resolve();
  //         } catch (error) {
  //           console.error('Erro em seed ibge foods:', error);
  //           reject(error);
  //         }
  //       });
  //   });
  // }

  // async seedMeasureIbge(filePath: string): Promise<void> {
  //   console.log('Seeding Measure Ibge...\n');

  //   return new Promise(async (resolve, reject) => {
  //     fs.createReadStream(filePath)
  //       .pipe(csvParser({ separator: ';', headers: false }))
  //       .on('data', async (row) => {
  //         //console.log('Linha do CSV:', row);
  //         const measure = new Measure();

  //         const food = await this.foodRepository.findOneBy({
  //           id_ibge: row[0],
  //         });

  //         const DESC = row[2];
  //         const AMOUNT = row[3];

  //         const GRAMA = 'Grama';
  //         const UNIDADE = 'Unidade';
  //         const ML = 'Mililitro';

  //         if (food) {
  //           if (
  //             !DESC.includes(GRAMA) &&
  //             !DESC.includes(UNIDADE) &&
  //             !DESC.includes(ML)
  //           ) {
  //             // await this.foodRepository.delete(food) // estava quebrando
  //             return;
  //           }

  //           measure.food = food;
  //           measure.description = DESC || '';
  //           measure.amount = parseFloat(AMOUNT) || 1;

  //           // if (!measure.description) {
  //           //   return;
  //           // }

  //           try {
  //             await this.measureRepository.save(measure);
  //             // console.log('\n -Seed finished- \n');
  //           } catch (error) {
  //             console.error('Erro em seed mesure foods ibge:', error);
  //             reject(error);
  //           }
  //         }
  //       })
  //       .on('end', async () => {
  //         resolve();
  //       });
  //   });
  // }

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

        const batchSize = 100;
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
}
