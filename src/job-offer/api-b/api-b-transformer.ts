import { convertPostedDate } from 'src/utils/convert-date';
import { IJob } from '../interfaces/job-offer.interface';
import {
  JobOfferBDetails,
  JobOfferBResponse,
} from './interfaces/job-offer-b.interface';

export function transformApiBData(response: JobOfferBResponse): IJob[] {
  const jobOfferBDetails: JobOfferBDetails = response.data.data;

  return Object.keys(jobOfferBDetails.jobsList).map((key) => {
    const job = jobOfferBDetails.jobsList[key];

    const minSalary = job?.compensation?.min;
    const maxSalary = job?.compensation?.max;

    return {
      jobId: key,
      title: job?.position,
      remote: job?.location?.remote,
      type: '',
      name: job?.employer?.companyName || '',
      industry: '',
      skills: job?.requirements?.technologies,
      postedDate: convertPostedDate(job?.datePosted),
      minSalary: minSalary,
      maxSalary: maxSalary,
      city: job?.location?.city,
      state: job?.location?.state,
      currency: job?.compensation?.currency,
      website: job?.employer?.website || '',
    };
  });
}
