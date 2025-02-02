import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findOrCreateCompany(companyData: {
    name: string;
    industry?: string;
    website?: string;
  }): Promise<Company> {
    try {
      let company = await this.companyRepository.findOne({
        where: { name: companyData.name },
      });

      if (!company) {
        company = this.companyRepository.create({
          name: companyData.name,
          industry: companyData.industry,
          website: companyData.website,
        });

        company = await this.companyRepository.save(company);
      }

      return company;
    } catch (error) {
      this.logger.error(
        'Error during company creation or retrieval:',
        error.stack,
      );
      throw new Error(`Failed to find or create company: ${error.message}`);
    }
  }
}
