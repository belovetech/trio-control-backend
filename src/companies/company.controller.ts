import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async createCompany(@Body() companyData: Partial<Company>): Promise<Company> {
    return this.companyService.createCompany(companyData);
  }

  @Get(':id')
  async getCompanyById(@Param('id') id: string): Promise<Company> {
    return this.companyService.getCompanyById(id);
  }
}
