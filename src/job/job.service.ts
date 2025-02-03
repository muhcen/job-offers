import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Job } from 'src/job/entities/job.entity';
import { JobSkills } from 'src/skill/entities/job-skills.entity';
import { CompanyService } from 'src/company/company.service';
import { LocationService } from 'src/location/location.service';
import { SalaryService } from 'src/salary/salary.service';
import { IJob } from 'src/job-offer/interfaces/job-offer.interface';
import { Skill } from 'src/skill/entities/skill.entity';
import { SkillService } from 'src/skill/skill.service';
import { JobType } from './entities/job-type.entity';

interface GetJobOffersOptions {
  title?: string;
  city?: string;
  state?: string;
  minSalary?: number;
  maxSalary?: number;
  page: number;
  limit: number;
}

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(JobType)
    private readonly jobTypeRepository: Repository<JobType>,
    private readonly skillService: SkillService,
    private readonly companyService: CompanyService,
    private readonly locationService: LocationService,
    private readonly salaryService: SalaryService,
  ) {}

  private async findExistingJobs(jobIds: string[]): Promise<Job[]> {
    return await this.jobRepository.find({
      where: { id: In(jobIds) },
    });
  }

  async filterNewJobs(jobData: IJob[]): Promise<any[]> {
    const jobIds = jobData.map((job) => job.jobId);

    const existingJobs = await this.findExistingJobs(jobIds);

    const existingJobIds = new Set(existingJobs.map((job) => job.id));

    const newJobs = jobData.filter((job) => !existingJobIds.has(job.jobId));

    return newJobs;
  }

  async createJob(jobData: IJob): Promise<Job> {
    try {
      const {
        jobId,
        title,
        type,
        name,
        industry,
        skills,
        postedDate,
        minSalary,
        maxSalary,
        city,
        state,
        currency,
        website,
      } = jobData;

      let job = await this.jobRepository.findOne({ where: { id: jobId } });

      if (!job) {
        job = this.jobRepository.create({
          id: jobId,
          title,
          postedDate,
        });

        const [company, location, salary, jobType] = await Promise.all([
          this.companyService.findOrCreateCompany({ name, industry, website }),
          this.locationService.findOrCreateLocation({ city, state }),
          this.salaryService.findOrCreateSalary({
            min: minSalary,
            max: maxSalary,
            currency,
          }),
          type ? this.findOrCreateJobType(type) : null,
        ]);

        if (jobType) {
          job.jobType = jobType;
        }

        job.company = company;
        job.location = location;
        job.salary = salary;

        job = await this.jobRepository.save(job);
      }

      await this.skillService.findOrCreateAndAssociateSkills(job, skills);

      return job;
    } catch (error) {
      this.logger.error('Error during job creation or retrieval:', error.stack);
      throw new Error(`Failed to find or create job: ${error.message}`);
    }
  }
  async findOrCreateJobType(type: string): Promise<JobType> {
    try {
      let jobType = await this.jobTypeRepository.findOne({ where: { type } });

      if (!jobType) {
        jobType = this.jobTypeRepository.create({ type });
        jobType = await this.jobTypeRepository.save(jobType);
      }

      return jobType;
    } catch (error) {
      this.logger.error(
        'Error during job type creation or retrieval:',
        error.stack,
      );
      throw new Error(`Failed to find or create job type: ${error.message}`);
    }
  }

  async getJobOffers({
    title,
    city,
    state,
    minSalary,
    maxSalary,
    page,
    limit,
  }: GetJobOffersOptions): Promise<any> {
    try {
      const queryBuilder = this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.company', 'company')
        .leftJoinAndSelect('job.location', 'location')
        .leftJoinAndSelect('job.salary', 'salary')
        .leftJoinAndSelect('job.jobType', 'job_types')
        .leftJoinAndSelect('job.jobSkills', 'jobSkills')
        .leftJoinAndSelect('jobSkills.skill', 'skill');

      if (title) {
        queryBuilder.andWhere('job.title ILIKE :title', {
          title: `%${title}%`,
        });
      }
      if (city) {
        queryBuilder.andWhere('location.city ILIKE :city', {
          city: `%${city}%`,
        });
      }

      if (state) {
        queryBuilder.andWhere('location.state ILIKE :state', {
          state: `%${state}%`,
        });
      }
      if (minSalary) {
        queryBuilder.andWhere('salary.minSalary >= :minSalary', {
          minSalary,
        });
      }

      if (maxSalary) {
        queryBuilder.andWhere('salary.maxSalary <= :maxSalary', {
          maxSalary,
        });
      }
      const skip = (page - 1) * limit;

      queryBuilder.skip(skip).take(limit);

      queryBuilder.orderBy('job.postedDate', 'DESC');

      const [jobs, total] = await queryBuilder.getManyAndCount();

      const resultJobs = jobs.map((job) => {
        const jobSkills = job.jobSkills.map(
          (jobSkill) => jobSkill.skill.skillName,
        );
        return {
          ...job,
          jobSkills: jobSkills,
          jobType: job?.jobType?.type,
        };
      });
      return {
        data: resultJobs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(
        'Error fetching job offers from the database',
        error.stack,
      );

      throw new HttpException(
        `Database query failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
