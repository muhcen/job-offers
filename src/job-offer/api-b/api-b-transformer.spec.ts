import { transformApiBData } from './api-b-transformer'; 
import { convertPostedDate } from 'src/utils/convert-date';
import { JobOfferBResponse } from './interfaces/job-offer-b.interface';

// Mock the convertPostedDate function
jest.mock('src/utils/convert-date', () => ({
  convertPostedDate: jest.fn().mockReturnValue('2025-02-02'),
}));

describe('transformApiBData', () => {
  it('should transform valid data correctly', () => {
    const response: JobOfferBResponse = {
      data: {
        data: {
          jobsList: {
            job1: {
              position: 'Software Engineer',
              compensation: { min: 60000, max: 120000, currency: 'USD' },
              location: { remote: true, city: 'New York', state: 'NY' },
              requirements: {
                technologies: ['JavaScript', 'Node.js'],
                experience: 0,
              },
              employer: {
                companyName: 'Tech Corp',
                website: 'https://techcorp.com',
              },
              datePosted: '2025-02-01',
            },
          },
        },
        status: 0,
      },
    };

    const result = transformApiBData(response);

    expect(result).toEqual([
      {
        jobId: 'job1',
        title: 'Software Engineer',
        remote: true,
        type: '',
        name: 'Tech Corp',
        industry: '',
        skills: ['JavaScript', 'Node.js'],
        postedDate: '2025-02-02',
        minSalary: 60000,
        maxSalary: 120000,
        city: 'New York',
        state: 'NY',
        currency: 'USD',
        website: 'https://techcorp.com',
      },
    ]);
  });

  it('should handle missing salary fields', () => {
    const response: JobOfferBResponse = {
      data: {
        data: {
          jobsList: {
            job2: {
              position: 'Frontend Developer',
              compensation: { min: null, max: null, currency: 'USD' },
              location: { remote: false, city: 'San Francisco', state: 'CA' },
              requirements: {
                technologies: ['React', 'CSS'],
                experience: 0,
              },
              employer: { companyName: 'Dev Co', website: 'https://devco.com' },
              datePosted: '2025-02-02',
            },
          },
        },
        status: 0,
      },
    };

    const result = transformApiBData(response);

    expect(result).toEqual([
      {
        jobId: 'job2',
        title: 'Frontend Developer',
        remote: false,
        type: '',
        name: 'Dev Co',
        industry: '',
        skills: ['React', 'CSS'],
        postedDate: '2025-02-02',
        minSalary: null,
        maxSalary: null,
        city: 'San Francisco',
        state: 'CA',
        currency: 'USD',
        website: 'https://devco.com',
      },
    ]);
  });

  it('should return an empty array if jobsList is empty', () => {
    const response: JobOfferBResponse = {
      data: {
        data: {
          jobsList: {},
        },
        status: 0,
      },
    };

    const result = transformApiBData(response);

    expect(result).toEqual([]);
  });

  it('should handle missing employer data', () => {
    const response: JobOfferBResponse = {
      data: {
        data: {
          jobsList: {
            job3: {
              position: 'Backend Developer',
              compensation: { min: 70000, max: 150000, currency: 'USD' },
              location: { remote: true, city: 'Los Angeles', state: 'CA' },
              requirements: {
                technologies: ['Node.js', 'Express'],
                experience: 0,
              },
              employer: null, // No employer data
              datePosted: '2025-02-03',
            },
          },
        },
        status: 0,
      },
    };

    const result = transformApiBData(response);

    expect(result).toEqual([
      {
        jobId: 'job3',
        title: 'Backend Developer',
        remote: true,
        type: '',
        name: '',
        industry: '',
        skills: ['Node.js', 'Express'],
        postedDate: '2025-02-02',
        minSalary: 70000,
        maxSalary: 150000,
        city: 'Los Angeles',
        state: 'CA',
        currency: 'USD',
        website: '',
      },
    ]);
  });

  it('should handle missing location data', () => {
    const response: JobOfferBResponse = {
      data: {
        data: {
          jobsList: {
            job4: {
              position: 'DevOps Engineer',
              compensation: { min: 80000, max: 160000, currency: 'USD' },
              location: null,
              requirements: {
                technologies: ['Docker', 'Kubernetes'],
                experience: 0,
              },
              employer: {
                companyName: 'Cloud Corp',
                website: 'https://cloudcorp.com',
              },
              datePosted: '2025-02-04',
            },
          },
        },
        status: 0,
      },
    };

    const result = transformApiBData(response);

    expect(result).toEqual([
      {
        jobId: 'job4',
        title: 'DevOps Engineer',
        remote: undefined, 
        type: '',
        name: 'Cloud Corp',
        industry: '',
        skills: ['Docker', 'Kubernetes'],
        postedDate: '2025-02-02',
        minSalary: 80000,
        maxSalary: 160000,
        city: undefined, 
        state: undefined, 
        currency: 'USD',
        website: 'https://cloudcorp.com',
      },
    ]);
  });
});
