import { Module } from '@nestjs/common';
import { CompanyController } from './companies/company.controller';
import { CompanyService } from './companies/company.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/database/configuration';
import { DatabaseModule } from './config/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),

    ...DatabaseModule.getForRootAsync(),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class AppModule {}
