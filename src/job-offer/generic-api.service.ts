import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { ConfigService } from '@nestjs/config';
import { ApiResponse, IJob } from './interfaces/job-offer.interface';

@Injectable()
export class GenericApiService {
  private readonly logger = new Logger(GenericApiService.name);
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create();

    axiosRetry(this.axiosInstance, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return (
          axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error)
        );
      },
    });
  }

  async fetchAndTransformJobOffers(
    apiUrl: string,
    transformFunc: (data: ApiResponse) => IJob[],
  ): Promise<IJob[]> {
    try {
      const response: ApiResponse =
        await this.axiosInstance.get<ApiResponse>(apiUrl);
      return transformFunc(response);
    } catch (error) {
      this.logger.error(
        'Error fetching or transforming data from API',
        error.stack,
      );
      throw new Error('Failed to fetch and transform job offers');
    }
  }
}
