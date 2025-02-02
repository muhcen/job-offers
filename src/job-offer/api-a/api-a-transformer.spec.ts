import {
  JobOfferAResponse,
  JobOfferADetails,
} from './interfaces/job-offer-a.interface';
import { IJob } from '../interfaces/job-offer.interface';
import { convertPostedDate } from 'src/utils/convert-date';
import { parseSalary, transformApiAData } from './api-a-transformer';

// Mock the convertPostedDate function
jest.mock('src/utils/convert-date', () => ({
  convertPostedDate: jest.fn().mockReturnValue('2025-02-02'),
}));

describe('transformApiAData', () => {
  it('should transform API response into IJob objects correctly', () => {
    const mockApiResponse: JobOfferAResponse = {
      data: {
        jobs: [
          {
            jobId: '1',
            title: 'Software Developer',
            company: { name: 'Tech Co.', industry: 'Software' },
            details: {
              salaryRange: '$50k - $100k',
              type: 'Full-time',
              location: 'San Francisco, CA',
            },
            skills: ['JavaScript', 'TypeScript'],
            postedDate: '2025-02-02T00:00:00Z',
          },
        ],
        metadata: {
          requestId: '',
          timestamp: '',
        },
      },
      status: 0,
    };

    const transformedJobs: IJob[] = transformApiAData(mockApiResponse);

    expect(transformedJobs.length).toBe(1);
    expect(transformedJobs[0].jobId).toBe('1');
    expect(transformedJobs[0].title).toBe('Software Developer');
    expect(transformedJobs[0].minSalary).toBe(50000);
    expect(transformedJobs[0].maxSalary).toBe(100000);
    expect(transformedJobs[0].city).toBe('San Francisco');
    expect(transformedJobs[0].state).toBe('CA');
    expect(transformedJobs[0].currency).toBe('USD');
    expect(transformedJobs[0].postedDate).toBe('2025-02-02');
  });

  it('should handle missing salary range and set minSalary and maxSalary to null', () => {
    const mockApiResponse: JobOfferAResponse = {
      data: {
        jobs: [
          {
            jobId: '1',
            title: 'Software Developer',
            company: { name: 'Tech Co.', industry: 'Software' },
            details: {
              salaryRange: '',
              type: 'Full-time',
              location: 'San Francisco, CA',
            },
            skills: ['JavaScript', 'TypeScript'],
            postedDate: '2025-02-02T00:00:00Z',
          },
        ],
        metadata: {
          requestId: '',
          timestamp: '',
        },
      },
      status: 0,
    };

    const transformedJobs: IJob[] = transformApiAData(mockApiResponse);

    expect(transformedJobs[0].minSalary).toBeNull();
    expect(transformedJobs[0].maxSalary).toBeNull();
  });

  it('should split the location correctly into city and state', () => {
    const mockApiResponse: JobOfferAResponse = {
      data: {
        jobs: [
          {
            jobId: '1',
            title: 'Software Developer',
            company: { name: 'Tech Co.', industry: 'Software' },
            details: {
              salaryRange: '$50k - $100k',
              type: 'Full-time',
              location: 'San Francisco, CA',
            },
            skills: ['JavaScript', 'TypeScript'],
            postedDate: '2025-02-02T00:00:00Z',
          },
        ],
        metadata: {
          requestId: '',
          timestamp: '',
        },
      },
      status: 0,
    };

    const transformedJobs: IJob[] = transformApiAData(mockApiResponse);

    expect(transformedJobs[0].city).toBe('San Francisco');
    expect(transformedJobs[0].state).toBe('CA');
  });

  it('should call convertPostedDate function correctly', () => {
    const mockApiResponse: JobOfferAResponse = {
      data: {
        jobs: [
          {
            jobId: '1',
            title: 'Software Developer',
            company: { name: 'Tech Co.', industry: 'Software' },
            details: {
              salaryRange: '$50k - $100k',
              type: 'Full-time',
              location: 'San Francisco, CA',
            },
            skills: ['JavaScript', 'TypeScript'],
            postedDate: '2025-02-02T00:00:00Z',
          },
        ],
        metadata: {
          requestId: '',
          timestamp: '',
        },
      },
      status: 0,
    };

    transformApiAData(mockApiResponse);

    expect(convertPostedDate).toHaveBeenCalledWith('2025-02-02T00:00:00Z');
  });
});

describe('parseSalary', () => {
  it('should parse salary range correctly for salaries with "k" (e.g., "$50k")', () => {
    expect(parseSalary('$50k')).toBe(50000);
  });

  it('should parse salary correctly for numeric salaries (e.g., "$50000")', () => {
    expect(parseSalary('$50000')).toBe(50000);
  });

  it('should handle invalid salary input gracefully', () => {
    expect(parseSalary('$invalid')).toBeNaN();
  });
});
