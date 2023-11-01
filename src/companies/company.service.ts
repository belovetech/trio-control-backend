import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async createCompany(data: Partial<Company>): Promise<Company> {
    const company = this.companyRepository.create(data);
    return this.companyRepository.save(company);
  }

  async getCompanyById(id: string): Promise<Company> {
    return this.companyRepository.findOneBy({ id });
  }
}
