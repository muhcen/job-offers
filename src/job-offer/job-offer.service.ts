import { Injectable, Logger } from '@nestjs/common';
import { GenericApiService } from './generic-api.service';
import { IJob } from './interfaces/job-offer.interface';
import { transformApiAData } from './api-a/api-a-transformer';
import { transformApiBData } from './api-b/api-b-transformer';
import { ConfigService } from '@nestjs/config';
import { JobService } from 'src/job/job.service';
import { Job } from 'src/job/entities/job.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class JobOfferService {
  private readonly logger = new Logger(JobOfferService.name);

  constructor(
    private readonly genericApiService: GenericApiService,
    private readonly configService: ConfigService,
    private readonly jobService: JobService,
  ) {}

  @Cron(process.env.CRON_SCHEDULE)
  async getUnifiedJobOffers(): Promise<{ jobs: Job[] }> {
    try {
      const apiAUrl = this.configService.get('API_A_URL');
      const apiBUrl = this.configService.get('API_B_URL');
      const apiAData: IJob[] =
        await this.genericApiService.fetchAndTransformJobOffers(
          apiAUrl,
          transformApiAData,
        );

      const apiBData: IJob[] =
        await this.genericApiService.fetchAndTransformJobOffers(
          apiBUrl,
          transformApiBData,
        );

      const unifiedJobs: IJob[] = [...apiAData, ...apiBData];

      const newJobs = await this.jobService.filterNewJobs(unifiedJobs);

      for (const job of newJobs) {
        await this.jobService.createJob(job);
      }

      this.logger.log(`Added ${newJobs.length} new job(s).`);

      return {
        jobs: newJobs,
      };
    } catch (error) {
      this.logger.error('Error fetching and transforming data', error.stack);
      throw new Error('Failed to fetch and transform job offers');
    }
  }
}
