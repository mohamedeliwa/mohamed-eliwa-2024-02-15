import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create.user.dto';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  const user_repository_token = getRepositoryToken(User);
  const password = 'plainTextPassword';
  const hashedPassword = 'hashedPassword';

  const createUserDto: CreateUserDto = {
    username: 'username',
    password,
    role: UserRole.ADMIN,
  };

  const savedUser: User = {
    ...createUserDto,
    id: 1,
    password: hashedPassword,
  };

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

  describe('findOneByUsername Method', () => {
    it('should return call userRespository.findOneBy with right arguments', async () => {
      await service.findOneByUsername(createUserDto.username);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        username: createUserDto.username,
      });
    });

    it('should return user', async () => {
      jest
        .spyOn(usersRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(savedUser));
      const returnedUser = await service.findOneByUsername(
        createUserDto.username,
      );
      expect(returnedUser).toEqual(savedUser);
    });
  });

  describe('hashPassword Method', () => {
    const salt = 10;
    jest.spyOn(bcrypt, 'genSalt').mockImplementation((x) => salt);

    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation((pass, salt) => hashedPassword);

    it('should return call bcrypt.genSalt', async () => {
      await service.hashPassword(createUserDto.password);
      expect(bcrypt.genSalt).toHaveBeenCalled();
    });

    it('should call bcrypt.hash with the right arguments', async () => {
      await service.hashPassword(createUserDto.password);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, salt);
    });

    it('should return the hashed password', async () => {
      await service.hashPassword(createUserDto.password);
      expect(bcrypt.hash).toHaveReturnedWith(hashedPassword);
    });
  });
});
