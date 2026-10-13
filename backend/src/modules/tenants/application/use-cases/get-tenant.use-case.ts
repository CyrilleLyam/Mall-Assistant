import { Injectable, Logger } from '@nestjs/common';
import { NotFoundError } from '../../../../shared/domain/domain.error.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import { Tenant } from '../../domain/tenant.entity.js';
import { TenantRepository } from '../../domain/tenant.repository.js';
import { SearchRecorder } from '../ports/search-recorder.js';

export interface GetTenantInput {
  id: string;
  searchQuery?: string;
}

@Injectable()
export class GetTenantUseCase implements UseCase<GetTenantInput, Tenant> {
  private readonly logger = new Logger(GetTenantUseCase.name);

  constructor(
    private readonly tenants: TenantRepository,
    private readonly searchRecorder: SearchRecorder,
  ) {}

  async execute({ id, searchQuery }: GetTenantInput): Promise<Tenant> {
    const tenant = await this.tenants.findById(id);
    if (!tenant) {
      throw new NotFoundError(`Store ${id} not found`);
    }

    if (searchQuery?.trim()) {
      await this.searchRecorder
        .record(tenant.id, searchQuery)
        .catch((error: unknown) =>
          this.logger.warn(`Could not record search: ${String(error)}`),
        );
    }
    return tenant;
  }
}
