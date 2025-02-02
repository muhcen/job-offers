import { convertPostedDate } from 'src/utils/convert-date';
import { IJob } from '../interfaces/job-offer.interface';
import {
  JobOfferADetails,
  JobOfferAResponse,
} from './interfaces/job-offer-a.interface';

export function transformApiAData(response: JobOfferAResponse): IJob[] {
  const jobOfferADetails: JobOfferADetails = response.data; // Access the 'data' inside ApiResponse

  return jobOfferADetails.jobs.map((job) => {
    console.log(
      `Processing job: ${job.jobId} - Salary Range: ${job.details.salaryRange}`,
    );

    const salaryRangeParts = job.details.salaryRange.split(' - ');
    let minSalary = null;
    let maxSalary = null;

    if (salaryRangeParts.length === 2) {
      minSalary = parseSalary(salaryRangeParts[0]);
      maxSalary = parseSalary(salaryRangeParts[1]);
    }
    const locationParts = job.details.location.split(', ');
    const city = locationParts[0];
    const state = locationParts[1];

    console.log(`minSalary: ${minSalary}, maxSalary: ${maxSalary}`);

    return {
      jobId: job.jobId,
      title: job.title,
      type: job.details.type,
      name: job.company.name,
      industry: job.company.industry || '',
      skills: job.skills,
      postedDate: convertPostedDate(job.postedDate),
      minSalary,
      maxSalary,
      city,
      state,
      currency: 'USD',
    };
  });
}

export function parseSalary(salary: string): number {
  let numericValue = salary.replace('$', '').trim();
  if (numericValue.endsWith('k')) {
    numericValue = numericValue.replace('k', '').trim();
    return parseFloat(numericValue) * 1000;
  }
  return parseFloat(numericValue);
}
