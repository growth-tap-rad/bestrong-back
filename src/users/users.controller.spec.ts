import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Progress } from '../progress/progress.entity';
import { AuthGuard } from '../auth/auth.guard';


// TODO FIX IT!

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        AuthGuard
        // Aqui você pode adicionar mocks para os seus serviços dependentes
        // Caso necessário para isolar os testes do controlador
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });


  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const expectedResult: User[] = [
        {
          id: 1,
          name: 'joaoSilveira',
          username: 'jao',
          email: 'joao@gmail',
          password: '1234',
          birthday: new Date('2023-10-10T04:00:00.000Z'),
          progress: [
            {
              id: 1,
              height: 168,
              weight: 80,
              activity_level: 'advanced',
              goal: 'gain_muscle',
            } as Progress,
          ],
        },
      ];
      jest.spyOn(usersService, 'getUsers').mockResolvedValue(expectedResult);

      const result = await usersController.getUsers();

      expect(result).toEqual(expectedResult);
    });
  });
});