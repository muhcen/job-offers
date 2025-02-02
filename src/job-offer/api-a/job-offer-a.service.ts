import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { transformApiAData } from './api-a-transformer';
import { IJob } from '../interfaces/job-offer.interface';
import { JobOfferAResponse } from './interfaces/job-offer-a.interface';

@Injectable()
export class JobOfferAService {
  private readonly logger = new Logger(JobOfferAService.name);

  constructor(private configService: ConfigService) {}

  async fetchJobOffersFromApiA(): Promise<IJob[]> {
    try {
      const apiAUrl = this.configService.get<string>('API_A_URL');
      const response = await axios.get<JobOfferAResponse>(apiAUrl);

      this.logger.log('Data fetched successfully from API A', {
        data: response.data,
      });

      const transformedData = transformApiAData(response.data);

      return transformedData;
    } catch (error) {
      this.logger.error('Error fetching data from API A', error.stack);
      throw new Error('Failed to fetch data from API A');
    }
  }
}
