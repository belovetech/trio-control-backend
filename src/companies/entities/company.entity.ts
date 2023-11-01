import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Exclude } from 'class-transformer';

@Entity()
@Index(['companyName'], { unique: true })
export class Company extends BaseEntity {
  @Column()
  public companyName: string;

  @Column()
  public numOfUsers: number;

  @Column()
  public numOfProducts: number;

  @Column()
  public percentage: string;

  @Exclude()
  @Column({ nullable: true, default: 'avatar.jpg' })
  public logoURL: string;
}
