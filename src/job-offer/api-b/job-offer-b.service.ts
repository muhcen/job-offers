import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { transformApiBData } from './api-b-transformer';
import { IJob } from '../interfaces/job-offer.interface';
import { JobOfferBResponse } from './interfaces/job-offer-b.interface';

@Injectable()
export class JobOfferBService {
  private readonly logger = new Logger(JobOfferBService.name);

  constructor(private configService: ConfigService) {}

  async fetchJobOffersFromApiB(): Promise<IJob[]> {
    try {
      const apiBUrl = this.configService.get<string>('API_B_URL');
      const response = await axios.get<JobOfferBResponse>(apiBUrl);

      this.logger.log('Data fetched successfully from API B', {
        data: response.data,
      });

      const transformedData = transformApiBData(response.data);

      return transformedData;
    } catch (error) {
      this.logger.error('Error fetching data from API B', error.stack);
      throw new Error('Failed to fetch data from API B');
    }
  }
}
