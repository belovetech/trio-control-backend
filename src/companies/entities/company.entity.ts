import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}

@Entity()
export class Company extends BaseEntity {
  @Column()
  companyName: string;

  @Column()
  numOfUsers: number;

  @Column()
  numOfProducts: number;

  @Column()
  percentage: number;

  @Column()
  logoURL: string;
}
