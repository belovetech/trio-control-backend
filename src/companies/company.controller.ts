import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Patch,
  Logger,
  Query,
  Request,
} from '@nestjs/common';

import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dtos';
import { formatResponse } from '../common/utils/formatResponse';

import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('companies')
export class CompanyController {
  private logger: Logger = new Logger(CompanyService.name);
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async createCompany(@Request() req, @Body() data: CreateCompanyDto) {
    try {
      const { firebaseUser } = req.user;

      const company = await this.companyService.createCompany(
        firebaseUser.uid,
        data,
      );

      return formatResponse(201, {
        message: 'Create company  successfully',
        company,
      });
    } catch (error) {
      this.logger.error('Unable to create Company', error);

      return formatResponse(error.status ?? 400, {
        message: 'Unable to create Company',
        error: error.message,
      });
    }
  }

  @Get('me')
  async getMyCompany(@Request() req) {
    try {
      const { firebaseUser } = req.user;
      const company = await this.companyService.getMyCompany(firebaseUser.uid);

      return formatResponse(200, {
        message: 'Fetch Company successfully',
        company,
      });
    } catch (error) {
      this.logger.error('Unable to fetch Company', error);

      return formatResponse(error.status ?? 400, {
        message: 'Unable to fetch Company',
        error: error.message,
      });
    }
  }

  @Get(':id')
  async getCompanyById(@Param('id') id: string) {
    try {
      const company = await this.companyService.getCompanyById(id);

      return formatResponse(200, {
        message: 'Fetch Company successfully',
        company,
      });
    } catch (error) {
      this.logger.error('Unable to fetch Company', error);

      return formatResponse(error.status ?? 400, {
        message: 'Unable to fetch Company',
        error: error.message,
      });
    }
  }

  @Get()
  @Roles(Role.Admin)
  async getCompanies(@Query() query: Partial<CreateCompanyDto>) {
    try {
      const companies = await this.companyService.getCompanies(query);

      return formatResponse(200, {
        message: 'Fetch Companies successfully',
        results: companies.length,
        companies,
      });
    } catch (error) {
      this.logger.error('Unable to fetch Companies', error);

      return formatResponse(error.status ?? 400, {
        message: 'Unable to fetch Companies',
        error: error.message,
      });
    }
  }

  @Patch(':id')
  async updateCompany(@Param('id') id: string, @Body() data: UpdateCompanyDto) {
    try {
      const company = await this.companyService.updateCompany(id, data);

      return formatResponse(200, {
        message: 'Update Company successfully',
        company,
      });
    } catch (error) {
      this.logger.error('Unable to update Company', error);

      return formatResponse(error.status ?? 400, {
        message: 'Unable to update Company',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteCompany(@Param('id') id: string) {
    try {
      await this.companyService.deleteCompany(id);

      return formatResponse(200, {
        message: 'Delete Company successfully',
      });
    } catch (error) {
      this.logger.error('Unable to delete company', error);

      return formatResponse(error.status ?? 400, {
        message: 'Unable to delete company',
        error: error.message,
      });
    }
  }
}
