import type { Page } from '../../../../shared/application/page.js';
import { NotFoundError } from '../../../../shared/domain/domain.error.js';
import { Category } from '../../domain/category.entity.js';
import { CategoryRepository } from '../../domain/category.repository.js';
import { OpeningHours } from '../../domain/opening-hours.js';
import { Tenant } from '../../domain/tenant.entity.js';
import { TenantRepository } from '../../domain/tenant.repository.js';
import { UpdateTenantUseCase } from './update-tenant.use-case.js';

class InMemoryTenants extends TenantRepository {
  constructor(private readonly stored: Map<string, Tenant>) {
    super();
  }

  async search(): Promise<Tenant[]> {
    return [...this.stored.values()];
  }

  async searchPage(): Promise<Page<Tenant>> {
    const items = [...this.stored.values()];
    return { items, totalItems: items.length, page: 1, pageSize: items.length };
  }

  async listFloors(): Promise<number[]> {
    return [...new Set([...this.stored.values()].map((tenant) => tenant.props.floor))];
  }

  async findById(id: string): Promise<Tenant | null> {
    return this.stored.get(id) ?? null;
  }

  async save(tenant: Tenant): Promise<void> {
    this.stored.set(tenant.id, tenant);
  }

  async delete(id: string): Promise<boolean> {
    return this.stored.delete(id);
  }
}

class InMemoryCategories extends CategoryRepository {
  constructor(private readonly known: Category[]) {
    super();
  }

  async findAll(): Promise<Category[]> {
    return this.known;
  }

  async findById(id: string): Promise<Category | null> {
    return this.known.find((category) => category.id === id) ?? null;
  }
}

describe('UpdateTenantUseCase', () => {
  const category = Category.create({ nameEn: 'Pharmacy', nameKm: 'ឱសថស្ថាន' });
  const tenant = Tenant.create({
    nameEn: 'City Pharmacy',
    nameKm: 'ស៊ីធី',
    descriptionEn: 'Medicine',
    descriptionKm: 'ថ្នាំ',
    floor: 2,
    openingHours: OpeningHours.create('09:00', '21:00'),
    categoryId: category.id,
  });
  const tenants = new InMemoryTenants(new Map([[tenant.id, tenant]]));
  const update = new UpdateTenantUseCase(
    tenants,
    new InMemoryCategories([category]),
  );

  it('ignores fields that are explicitly undefined', async () => {
    const updated = await update.execute({
      id: tenant.id,
      changes: { floor: 3, nameEn: undefined, descriptionEn: undefined },
    });

    expect(updated.props.floor).toBe(3);
    expect(updated.props.nameEn).toBe('City Pharmacy');
    expect(updated.props.descriptionEn).toBe('Medicine');
  });

  it('changes only the closing time and keeps the opening time', async () => {
    const updated = await update.execute({
      id: tenant.id,
      changes: { closeTime: '22:00' },
    });

    expect(updated.props.openingHours.open).toBe('09:00');
    expect(updated.props.openingHours.close).toBe('22:00');
  });

  it('rejects an unknown store', async () => {
    await expect(
      update.execute({ id: 'missing', changes: { floor: 1 } }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
