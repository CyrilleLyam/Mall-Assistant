import { Category } from '../../../domain/category.entity.js';
import { Tenant } from '../../../domain/tenant.entity.js';

export class TenantResponse {
  id: string;
  nameEn: string;
  nameKm: string;
  descriptionEn: string;
  descriptionKm: string;
  floor: number;
  openTime: string;
  closeTime: string;
  categoryId: string;

  static from(tenant: Tenant): TenantResponse {
    const { openingHours, ...rest } = tenant.props;
    return {
      id: tenant.id,
      ...rest,
      openTime: openingHours.open,
      closeTime: openingHours.close,
    };
  }
}

export class CategoryResponse {
  id: string;
  nameEn: string;
  nameKm: string;

  static from(category: Category): CategoryResponse {
    return {
      id: category.id,
      nameEn: category.nameEn,
      nameKm: category.nameKm,
    };
  }
}
