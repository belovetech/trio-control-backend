import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './database-config.service';
import { Company } from 'src/companies/entities/company.entity';

@Module({
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseModule {
  static init() {
    return [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          return DatabaseConfigService.getDatabaseConfig(configService);
        },
        inject: [ConfigService],
      }),
      TypeOrmModule.forFeature([Company]),
    ];
  }
}
