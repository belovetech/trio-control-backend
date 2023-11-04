import {
  Controller,
  FileTypeValidator,
  UploadedFile,
  UseInterceptors,
  Post,
  Param,
  ParseFilePipe,
} from '@nestjs/common';

import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesService } from './files.service';
import { Multer } from './files.interface';

import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/enums/role.enum';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    const randomName = uuid4();

    cb(null, `${name}-${randomName}${extension}`);
  },
});

const fileTypesRegex = /^image\/(png|webp|jpeg)$/;

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post(':id/upload')
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: fileTypesRegex })],
      }),
    )
    file: Multer,
  ) {
    return await this.filesService.upload(id, file);
  }
}
