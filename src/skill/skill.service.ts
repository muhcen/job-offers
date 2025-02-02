import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { In, Repository } from 'typeorm';
import { JobSkills } from './entities/job-skills.entity';
import { Job } from 'src/job/entities/job.entity';

@Injectable()
export class SkillService {
  private readonly logger = new Logger(SkillService.name);

  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    @InjectRepository(JobSkills)
    private readonly jobSkillsRepository: Repository<JobSkills>,
  ) {}

  async findOrCreateAndAssociateSkills(
    job: Job,
    skillNames: string[],
  ): Promise<void> {
    try {
      const existingSkills = await this.skillRepository.find({
        where: {
          skillName: In(skillNames),
        },
      });

      const newSkillNames = skillNames.filter(
        (name) => !existingSkills.some((skill) => skill.skillName === name),
      );

      const newSkills = newSkillNames.map((name) =>
        this.skillRepository.create({ skillName: name }),
      );

      await this.skillRepository.save(newSkills);

      const allSkills = [...existingSkills, ...newSkills];

      for (const skill of allSkills) {
        const jobSkill = this.jobSkillsRepository.create({
          job,
          skill,
        });
        await this.jobSkillsRepository.save(jobSkill);
      }
    } catch (error) {
      this.logger.error(
        'Error during skill creation or retrieval:',
        error.stack,
      );
      throw new Error(`Failed to find or create skill: ${error.message}`);
    }
  }
}
