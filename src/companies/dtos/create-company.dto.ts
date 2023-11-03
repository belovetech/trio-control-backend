import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'my company' })
  @IsString()
  company_name: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  total_users: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  total_products: number;

  @IsOptional()
  user_id: string;
}
