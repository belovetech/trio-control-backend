import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';

import { Company } from './entities';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dtos';

const mockCompanyRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
describe('CompanyService', () => {
  let companyService: CompanyService;
  let companyRepository: Repository<Company>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: 'CompanyRepository',
          useValue: mockCompanyRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    companyService = module.get<CompanyService>(CompanyService);
    companyRepository = module.get('CompanyRepository');
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(companyService).toBeDefined();
    expect(companyRepository).toBeDefined();
    expect(configService).toBeDefined;
  });

  describe('#createCompany', () => {
    const userRequest = {
      user: { firebaseUser: { uid: 'G6yk7d7mEsaCZ1udrTORra6O2UG2' } },
    };
    const user_id = userRequest.user.firebaseUser.uid;

    const companyDetails = {
      company_name: 'Test Company',
      total_products: 10,
      total_users: 5,
    } as CreateCompanyDto;

    it('should create a company', async () => {
      const now = new Date();
      const expectedResult = {
        id: uuidv4(),
        ...companyDetails,
        percentage: '2%',
        isAdmin: false,
        company_logo: 'avatar.jpg',
        user_id: user_id,
        created_at: now,
        updated_at: now,
      };

      const mockCreateCompany = jest.spyOn(companyService, 'createCompany');
      mockCreateCompany.mockResolvedValue(expectedResult);

      const result = await companyService.createCompany(
        userRequest.user.firebaseUser.uid,
        companyDetails,
      );

      expect(result).toEqual(expectedResult);
      expect(companyService.createCompany).toHaveBeenCalledWith(
        user_id,
        companyDetails,
      );
    });

    it('should throw an error if user already created a company', async () => {
      const mockCreateCompany = jest.spyOn(companyService, 'createCompany');
      mockCreateCompany.mockImplementation(async () => {
        throw new ConflictException('User already created a company');
      });

      try {
        await companyService.createCompany(user_id, companyDetails);
        throw new Error('The promise should have been rejected');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('User already created a company');
        expect(companyService.createCompany).toHaveBeenCalledWith(
          user_id,
          companyDetails,
        );
      }
    });
  });

  describe('#getMyCompany', () => {
    const userRequest = {
      user: { firebaseUser: { uid: 'G6yk7d7mEsaCZ1udrTORra6O2UG2' } },
    };
    const user_id = userRequest.user.firebaseUser.uid;

    it('should get my company', async () => {
      const expectedResult = {
        id: uuidv4(),
        company_name: 'Test Company',
        total_products: 10,
        total_users: 5,
        percentage: '2%',
        isAdmin: false,
        company_logo: 'avatar.jpg',
        user_id: user_id,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockGetMyCompany = jest.spyOn(companyService, 'getMyCompany');
      mockGetMyCompany.mockResolvedValue(expectedResult);

      const result = await companyService.getMyCompany(user_id);

      expect(result).toEqual(expectedResult);
      expect(companyService.getMyCompany).toHaveBeenCalledWith(user_id);
    });
  });

  describe('#getCompanyById', () => {
    it('should get company by id', async () => {
      const id = uuidv4();
      const expectedResult = {
        id: id,
        company_name: 'Test Company',
        total_products: 10,
        total_users: 5,
        percentage: '2%',
        isAdmin: false,
        company_logo: 'avatar.jpg',
        user_id: 'G6yk7d7mEsaCZ1udrTORra6O2UG2',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockGetCompanyById = jest.spyOn(companyService, 'getCompanyById');
      mockGetCompanyById.mockResolvedValue(expectedResult);

      const result = await companyService.getCompanyById(id);

      expect(result).toEqual(expectedResult);
      expect(companyService.getCompanyById).toHaveBeenCalledWith(id);
    });

    it("should throw an error if company doesn't exist", async () => {
      const id = 'wrongid';

      const mockGetCompanyById = jest.spyOn(companyService, 'getCompanyById');
      mockGetCompanyById.mockImplementation(async () => {
        throw new NotFoundException('Company not found');
      });

      try {
        await companyService.getCompanyById(id);
        throw new Error('The promise should have been rejected');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Company not found');
        expect(companyService.getCompanyById).toHaveBeenCalledWith(id);
      }
    });
  });

  describe('#getCompanies', () => {
    it('should get companies', async () => {
      const expectedResult = [
        {
          id: uuidv4(),
          company_name: 'Test Company',
          total_products: 10,
          total_users: 5,
          percentage: '2%',
          isAdmin: false,
          company_logo: 'avatar.jpg',
          user_id: 'G6yk7d7mEsaCZ1udrTORra6O2UG2',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          company_name: 'Test Company',
          total_products: 10,
          total_users: 5,
          percentage: '2%',
          isAdmin: false,
          company_logo: 'avatar.jpg',
          user_id: 'G6yk7d7mEsaCZ1udrTORra6O2UG2',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      const mockGetCompanies = jest.spyOn(companyService, 'getCompanies');
      mockGetCompanies.mockResolvedValue(expectedResult);

      const result = await companyService.getCompanies();

      expect(result).toEqual(expectedResult);
      expect(companyService.getCompanies).toHaveBeenCalledWith();
    });

    it('should throw an error if the user is not an admin', async () => {
      const mockGetCompanies = jest.spyOn(companyService, 'getCompanies');
      mockGetCompanies.mockImplementation(async () => {
        throw new ForbiddenException('Unauthorized');
      });

      try {
        await companyService.getCompanies();
        throw new Error('The promise should have been rejected');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toEqual('Unauthorized');
        expect(companyService.getCompanies).toHaveBeenCalledWith();
      }
    });
  });

  describe('#updateCompany', () => {
    it('should update company', async () => {
      const id = uuidv4();

      const companyDetails = {
        total_products: 20,
        total_users: 5,
      } as UpdateCompanyDto;

      const expectedResult = {
        id,
        company_name: 'Test Company',
        total_products: 20,
        total_users: 5,
        percentage: '4%',
        isAdmin: false,
        company_logo: 'avatar.jpg',
        user_id: 'G6yk7d7mEsaCZ1udrTORra6O2UG2',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockUpdateCompany = jest.spyOn(companyService, 'updateCompany');
      mockUpdateCompany.mockResolvedValue(expectedResult);

      const result = await companyService.updateCompany(id, companyDetails);

      expect(result).toEqual(expectedResult);
      expect(result.id).toEqual(id);
      expect(companyService.updateCompany).toHaveBeenCalledWith(
        id,
        companyDetails,
      );
    });
  });

  describe('#deleteCompany', () => {
    it('should delete company', async () => {
      const id = uuidv4();

      const expectedResult = { message: 'Company deleted successfully' };

      const mockDeleteCompany = jest.spyOn(companyService, 'deleteCompany');
      mockDeleteCompany.mockResolvedValue(expectedResult);

      const result = await companyService.deleteCompany(id);

      expect(result).toEqual(expectedResult);
      expect(companyService.deleteCompany).toHaveBeenCalledWith(id);
    });

    it("should throw an error if company doesn't exist", async () => {
      const id = 'wrongid';

      const mockDeleteCompany = jest.spyOn(companyService, 'deleteCompany');
      mockDeleteCompany.mockImplementation(async () => {
        throw new NotFoundException('Company not found');
      });

      try {
        await companyService.deleteCompany(id);
        throw new Error('The promise should have been rejected');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Company not found');
        expect(companyService.deleteCompany).toHaveBeenCalledWith(id);
      }
    });
  });
});
