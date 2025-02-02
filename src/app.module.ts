import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { JobOfferModule } from './job-offer/job-offer.module';
import { JobModule } from './job/job.module';
import { CompanyModule } from './company/company.module';
import { LocationModule } from './location/location.module';
import { SalaryModule } from './salary/salary.module';
import { SkillModule } from './skill/skill.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                },
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),

    DatabaseModule,

    JobOfferModule,

    JobModule,

    CompanyModule,

    LocationModule,

    SalaryModule,

    SkillModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
