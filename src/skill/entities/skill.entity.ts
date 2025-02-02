import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JobSkills } from './job-skills.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  skillName: string;

  @OneToMany(() => JobSkills, (jobSkills) => jobSkills.skill)
  jobSkills: JobSkills[];
}
