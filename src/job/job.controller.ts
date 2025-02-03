import { Controller, Get, Query, Logger } from '@nestjs/common';
import { JobService } from './job.service';
import { GetJobOffersDto } from './dto/get-job-offer.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('api/job-offers')
export class JobController {
  private readonly logger = new Logger(JobController.name);

  constructor(private readonly jobService: JobService) {}

  @Get()
  @ApiOperation({ summary: 'Get job offers based on query params' })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Job title to filter job offers by',
  })
  @ApiQuery({
    name: 'city',
    required: false,
    type: String,
    description: 'City to filter job offers by',
  })
  @ApiQuery({
    name: 'state',
    required: false,
    type: String,
    description: 'State to filter job offers by',
  })
  @ApiQuery({
    name: 'minSalary',
    required: false,
    type: Number,
    description: 'Minimum salary to filter job offers by',
  })
  @ApiQuery({
    name: 'maxSalary',
    required: false,
    type: Number,
    description: 'Maximum salary to filter job offers by',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of results per page for pagination',
  })
  async getJobOffers(@Query() query: GetJobOffersDto): Promise<any> {
    console.log(query);
    const jobOffers = await this.jobService.getJobOffers(query);

    return jobOffers;
  }
}
