import { Entity } from '../../../shared/domain/entity.js';
import { newId } from '../../../shared/domain/id.js';
import { ValidationError } from '../../../shared/domain/domain.error.js';
import { OpeningHours } from './opening-hours.js';

export interface TenantProps {
  nameEn: string;
  nameKm: string;
  descriptionEn: string;
  descriptionKm: string;
  floor: number;
  openingHours: OpeningHours;
  categoryId: string;
}

export class Tenant extends Entity {
  private constructor(
    id: string,
    private current: TenantProps,
  ) {
    super(id);
  }

  static create(props: TenantProps): Tenant {
    Tenant.assertValid(props);
    return new Tenant(newId(), props);
  }

  static restore(id: string, props: TenantProps): Tenant {
    return new Tenant(id, props);
  }

  get props(): Readonly<TenantProps> {
    return this.current;
  }

  update(changes: Partial<TenantProps>): void {
    const next = { ...this.current, ...changes };
    Tenant.assertValid(next);
    this.current = next;
  }

  private static assertValid(props: TenantProps): void {
    if (!props.nameEn.trim() || !props.nameKm.trim()) {
      throw new ValidationError('Store names (English and Khmer) are required');
    }
    if (!Number.isInteger(props.floor)) {
      throw new ValidationError('Floor must be a whole number');
    }
  }
}
