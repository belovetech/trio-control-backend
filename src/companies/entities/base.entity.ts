import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class BaseEntity {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}
