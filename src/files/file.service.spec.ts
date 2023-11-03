import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FilesService } from './files.service';
import { Company } from '../companies/entities';

describe('FilesService', () => {
  let filesService: FilesService;
  let companyRepository: Repository<Company>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: 'CompanyRepository',
          useValue: {
            findOneBy: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    filesService = module.get<FilesService>(FilesService);
    companyRepository = module.get('CompanyRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const fakeCompany = {
    id: uuidv4(),
    company_name: 'Test Company',
    total_products: 10,
    total_users: 5,
    percentage: '2%',
    isAdmin: false,
    company_logo: 'old_logo.jpg',
    user_id: 'G6yk7d7mEsaCZ1udrTORra6O2UG2',
    created_at: new Date(),
    updated_at: new Date(),
  };
  const fakeFile = {
    originalname: 'new_logo.jpg',
    filename: 'new_logo.jpg',
    path: '/path/to/new_logo.jpg',
    size: 100,
    fieldname: 'company_logo',
    mimetype: 'image/jpeg',
    encoding: '7bit',
  } as Express.Multer.File;

  const id = uuidv4();

  it('should upload a file to the company', async () => {
    jest.spyOn(companyRepository, 'findOneBy').mockResolvedValue(fakeCompany);
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'unlinkSync').mockReturnValue(undefined);

    await expect(filesService.upload(id, fakeFile)).resolves.toEqual({
      message: 'File uploaded successfully!',
      filePath: fakeFile.path,
      filename: fakeFile.filename,
    });

    expect(companyRepository.update).toHaveBeenCalledWith(id, {
      company_logo: fakeFile.filename,
    });
    expect(fs.unlinkSync).toHaveBeenCalledWith('old_logo.jpg');
  });

  it('should throw an error if company not found', async () => {
    jest
      .spyOn(companyRepository, 'findOneBy')
      .mockResolvedValue(undefined)
      .mockImplementation(async () => {
        throw new NotFoundException('Company not found');
      });

    try {
      await filesService.upload('wrongId', fakeFile);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('Company not found');
    }
  });

  it('should throw an error if file not found', async () => {
    jest
      .spyOn(companyRepository, 'findOneBy')
      .mockResolvedValue(fakeCompany)
      .mockImplementation(async () => {
        throw new NotFoundException('File not found');
      });

    try {
      await filesService.upload(id, undefined);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('File not found');
    }
  });
});
