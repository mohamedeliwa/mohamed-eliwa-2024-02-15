import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgreSqlContainer } from '@testcontainers/postgresql';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let pgContainer;
  beforeAll(async () => {
    pgContainer = await new PostgreSqlContainer('postgres')
      .withExposedPorts(5432)
      .withDatabase('test')
      .withUsername('root')
      .withPassword('secret')
      .start();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(TypeOrmModule)
      .useModule(
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: pgContainer.getHost(),
            port: pgContainer.getPort(),
            username: pgContainer.getUsername(),
            password: pgContainer.getPassword(),
            database: pgContainer.getDatabase(),
            entities: [],
            synchronize: configService.get('TYPEORM_SYNCHRONIZE'),
            autoLoadEntities: true,
          }),
          inject: [ConfigService],
        }),
      )
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
    if (pgContainer) await pgContainer.stop();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
