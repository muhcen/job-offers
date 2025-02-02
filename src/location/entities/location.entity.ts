import { Job } from 'src/job/entities/job.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column()
  state: string;

  @OneToMany(() => Job, (job) => job.location)
  jobs: Job[];
}
