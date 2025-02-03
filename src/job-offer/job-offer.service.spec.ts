import { Test, TestingModule } from '@nestjs/testing';
import { JobOfferService } from './job-offer.service';
import { GenericApiService } from './generic-api.service';
import { ConfigService } from '@nestjs/config';
import { JobService } from 'src/job/job.service';
import { Job } from 'src/job/entities/job.entity';
import { Logger } from '@nestjs/common';

describe('JobOfferService', () => {
  let service: JobOfferService;
  let genericApiService: GenericApiService;
  let jobService: JobService;
  let configService: ConfigService;

  const mockGenericApiService = {
    fetchAndTransformJobOffers: jest.fn(),
  };

  const mockJobService = {
    filterNewJobs: jest.fn(),
    createJob: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobOfferService,
        {
          provide: GenericApiService,
          useValue: mockGenericApiService,
        },
        {
          provide: JobService,
          useValue: mockJobService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<JobOfferService>(JobOfferService);
    genericApiService = module.get<GenericApiService>(GenericApiService);
    jobService = module.get<JobService>(JobService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUnifiedJobOffers', () => {
    it('should fetch and return unified job offers successfully', async () => {
      const apiAUrl = 'http://apiA.com';
      const apiBUrl = 'http://apiB.com';

      // Mock ConfigService
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'API_A_URL') return apiAUrl;
        if (key === 'API_B_URL') return apiBUrl;
      });

      const apiAData = [
        { title: 'Job A1', description: 'Description A1' },
        { title: 'Job A2', description: 'Description A2' },
      ];

      const apiBData = [
        { title: 'Job B1', description: 'Description B1' },
        { title: 'Job B2', description: 'Description B2' },
      ];

      mockGenericApiService.fetchAndTransformJobOffers
        .mockResolvedValueOnce(apiAData)
        .mockResolvedValueOnce(apiBData);

      const newJobs = [...apiAData, ...apiBData];
      mockJobService.filterNewJobs.mockResolvedValue(newJobs);

      // Mock job creation
      const createdJobs = newJobs.map((job, index) => ({
        ...job,
        id: index + 1,
      }));
      mockJobService.createJob.mockResolvedValueOnce(createdJobs[0]);
      mockJobService.createJob.mockResolvedValueOnce(createdJobs[1]);
      mockJobService.createJob.mockResolvedValueOnce(createdJobs[2]);
      mockJobService.createJob.mockResolvedValueOnce(createdJobs[3]);

      const result = await service.getUnifiedJobOffers();

      expect(result.jobs).toHaveLength(4);
      expect(result.jobs[0].title).toBe('Job A1');
      expect(result.jobs[1].title).toBe('Job A2');
      expect(result.jobs[2].title).toBe('Job B1');
      expect(result.jobs[3].title).toBe('Job B2');
      expect(
        mockGenericApiService.fetchAndTransformJobOffers,
      ).toHaveBeenCalledTimes(2);
      expect(mockJobService.createJob).toHaveBeenCalledTimes(4);
    });

    // it('should handle errors gracefully and throw an exception', async () => {
    //   mockGenericApiService.fetchAndTransformJobOffers.mockRejectedValueOnce(
    //     new Error('API fetch error'),
    //   );

    //   await expect(service.getUnifiedJobOffers()).rejects.toThrow(
    //     'Failed to fetch and transform job offers',
    //   );

    //   expect(
    //     mockGenericApiService.fetchAndTransformJobOffers,
    //   ).toHaveBeenCalled();
    // });
  });
});
