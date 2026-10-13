import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('categories')
export class CategoryOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 'name_en', type: 'varchar', length: 100, unique: true })
  nameEn: string;

  @Column({ name: 'name_km', type: 'varchar', length: 100 })
  nameKm: string;
}
