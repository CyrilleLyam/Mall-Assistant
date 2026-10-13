import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryOrmEntity } from './category.orm-entity.js';

@Entity('tenants')
export class TenantOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 'name_en', type: 'varchar', length: 255 })
  nameEn: string;

  @Column({ name: 'name_km', type: 'varchar', length: 255 })
  nameKm: string;

  @Column({ name: 'description_en', type: 'text', default: '' })
  descriptionEn: string;

  @Column({ name: 'description_km', type: 'text', default: '' })
  descriptionKm: string;

  @Index()
  @Column({ type: 'int' })
  floor: number;

  @Column({ name: 'open_time', type: 'varchar', length: 5 })
  openTime: string;

  @Column({ name: 'close_time', type: 'varchar', length: 5 })
  closeTime: string;

  @Index()
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => CategoryOrmEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Relation<CategoryOrmEntity>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
