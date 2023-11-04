import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @ApiProperty({ example: 'my company' })
  @IsString()
  public company_name: string;

  @IsOptional()
  @ApiProperty({ example: 20 })
  @IsString()
  public total_users: number;

  @IsOptional()
  @ApiProperty({ example: 5 })
  @IsString()
  public total_products: number;
}
