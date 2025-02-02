import { Job } from 'src/job/entities/job.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Currency } from './currency.entity';

@Entity('salaries')
export class Salary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  minSalary: number;

  @Column()
  maxSalary: number;

  @ManyToOne(() => Currency, (currency) => currency.salaries)
  currency: Currency;

  @OneToMany(() => Job, (job) => job.salary)
  jobs: Job[];
}
