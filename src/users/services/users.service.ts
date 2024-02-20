import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create.user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * creates a new user
   * @param createUserDto - user's data
   * @returns the newly created user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    /**
     * hashing the plaing text password before saving
     */
    user.password = await this.hashPassword(createUserDto.password);
    user.role = createUserDto.role;

    const savedUser = await this.usersRepository.save(user);
    return {
      ...savedUser,
      password: '',
    };
  }

  /**
   * finds a user by id
   * @param id - user's id
   * @returns the found user
   */
  async findOneById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  /**
   * finds a user by username
   * @param username - user's username
   * @returns the found user
   */
  async findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  /**
   * @param password plain text password
   * @returns hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const rounds = 10;
    const salt = await bcrypt.genSalt(rounds);
    return await bcrypt.hash(password, salt);
  }
}
