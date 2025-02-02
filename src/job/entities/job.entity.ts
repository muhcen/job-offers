import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
  JoinColumn,
} from 'typeorm';

import { Company } from 'src/company/entities/company.entity';
import { Salary } from 'src/salary/entities/salary.entity';
import { JobSkills } from 'src/skill/entities/job-skills.entity';
import { Location } from 'src/location/entities/location.entity';
import { JobType } from './job-type.entity';

@Entity('jobs')
export class Job {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => JobType, (jobType) => jobType.jobs)
  jobType: JobType;

  @ManyToOne(() => Company, (company) => company.jobs)
  company: Company;

  @ManyToOne(() => Location, (location) => location.jobs)
  location: Location;

  @ManyToOne(() => Salary, (salary) => salary.jobs)
  salary: Salary;

  @OneToMany(() => JobSkills, (jobSkills) => jobSkills.job)
  jobSkills: JobSkills[];

  @Column('date')
  postedDate: Date;
}
