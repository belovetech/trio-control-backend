import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @ApiProperty({ example: 'my company' })
  @IsString()
  public companyName: string;

  @IsOptional()
  @ApiProperty({ example: 20 })
  @IsNumber()
  public numOfUsers: number;

  @IsOptional()
  @ApiProperty({ example: 5 })
  @IsNumber()
  public numOfProducts: number;

  @IsOptional()
  @ApiProperty({ example: '/src/public/images/my-photo.jpg' })
  @IsString()
  public logoURL: string;
}
