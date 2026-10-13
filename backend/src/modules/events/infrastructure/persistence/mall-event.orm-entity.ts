import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('events')
export class MallEventOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 'title_en', type: 'varchar', length: 255 })
  titleEn: string;

  @Column({ name: 'title_km', type: 'varchar', length: 255 })
  titleKm: string;

  @Column({ name: 'description_en', type: 'text', default: '' })
  descriptionEn: string;

  @Column({ name: 'description_km', type: 'text', default: '' })
  descriptionKm: string;

  @Index()
  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Index()
  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
