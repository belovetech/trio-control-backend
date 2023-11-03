import { Module } from '@nestjs/common';
import { CompanyController } from './companies/company.controller';
import { CompanyService } from './companies/company.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/database/configuration';
import { DatabaseModule } from './config/database/database.module';
import { FirebaseAuthStrategy } from './auth/firebase/firebase-auth.strategy';
import { FirebaseAuthGuard } from './auth/firebase/guards/firebase-auth.guard';
import { RolesGuard } from './auth/firebase/guards/roles.guard';
import { FilesService } from './files/files.service';
import { FilesController } from './files/files.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
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
