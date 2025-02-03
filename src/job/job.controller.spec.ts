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
import { Repository } from 'typeorm';

describe('JobController (e2e)', () => {
  let app: INestApplication;
  let jobService: JobService;
  let jobRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
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

  it('should return job offers with skills when queried by title', async () => {
    const jobData = {
      jobId: 'job123',
      title: 'Software Engineer',
      type: 'Full-time',
      name: 'Tech Company',
      industry: 'Software',
      skills: ['JavaScript', 'Node.js', 'React'],
      postedDate: new Date(),
      minSalary: 60000,
      maxSalary: 120000,
      city: 'New York',
      state: 'NY',
      currency: 'USD',
      website: 'https://techcompany.com',
    };

    await jobService.createJob(jobData);

    const response = await request(app.getHttpServer())
      .get('/api/job-offers')
      .query({
        title: 'Software Engineer',
        page: 1,
        limit: 10,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('should return job offers filtered by city and salary range', async () => {
    const jobData = {
      jobId: 'job123',
      title: 'Software Engineer',
      type: 'Full-time',
      name: 'Tech Company',
      industry: 'Software',
      skills: ['JavaScript', 'Node.js', 'React'],
      postedDate: new Date(),
      minSalary: 60000,
      maxSalary: 120000,
      city: 'New York',
      state: 'NY',
      currency: 'USD',
      website: 'https://techcompany.com',
    };

    await jobService.createJob(jobData);

    const response = await request(app.getHttpServer())
      .get('/api/job-offers')
      .query({
        city: 'New York',
        minSalary: 60000,
        maxSalary: 120000,
        page: 1,
        limit: 10,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('should return job offers with pagination', async () => {
    for (let i = 1; i <= 20; i++) {
      const jobData = {
        jobId: `job${i}`,
        title: `Job ${i}`,
        type: 'Full-time',
        name: 'Tech Company',
        industry: 'Software',
        skills: ['JavaScript', 'Node.js', 'React'],
        postedDate: new Date(),
        minSalary: 60000,
        maxSalary: 120000,
        city: 'New York',
        state: 'NY',
        currency: 'USD',
        website: 'https://techcompany.com',
      };
      await jobService.createJob(jobData);
    }

    const response = await request(app.getHttpServer())
      .get('/api/job-offers')
      .query({ page: 2, limit: 5 });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(5);
    expect(Number(response.body.page)).toBe(2);
    expect(response.body.totalPages).toBeGreaterThan(2);
  });
});
