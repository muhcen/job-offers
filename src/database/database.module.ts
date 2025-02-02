import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { Job } from 'src/job/entities/job.entity';
import { Company } from 'src/company/entities/company.entity';
import { Location } from 'src/location/entities/location.entity';
import { Salary } from 'src/salary/entities/salary.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { JobSkills } from 'src/skill/entities/job-skills.entity';
import { JobType } from 'src/job/entities/job-type.entity';
import { Currency } from 'src/salary/entities/currency.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService, logger: Logger) => {
        try {
          return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST', 'postgres-db'),
            port: configService.get<number>('DB_PORT', 5432),
            username: configService.get<string>('DB_USERNAME', 'postgres'),
            password: configService.get<string>('DB_PASSWORD', 'password'),
            database: configService.get<string>('DB_NAME', 'devotel'),
            entities: [
              Job,
              Company,
              Location,
              Salary,
              Skill,
              JobSkills,
              JobType,
              Currency,
            ],
            synchronize: configService.get<string>('NODE_ENV') !== 'production',
            logging: configService.get<string>('NODE_ENV') === 'development',
            extra: {
              connectionLimit: 10,
            },
          };
        } catch (error) {
          logger.error(error, 'Error connecting to the database');
          throw error;
        }
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
