import { Injectable, Logger } from '@nestjs/common';
import { Salary } from './entities/salary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';

@Injectable()
export class SalaryService {
  private readonly logger = new Logger(SalaryService.name);

  constructor(
    @InjectRepository(Salary)
    private readonly salaryRepository: Repository<Salary>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async findOrCreateSalary(salaryData: {
    min: number;
    max: number;
    currency: string;
  }): Promise<Salary> {
    try {
      let currency = await this.findOrCreateCurrency(salaryData.currency);

      let salary = await this.salaryRepository.findOne({
        where: {
          minSalary: salaryData.min,
          maxSalary: salaryData.max,
          currency: currency,
        },
      });

      if (!salary) {
        salary = this.salaryRepository.create({
          minSalary: salaryData.min,
          maxSalary: salaryData.max,
          currency: currency,
        });

        salary = await this.salaryRepository.save(salary);
      }

      return salary;
    } catch (error) {
      this.logger.error(
        'Error during salary creation or retrieval:',
        error.stack,
      );
      throw new Error(`Failed to find or create salary: ${error.message}`);
    }
  }

  async findOrCreateCurrency(code: string): Promise<Currency> {
    try {
      let currency = await this.currencyRepository.findOne({
        where: { code },
      });

      if (!currency) {
        currency = this.currencyRepository.create({ code });
        currency = await this.currencyRepository.save(currency);
      }

      return currency;
    } catch (error) {
      this.logger.error(
        'Error during currency creation or retrieval:',
        error.stack,
      );
      throw new Error(`Failed to find or create currency: ${error.message}`);
    }
  }
}
