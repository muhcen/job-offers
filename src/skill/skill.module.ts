import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { JobSkills } from './entities/job-skills.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, JobSkills])],
  controllers: [],
  providers: [SkillService],
  exports: [SkillService],
})
export class SkillModule {}
