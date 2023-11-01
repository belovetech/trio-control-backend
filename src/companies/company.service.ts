import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './entities';
import { CreateCompanyDto, UpdateCompanyDto } from './dtos';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async createCompany(data: CreateCompanyDto): Promise<Company> {
    const companyExists = await this.companyRepository.findOne({
      where: { companyName: data.companyName },
    });

    if (companyExists) {
      throw new ConflictException('Company already exist');
    }

    const { numOfUsers, numOfProducts } = data;
    const company = this.companyRepository.create({
      ...data,
      percentage: this.calculatePercentage(numOfUsers, numOfProducts),
    });

    return this.companyRepository.save(company);
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
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) {
      throw new NotFoundException('Company  not found');
    }

    let percentage;
    if (data.numOfUsers || data.numOfProducts) {
      percentage = this.calculatePercentage(
        data.numOfUsers ?? company.numOfUsers,
        data.numOfProducts ?? company.numOfProducts,
      );
    }

    await this.companyRepository.update(id, {
      ...data,
      percentage: percentage,
    });

    return { ...company, ...data, percentage };
  }

  async deleteCompany(id: string): Promise<Company> {
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) {
      throw new NotFoundException('Company  not found');
    }
    await this.companyRepository.delete(id);
    return company;
  }

  async upload(id: string, logoURL: string) {
    const company = await this.companyRepository.findOneBy({ id });

    if (!company) {
      throw new NotFoundException('Company not found');
    }
    await this.companyRepository.update(id, { logoURL });

    return { ...company, logoURL };
  }

  private calculatePercentage(users: number, products: number): string {
    const percentage = Math.floor(products / users);
    return `${percentage}%`;
  }
}
