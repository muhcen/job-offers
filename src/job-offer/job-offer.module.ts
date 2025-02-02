import { Module } from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { JobOfferController } from './job-offer.controller';
import { JobOfferAService } from './api-a/job-offer-a.service';
import { JobOfferBService } from './api-b/job-offer-b.service';
import { GenericApiService } from './generic-api.service';
import { JobModule } from 'src/job/job.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [JobModule, ScheduleModule.forRoot()],
  controllers: [JobOfferController],
  providers: [
    JobOfferService,
    JobOfferAService,
    JobOfferBService,
    GenericApiService,
  ],
})
export class JobOfferModule {}
