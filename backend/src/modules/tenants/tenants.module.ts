import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsModule } from '../analytics/analytics.module.js';
import { SearchRecorder } from './application/ports/search-recorder.js';
import { CreateTenantUseCase } from './application/use-cases/create-tenant.use-case.js';
import { DeleteTenantUseCase } from './application/use-cases/delete-tenant.use-case.js';
import { GetTenantUseCase } from './application/use-cases/get-tenant.use-case.js';
import { ListCategoriesUseCase } from './application/use-cases/list-categories.use-case.js';
import { ListFloorsUseCase } from './application/use-cases/list-floors.use-case.js';
import { SearchTenantsUseCase } from './application/use-cases/search-tenants.use-case.js';
import { UpdateTenantUseCase } from './application/use-cases/update-tenant.use-case.js';
import { CategoryRepository } from './domain/category.repository.js';
import { TenantRepository } from './domain/tenant.repository.js';
import { AnalyticsSearchRecorder } from './infrastructure/adapters/analytics-search-recorder.js';
import { CategoryOrmEntity } from './infrastructure/persistence/category.orm-entity.js';
import { TenantOrmEntity } from './infrastructure/persistence/tenant.orm-entity.js';
import { TypeOrmCategoryRepository } from './infrastructure/persistence/typeorm-category.repository.js';
import { TypeOrmTenantRepository } from './infrastructure/persistence/typeorm-tenant.repository.js';
import { CategoriesController } from './presentation/http/categories.controller.js';
import { TenantsController } from './presentation/http/tenants.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([TenantOrmEntity, CategoryOrmEntity]),
    AnalyticsModule,
  ],
  controllers: [TenantsController, CategoriesController],
  providers: [
    SearchTenantsUseCase,
    GetTenantUseCase,
    CreateTenantUseCase,
    UpdateTenantUseCase,
    DeleteTenantUseCase,
    ListCategoriesUseCase,
    ListFloorsUseCase,
    { provide: TenantRepository, useClass: TypeOrmTenantRepository },
    { provide: CategoryRepository, useClass: TypeOrmCategoryRepository },
    { provide: SearchRecorder, useClass: AnalyticsSearchRecorder },
  ],
  exports: [TenantRepository, CategoryRepository],
})
export class TenantsModule {}
