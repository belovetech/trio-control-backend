import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/company.entity';

@Module({})
export class DatabaseModule {
  public static getConnectionOptions(
    config: ConfigService,
  ): TypeOrmModuleOptions {
    const node_env = config.get('node');
    const database = config.get('database');

    let connectionOptions: TypeOrmModuleOptions = {
      type: 'postgres',
      synchronize: true,
    };

    if (node_env === 'development') {
      connectionOptions = {
        ...connectionOptions,
        ...database.development,
        migrationsRun: true,
        autoLoadEntities: true,
      };
    } else {
      connectionOptions = {
        ...connectionOptions,
        ...database.development,
      };
    }

    return connectionOptions;
  }

  public static getForRootAsync() {
    return [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          return DatabaseModule.getConnectionOptions(configService);
        },
        inject: [ConfigService],
      }),
      TypeOrmModule.forFeature([Company]),
    ];
  }
}
