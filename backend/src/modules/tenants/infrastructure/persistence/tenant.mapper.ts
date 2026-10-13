import { Category } from '../../domain/category.entity.js';
import { OpeningHours } from '../../domain/opening-hours.js';
import { Tenant } from '../../domain/tenant.entity.js';
import { CategoryOrmEntity } from './category.orm-entity.js';
import { TenantOrmEntity } from './tenant.orm-entity.js';

export const TenantMapper = {
  toDomain(row: TenantOrmEntity): Tenant {
    return Tenant.restore(row.id, {
      nameEn: row.nameEn,
      nameKm: row.nameKm,
      descriptionEn: row.descriptionEn,
      descriptionKm: row.descriptionKm,
      floor: row.floor,
      openingHours: OpeningHours.create(row.openTime, row.closeTime),
      categoryId: row.categoryId,
    });
  },

  toPersistence(tenant: Tenant): TenantOrmEntity {
    const { openingHours, ...rest } = tenant.props;
    return Object.assign(new TenantOrmEntity(), {
      id: tenant.id,
      ...rest,
      openTime: openingHours.open,
      closeTime: openingHours.close,
    });
  },
};

export const CategoryMapper = {
  toDomain(row: CategoryOrmEntity): Category {
    return Category.restore(row.id, {
      nameEn: row.nameEn,
      nameKm: row.nameKm,
    });
  },
};
