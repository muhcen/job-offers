import { Controller, Get } from '@nestjs/common';
import { JobOfferService } from './job-offer.service';

@Controller('job-offers')
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {}
  @Get()
  async getUnifiedJobOffers() {
    try {
      const unifiedJobOffers = await this.jobOfferService.getUnifiedJobOffers();

      return unifiedJobOffers;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to fetch and transform job offers',
      };
    }
  }
}
