import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadCompanyLogoDto {
  @ApiProperty({ example: '/src/public/images/my-photo.jpg' })
  @IsString()
  public company_logo: string;
}
