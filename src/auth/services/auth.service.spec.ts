import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const access_token = 'access_token';
  const user = {
    id: 1,
    username: 'username',
    password: 'password',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            findOneByUsername: jest.fn((x) => user),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => access_token),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateCredentials Method', () => {
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(jest.fn(() => Promise.resolve(true)));

    it('should call usersService.findOneByUsername with right arguments', async () => {
      await service.validateCredentials(user.username, user.password);
      expect(usersService.findOneByUsername).toHaveBeenCalledWith(
        user.username,
      );
    });

    it('should call bcrypt.compare with right arguments', async () => {
      await service.validateCredentials(user.username, user.password);
      expect(bcrypt.compare).toHaveBeenCalledWith(user.password, user.password);
    });

    it('should return user when password is correct', async () => {
      const response = await service.validateCredentials(
        user.username,
        user.password,
      );
      expect(response).toEqual(user);
    });
  });

  describe('GenerateJWT Method', () => {
    it('should call jwtService.sign with the right arguments', async () => {
      await service.generateJWT(user);
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: user.username,
        sub: user.id,
      });
    });

    it('should return the access_token prop', async () => {
      const response = await service.generateJWT(user);
      expect(response).toEqual({
        access_token,
      });
    });
  });
});
