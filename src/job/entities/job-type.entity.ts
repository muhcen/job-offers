import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Job } from 'src/job/entities/job.entity';

@Entity('job_types')
export class JobType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @OneToMany(() => Job, (job) => job.jobType)
  jobs: Job[];
}
