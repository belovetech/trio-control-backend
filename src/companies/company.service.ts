import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './entities';
import { CreateCompanyDto, UpdateCompanyDto } from './dtos';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private configService: ConfigService,
  ) {}

  async createCompany(
    user_id: string,
    data: CreateCompanyDto,
  ): Promise<Company> {
    const { company_name, total_products, total_users } = data;

    const companyExists = await this.companyRepository.findOne({
      where: { user_id },
    });

    if (companyExists) {
      throw new ConflictException('User already created company');
    }

    const company = this.companyRepository.create({
      company_name,
      total_users,
      total_products,
      user_id,
      percentage: this.calculatePercentage(total_products, total_users),
      isAdmin: this.isAdmin(user_id),
    });

    return this.companyRepository.save(company);
  }

  async getMyCompany(user_id: string): Promise<Company> {
    const company = await this.companyRepository.findOneBy({ user_id });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async getCompanyById(id: string): Promise<Company> {
    const company = await this.companyRepository.findOneBy({ id });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async getCompanies(filter?: Partial<Company>): Promise<Company[]> {
    const company = await this.companyRepository.find({
      where: filter,
    });

    return company;
  }

  async updateCompany(id: string, data: UpdateCompanyDto): Promise<Company> {
    const { company_name, total_products, total_users } = data;

    const company = await this.companyRepository.findOneBy({ id });

    let percentage;
    if (total_users || total_products) {
      percentage = this.calculatePercentage(
        total_products ?? company.total_products,
        total_users ?? company.total_users,
      );
    }

    await this.companyRepository.update(id, {
      company_name,
      total_products,
      total_users,
      percentage: percentage,
    });

    return { ...company, ...data, percentage };
  }

  async deleteCompany(id: string) {
    const { affected } = await this.companyRepository.delete(id);

    if (affected === 0) {
      throw new NotFoundException('Company not found');
    }
    return { message: 'Company deleted successfully' };
  }

  private calculatePercentage(
    totalProducts: number,
    totalusers: number,
  ): string {
    if (+totalusers === 0) return '0%';

    const percentage = Math.round((+totalProducts / +totalusers) * 100);

    return `${percentage}%`;
  }

  private isAdmin(user_id: string): boolean {
    return this.configService.get('ADMIN_UID') === user_id;
  }

  private transformtoInteger(value: string): number {
    return parseInt(value, 10);
  }
}
