import { Module } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salary } from './entities/salary.entity';
import { Currency } from './entities/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Salary, Currency])],
  controllers: [],
  providers: [SalaryService],
  exports: [SalaryService],
})
export class SalaryModule {}
