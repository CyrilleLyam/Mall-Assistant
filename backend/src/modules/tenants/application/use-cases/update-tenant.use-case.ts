import { Injectable } from '@nestjs/common';
import {
  NotFoundError,
  ValidationError,
} from '../../../../shared/domain/domain.error.js';
import { omitUndefined } from '../../../../shared/application/omit-undefined.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import { CategoryRepository } from '../../domain/category.repository.js';
import { OpeningHours } from '../../domain/opening-hours.js';
import { Tenant } from '../../domain/tenant.entity.js';
import { TenantRepository } from '../../domain/tenant.repository.js';
import { TenantDetails } from '../tenant-details.js';

export interface UpdateTenantInput {
  id: string;
  changes: Partial<TenantDetails>;
}

@Injectable()
export class UpdateTenantUseCase implements UseCase<UpdateTenantInput, Tenant> {
  constructor(
    private readonly tenants: TenantRepository,
    private readonly categories: CategoryRepository,
  ) {}

  async execute({ id, changes }: UpdateTenantInput): Promise<Tenant> {
    const tenant = await this.tenants.findById(id);
    if (!tenant) {
      throw new NotFoundError(`Store ${id} not found`);
    }

    const { openTime, closeTime, ...rest } = omitUndefined(changes);

    if (
      rest.categoryId !== undefined &&
      !(await this.categories.findById(rest.categoryId))
    ) {
      throw new ValidationError(`Category ${rest.categoryId} does not exist`);
    }

    const hoursChanged = openTime !== undefined || closeTime !== undefined;
    const current = tenant.props.openingHours;

    tenant.update({
      ...rest,
      ...(hoursChanged && {
        openingHours: OpeningHours.create(
          openTime ?? current.open,
          closeTime ?? current.close,
        ),
      }),
    });
    await this.tenants.save(tenant);
    return tenant;
  }
}
