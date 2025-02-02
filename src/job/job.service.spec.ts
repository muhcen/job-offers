import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobType } from './entities/job-type.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SkillService } from 'src/skill/skill.service';
import { CompanyService } from 'src/company/company.service';
import { LocationService } from 'src/location/location.service';
import { SalaryService } from 'src/salary/salary.service';
import { IJob } from 'src/job-offer/interfaces/job-offer.interface';
import { Company } from 'src/company/entities/company.entity';
import { Salary } from 'src/salary/entities/salary.entity';

describe('JobService', () => {
  let jobService: JobService;
  let jobRepository: any;
  let jobTypeRepository: any;
  let skillService: any;
  let companyService: any;
  let locationService: any;
  let salaryService: any;

  beforeEach(async () => {
    jobRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    };

    jobTypeRepository = {};

    skillService = {};
    companyService = {};
    locationService = {};
    salaryService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: getRepositoryToken(Job),
          useValue: jobRepository,
        },
        {
          provide: getRepositoryToken(JobType),
          useValue: jobTypeRepository,
        },
        {
          provide: SkillService,
          useValue: skillService,
        },
        {
          provide: CompanyService,
          useValue: companyService,
        },
        {
          provide: LocationService,
          useValue: locationService,
        },
        {
          provide: SalaryService,
          useValue: salaryService,
        },
      ],
    }).compile();

    jobService = module.get<JobService>(JobService);
  });

  it('should return job offers without filters', async () => {
    const mockJobs = [
      { id: 1, title: 'Job 1' },
      { id: 2, title: 'Job 2' },
    ];
    const mockTotal = 2;
    jobRepository.getManyAndCount.mockResolvedValue([mockJobs, mockTotal]);

    const result = await jobService.getJobOffers({
      title: '',
      city: '',
      state: '',
      minSalary: 0,
      maxSalary: 0,
      page: 1,
      limit: 10,
    });

    expect(result).toEqual({
      data: mockJobs,
      total: mockTotal,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  it('should filter job offers by title', async () => {
    const mockJobs = [{ id: 1, title: 'Job 1' }];
    const mockTotal = 1;
    jobRepository.getManyAndCount.mockResolvedValue([mockJobs, mockTotal]);

    const result = await jobService.getJobOffers({
      title: 'Job 1',
      city: '',
      state: '',
      minSalary: 0,
      maxSalary: 0,
      page: 1,
      limit: 10,
    });

    expect(jobRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
      'job.title ILIKE :title',
      { title: '%Job 1%' },
    );
    expect(result).toEqual({
      data: mockJobs,
      total: mockTotal,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  it('should apply multiple filters and paginate the results', async () => {
    const mockJobs = [{ id: 1, title: 'Job 1', city: 'New York' }];
    const mockTotal = 1;
    jobRepository.getManyAndCount.mockResolvedValue([mockJobs, mockTotal]);

    const result = await jobService.getJobOffers({
      title: 'Job 1',
      city: 'New York',
      state: 'NY',
      minSalary: 50000,
      maxSalary: 80000,
      page: 1,
      limit: 10,
    });

    expect(result).toEqual({
      data: mockJobs,
      total: mockTotal,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  it('should handle pagination correctly (skip and take)', async () => {
    const mockJobs = [{ id: 1, title: 'Job 1' }];
    const mockTotal = 3;
    jobRepository.getManyAndCount.mockResolvedValue([mockJobs, mockTotal]);

    const result = await jobService.getJobOffers({
      title: '',
      city: '',
      state: '',
      minSalary: 0,
      maxSalary: 0,
      page: 2,
      limit: 1,
    });

    expect(jobRepository.createQueryBuilder().skip).toHaveBeenCalledWith(1); // (page - 1) * limit = 1
    expect(jobRepository.createQueryBuilder().take).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      data: mockJobs,
      total: mockTotal,
      page: 2,
      limit: 1,
      totalPages: 3,
    });
  });

  it('should throw HttpException if an error occurs in the database query', async () => {
    jobRepository.getManyAndCount.mockRejectedValue(
      new Error('Database error'),
    );

    await expect(
      jobService.getJobOffers({
        title: '',
        city: '',
        state: '',
        minSalary: 0,
        maxSalary: 0,
        page: 1,
        limit: 10,
      }),
    ).rejects.toThrowError(
      new HttpException(
        'Database query failed: Database error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
