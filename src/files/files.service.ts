import * as fs from 'fs';
import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Company } from '../companies/entities';
import { FileResponse, Multer } from './files.interface';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async upload(id: string, file: Multer): Promise<FileResponse> {
    const company = await this.companyRepository.findOneBy({ id });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // delete old file if exists
    if (company.company_logo) {
      this.removeFile(company.company_logo);
    }

    await this.companyRepository.update(id, {
      company_logo: file.filename,
    });

    return {
      message: 'File uploaded successfully!',
      filePath: file.path,
      filename: file.filename,
    };
  }

  private removeFile(path: string) {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  }
}
