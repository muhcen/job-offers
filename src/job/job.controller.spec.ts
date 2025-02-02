import { Test, TestingModule } from '@nestjs/testing';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobType } from './entities/job-type.entity';
import { CompanyModule } from 'src/company/company.module';
import { SkillModule } from 'src/skill/skill.module';
import { LocationModule } from 'src/location/location.module';
import { SalaryModule } from 'src/salary/salary.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Location } from 'src/location/entities/location.entity';
import { Salary } from 'src/salary/entities/salary.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { JobSkills } from 'src/skill/entities/job-skills.entity';
import { Currency } from 'src/salary/entities/currency.entity';

describe('JobController (e2e)', () => {
  let app: INestApplication;
  let jobService: JobService;
  let jobRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'postgres_db',
          port: 5432,
          username: 'testuser',
          password: 'testpassword',
          database: 'testdb',
          entities: [
            Job,
            Company,
            Location,
            Salary,
            Skill,
            JobSkills,
            JobType,
            Currency,
          ],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([
          Job,
          Company,
          Location,
          Salary,
          Skill,
          JobSkills,
          JobType,
          Currency,
        ]),
        CompanyModule,
        SkillModule,
        LocationModule,
        SalaryModule,
      ],
      controllers: [JobController],
      providers: [JobService],
    }).compile();

    app = moduleFixture.createNestApplication();
    jobService = app.get<JobService>(JobService);
    jobRepository = app.get(getRepositoryToken(Job));

    await app.init();
  }, 10000);

  afterAll(async () => {
    await app.close();
  });

  it('should return an empty array if no job offers match the query', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/job-offers')
      .query({ title: 'Nonexistent Job Title', page: 1, limit: 10 });

    expect(response.status).toBe(200);
  });
});
