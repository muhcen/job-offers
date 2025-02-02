import { Job } from 'src/job/entities/job.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Skill } from './skill.entity';

@Entity('job_skills')
export class JobSkills {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Job, (job) => job.jobSkills)
  job: Job;

  @ManyToOne(() => Skill, (skill) => skill.jobSkills)
  skill: Skill;
}
