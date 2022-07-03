import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    sign_up: jest.fn((dto) => {
      return {
        access_token: dto.toString(),
        refresh_token:
          'eyJzdWIiOiIzNzJmZTJiYS0yNDM5LTQwMmMtYTczZS0yYjNhYTBhODk',
      };
    }),

    sign_in: jest.fn((dto) => {
      return {
        access_token: dto.toString(),
        refresh_token:
          'eyJzdWIiOiIzNzJmZTJiYS0yNDM5LTQwMmMtYTczZS0yYjNhYTBhODk',
      };
    }),

    logout: jest.fn(() => {
      return 'Logout Successful';
    }),

    refresh: jest.fn((dto) => {
      return {
        access_token: 'eyJzdWIiOiIzNzJmZTJiYS0yNDM5LTQwMmMtYTczZS0yYjNhYTBhODk',
        refresh_token: dto.toString(),
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
