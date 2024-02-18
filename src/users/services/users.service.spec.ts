import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create.user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  const user_repository_token = getRepositoryToken(User);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: user_repository_token,
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(user_repository_token);
  });

  describe('Create Method', () => {
    const password = 'plainTextPassword';
    const hashedPassword = 'hashedPassword';

    const createUserDto: CreateUserDto = {
      username: 'username',
      password,
      role: UserRole.ADMIN,
    };

    it('should call hashPassword with the right arguments', async () => {
      jest
        .spyOn(service, 'hashPassword')
        .mockReturnValueOnce(Promise.resolve(hashedPassword));
      await service.create(createUserDto);
      expect(service.hashPassword).toHaveBeenCalledWith(password);
    });

    it('should return call userRespository.save with right arguments', async () => {
      await service.create(createUserDto);
      expect(usersRepository.save).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
    });

    it('should return user with empty password field', async () => {
      const savedUser = await service.create(createUserDto);
      expect(savedUser.password).toEqual('');
    });
  });
});
