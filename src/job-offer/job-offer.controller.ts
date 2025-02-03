import { Controller, Get } from '@nestjs/common';
import { JobOfferService } from './job-offer.service';

@Controller('job-offers')
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {}
}
