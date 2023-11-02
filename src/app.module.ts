import { Module } from '@nestjs/common';
import { CompanyController } from './companies/company.controller';
import { CompanyService } from './companies/company.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/database/configuration';
import { DatabaseModule } from './config/database/database.module';
import { FirebaseAuthStrategy } from './auth/firebase/firebase-auth.strategy';
import { FirebaseAuthGuard } from './auth/firebase/guards/firebase-auth.guard';
import { RolesGuard } from './auth/firebase/guards/roles.guard';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),

    FilesModule,

    ...DatabaseModule.getForRootAsync(),
  ],
  controllers: [CompanyController],
  providers: [
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
