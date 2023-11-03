import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { LoggerModule } from '../common/utils/logger';
import { DatabaseModule } from '../config/database/database.module';

@Module({
  imports: [DatabaseModule, LoggerModule],
  exports: [CompanyService],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
