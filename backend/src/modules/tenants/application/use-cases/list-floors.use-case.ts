import { Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.js';
import { TenantRepository } from '../../domain/tenant.repository.js';

@Injectable()
export class ListFloorsUseCase implements UseCase<void, number[]> {
  constructor(private readonly tenants: TenantRepository) {}

  execute(): Promise<number[]> {
    return this.tenants.listFloors();
  }
}
