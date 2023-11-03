import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'my company' })
  @IsString()
  company_name: string;

  @ApiProperty({ example: '20' })
  @IsString()
  total_users: number;

  @ApiProperty({ example: '5' })
  @IsString()
  total_products: number;

  @IsOptional()
  user_id: string;
}
