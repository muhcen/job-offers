import { Job } from 'src/job/entities/job.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  industry: string;

  @Column({ nullable: true })
  website: string;

  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];
}
