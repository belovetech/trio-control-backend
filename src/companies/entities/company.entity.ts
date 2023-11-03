import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Exclude } from 'class-transformer';

@Entity('companies')
@Index(['user_id'], { unique: true })
export abstract class Company extends BaseEntity {
  @Column()
  public company_name: string;

  @Column()
  public total_users: number;

  @Column()
  public total_products: number;

  @Column()
  public percentage: string;

  @Column()
  public user_id: string;

  @Exclude()
  @Column({ nullable: true, default: 'avatar.jpg' })
  public company_logo: string;

  @Column({ default: false })
  isAdmin: boolean;
}
