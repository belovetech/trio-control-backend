import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @ApiProperty({ example: 'my company' })
  @IsString()
  public company_name: string;

  @IsOptional()
  @ApiProperty({ example: 20 })
  @IsNumber()
  public total_users: number;

  @IsOptional()
  @ApiProperty({ example: 5 })
  @IsNumber()
  public total_products: number;
}
