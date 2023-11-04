import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import databaseConfiguration from './config/database/configuration';
import firebaseConfigurations from './config/firebase/configuration';

import { DatabaseModule } from './config/database/database.module';
import { FirebaseAuthStrategy } from './auth/firebase/firebase-auth.strategy';
import { FirebaseAuthGuard } from './auth/firebase/guards/firebase-auth.guard';
import { RolesGuard } from './auth/firebase/guards/roles.guard';
import { FilesService } from './files/files.service';
import { FilesController } from './files/files.controller';
import { CompanyController } from './companies/company.controller';
import { CompanyService } from './companies/company.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfiguration, firebaseConfigurations],
      cache: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      exclude: ['/api/(.*)'],
    }),

    ...DatabaseModule.init(),
  ],
  controllers: [CompanyController, FilesController],
  providers: [
    FilesService,
    CompanyService,
    FirebaseAuthStrategy,

    // use firebase guard globally
    {
      provide: 'APP_GUARD',
      useClass: FirebaseAuthGuard,
    },
    // RBAC
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
