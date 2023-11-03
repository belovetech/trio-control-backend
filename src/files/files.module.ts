import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { DatabaseModule } from '../config/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
