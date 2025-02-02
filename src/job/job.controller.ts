import { Controller, Get, Query, Logger } from '@nestjs/common';
import { JobService } from './job.service';
import { GetJobOffersDto } from './dto/get-job-offer.dto';

@Controller('api/job-offers')
export class JobController {
  private readonly logger = new Logger(JobController.name);

  constructor(private readonly jobService: JobService) {}

  @Get()
  async getJobOffers(@Query() query: GetJobOffersDto): Promise<any> {
    console.log(query);
    const jobOffers = await this.jobService.getJobOffers(query);

    return jobOffers;
  }
}
