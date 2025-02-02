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
          host: 'localhost', // Postgres container host
          port: 5432,
          username: 'testuser', // Make sure this matches the Postgres setup in your Docker Compose
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
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return job offers based on query params', async () => {
    const mockJob = {
      id: 'job123',
      title: 'Software Engineer',
      postedDate: new Date(),
      jobType: { name: 'Full-time' },
      company: { name: 'TechCorp' },
      location: { city: 'San Francisco', state: 'CA' },
      salary: { min: 100000, max: 150000 },
    };

    await jobRepository.save(mockJob);

    const response = await request(app.getHttpServer())
      .get('/api/job-offers')
      .query({ title: 'Software Engineer', page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Software Engineer',
          company: { name: 'TechCorp' },
          location: { city: 'San Francisco', state: 'CA' },
          salary: { min: 100000, max: 150000 },
        }),
      ]),
    );
  });

  it('should return an empty array if no job offers match the query', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/job-offers')
      .query({ title: 'Nonexistent Job Title', page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should handle errors correctly when jobService throws an error', async () => {
    jest
      .spyOn(jobService, 'getJobOffers')
      .mockRejectedValueOnce(new Error('Something went wrong'));

    const response = await request(app.getHttpServer()).get('/api/job-offers');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Something went wrong');
  });
});
