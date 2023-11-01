import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'my company' })
  @IsString()
  companyName: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  numOfUsers: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  numOfProducts: number;
}
