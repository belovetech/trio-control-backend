import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class DatabaseConfigService {
  static getDatabaseConfig(configService: ConfigService): TypeOrmModuleOptions {
    const nodeEnv = configService.get('node_env');
    const databaseConfig = configService.get('databaseConfig');

    const commonOptions: TypeOrmModuleOptions = {
      type: 'postgres',
      entities: [Company],
    };

    let connectionOptions: TypeOrmModuleOptions = {
      ...commonOptions,
      ...databaseConfig.common,
    };
    if (nodeEnv === 'development') {
      connectionOptions = {
        ...connectionOptions,
        ...databaseConfig.development,
        synchronize: true,
        migrationsRun: true,
        autoLoadEntities: true,
      };
    } else {
      connectionOptions = {
        ...connectionOptions,
        ...databaseConfig.production,
        ssl: {
          rejectUnauthorized: false,
        },
      };
    }

    return connectionOptions;
  }
}
