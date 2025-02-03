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
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    jobTypeRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

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

  // it('should throw HttpException if an error occurs in the database query', async () => {
  //   jobRepository.getManyAndCount.mockRejectedValue(
  //     new Error('Database error'),
  //   );

  //   await expect(
  //     jobService.getJobOffers({
  //       title: '',
  //       city: '',
  //       state: '',
  //       minSalary: 0,
  //       maxSalary: 0,
  //       page: 1,
  //       limit: 10,
  //     }),
  //   ).rejects.toThrowError(
  //     new HttpException(
  //       'Database query failed: Database error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     ),
  //   );
  // });

  it('should handle missing jobSkills gracefully', async () => {
    const mockJobs = [
      {
        id: 1,
        title: 'Job 1',
        jobSkills: undefined,
      },
    ];
    const mockTotal = 1;
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

  it('should correctly filter new jobs from existing ones', async () => {
    const mockJobData: IJob[] = [
      {
        jobId: 'job1',
        title: 'Software Engineer',
        type: '',
        name: '',
        industry: '',
        skills: [],
        postedDate: undefined,
        minSalary: 0,
        maxSalary: 0,
        city: '',
        state: '',
        currency: '',
      },
      {
        jobId: 'job2',
        title: 'Frontend Developer',
        type: '',
        name: '',
        industry: '',
        skills: [],
        postedDate: undefined,
        minSalary: 0,
        maxSalary: 0,
        city: '',
        state: '',
        currency: '',
      },
    ];
    const mockExistingJobs = [{ id: 'job1' }];
    jobRepository.find.mockResolvedValue(mockExistingJobs);

    const result = await jobService.filterNewJobs(mockJobData);

    expect(result).toEqual([
      {
        jobId: 'job2',
        title: 'Frontend Developer',
        type: '',
        name: '',
        industry: '',
        skills: [],
        postedDate: undefined,
        minSalary: 0,
        maxSalary: 0,
        city: '',
        state: '',
        currency: '',
      },
    ]);
  });

  // it('should create a job and associate skills, company, location, and salary', async () => {
  //   const mockJobData = {
  //     jobId: 'job123',
  //     title: 'Backend Developer',
  //     type: 'Full-time',
  //     name: 'TechCorp',
  //     industry: 'Software',
  //     skills: ['Node.js', 'TypeScript'],
  //     postedDate: new Date(),
  //     minSalary: 50000,
  //     maxSalary: 100000,
  //     city: 'San Francisco',
  //     state: 'CA',
  //     currency: 'USD',
  //     website: 'https://techcorp.com',
  //   };

  //   // Ensure findOne returns null to simulate no existing job
  //   jobRepository.findOne.mockResolvedValue(null);

  //   // Mock services to return valid objects
  //   companyService.findOrCreateCompany = jest
  //     .fn()
  //     .mockResolvedValue({ id: 1, name: 'TechCorp' });
  //   locationService.findOrCreateLocation = jest
  //     .fn()
  //     .mockResolvedValue({ id: 1, city: 'San Francisco' });
  //   salaryService.findOrCreateSalary = jest
  //     .fn()
  //     .mockResolvedValue({ id: 1, salary: 80000 });
  //   skillService.findOrCreateAndAssociateSkills = jest
  //     .fn()
  //     .mockResolvedValue(null);

  //   // Mock save to return the job
  //   jobRepository.save.mockResolvedValue({ id: 'job123', ...mockJobData });

  //   // Create the job
  //   const result = await jobService.createJob(mockJobData);

  //   // Assertions to check job creation
  //   expect(result).toHaveProperty('id');
  //   expect(companyService.findOrCreateCompany).toHaveBeenCalled();
  //   expect(locationService.findOrCreateLocation).toHaveBeenCalled();
  //   expect(salaryService.findOrCreateSalary).toHaveBeenCalled();
  // });

  it('should find or create a job type', async () => {
    const mockJobType = { type: 'Full-time' };
    jobTypeRepository.findOne = jest.fn().mockResolvedValue(null);

    jobTypeRepository.create = jest.fn().mockReturnValue(mockJobType);
    jobTypeRepository.save = jest.fn().mockResolvedValue(mockJobType);

    const result = await jobService.findOrCreateJobType('Full-time');

    expect(result).toEqual(mockJobType);
    expect(jobTypeRepository.create).toHaveBeenCalledWith({
      type: 'Full-time',
    });
  });

  it('should return job offers without any filters', async () => {
    const mockJobs = [{ id: 1, title: 'Job 1' }];
    const mockTotal = 1;
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

  it('should apply multiple filters and return correct results', async () => {
    const mockJobs = [
      {
        id: 1,
        title: 'Job 1',
        city: 'New York',
        salary: { minSalary: 50000, maxSalary: 70000 },
      },
    ];
    const mockTotal = 1;
    jobRepository.getManyAndCount.mockResolvedValue([mockJobs, mockTotal]);

    const result = await jobService.getJobOffers({
      title: 'Job 1',
      city: 'New York',
      state: 'NY',
      minSalary: 50000,
      maxSalary: 70000,
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

  it('should handle missing jobSkills gracefully', async () => {
    const mockJobs = [{ id: 1, title: 'Job 1', jobSkills: undefined }];
    const mockTotal = 1;
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
});
