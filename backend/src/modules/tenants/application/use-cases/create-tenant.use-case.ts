import { Injectable } from '@nestjs/common';
import { ValidationError } from '../../../../shared/domain/domain.error.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import { CategoryRepository } from '../../domain/category.repository.js';
import { OpeningHours } from '../../domain/opening-hours.js';
import { Tenant } from '../../domain/tenant.entity.js';
import { TenantRepository } from '../../domain/tenant.repository.js';
import { TenantDetails } from '../tenant-details.js';

@Injectable()
export class CreateTenantUseCase implements UseCase<TenantDetails, Tenant> {
  constructor(
    private readonly tenants: TenantRepository,
    private readonly categories: CategoryRepository,
  ) {}

  async execute(input: TenantDetails): Promise<Tenant> {
    if (!(await this.categories.findById(input.categoryId))) {
      throw new ValidationError(`Category ${input.categoryId} does not exist`);
    }

    const tenant = Tenant.create({
      nameEn: input.nameEn,
      nameKm: input.nameKm,
      descriptionEn: input.descriptionEn ?? '',
      descriptionKm: input.descriptionKm ?? '',
      floor: input.floor,
      openingHours: OpeningHours.create(input.openTime, input.closeTime),
      categoryId: input.categoryId,
    });
    await this.tenants.save(tenant);
    return tenant;
  }
}
