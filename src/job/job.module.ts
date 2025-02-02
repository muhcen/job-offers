import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { CompanyModule } from 'src/company/company.module';
import { SkillModule } from 'src/skill/skill.module';
import { LocationModule } from 'src/location/location.module';
import { SalaryModule } from 'src/salary/salary.module';
import { JobType } from './entities/job-type.entity';
import { JobController } from './job.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, JobType]),
    CompanyModule,
    SkillModule,
    LocationModule,
    SalaryModule,
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
