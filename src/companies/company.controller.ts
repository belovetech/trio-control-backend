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
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';

import { CompanyService } from './company.service';
import { formatResponse } from 'src/common/utils/formatResponse';

import { CreateCompanyDto, UpdateCompanyDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('companies')
export class CompanyController {
  private logger: Logger = new Logger(CompanyService.name);
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async createCompany(@Body() data: CreateCompanyDto) {
    try {
      const company = await this.companyService.createCompany(data);

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
  async deleteCompany(@Param('id') id: string) {
    try {
      const company = await this.companyService.deleteCompany(id);

      return formatResponse(200, {
        message: 'Delete Company successfully',
        company,
      });
    } catch (error) {
      this.logger.error('Unable to delete company', error);

      return formatResponse(error.status ?? 400, {
        message: 'Unable to delete company',
        error: error.message,
      });
    }
  }

  // @Patch(':id/upload')
  // async upload(@Param('id') id: string, @Body() data: UploadCompanyLogoDto) {
  //   try {
  //     const company = await this.companyService.upload(id, data?.logoURL);

  //     return formatResponse(200, {
  //       message: "Upload company's logo successfully",
  //       company,
  //     });
  //   } catch (error) {
  //     this.logger.error("Unable to upload company's logo", error);

  //     return formatResponse(error.status ?? 400, {
  //       message: "Unable to upload company's logo",
  //       error: error.message,
  //     });
  //   }
  // }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      await this.companyService.upload(id, file);
      return formatResponse(200, {
        message: "Upload company's logo successfully",
        file,
      });
    } catch (error) {
      this.logger.error("Unable to upload company's logo", error);

      return formatResponse(error.status ?? 400, {
        message: "Unable to upload company's logo",
        error: error.message,
      });
    }
  }
}
