import { Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../../shared/domain/domain.error.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import { TenantRepository } from '../../domain/tenant.repository.js';

@Injectable()
export class DeleteTenantUseCase implements UseCase<{ id: string }, void> {
  constructor(private readonly tenants: TenantRepository) {}

  async execute({ id }: { id: string }): Promise<void> {
    if (!(await this.tenants.delete(id))) {
      throw new NotFoundError(`Store ${id} not found`);
    }
  }
}
