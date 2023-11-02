import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { uuid as uuidv4 } from 'uuid';

const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), '/uploads');

    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },

  // filename-uidv4.ext
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    const randomName = uuidv4();

    cb(null, `${name}-${randomName}.${extension}`);
  },
});

@Controller('files')
export class FilesController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadFile(@UploadedFile() file) {
    console.log(file);
    return { message: 'File uploaded successfully!', filename: file.filename };
  }
}
