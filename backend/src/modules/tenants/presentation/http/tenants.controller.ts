import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PagedResult } from '../../../../shared/presentation/http/api-response.js';
import { ApiEnvelopeResponse } from '../../../../shared/presentation/http/api-envelope-response.decorator.js';
import { AdminOnly } from '../../../identity/presentation/decorators/admin-only.decorator.js';
import { CreateTenantUseCase } from '../../application/use-cases/create-tenant.use-case.js';
import { DeleteTenantUseCase } from '../../application/use-cases/delete-tenant.use-case.js';
import { GetTenantUseCase } from '../../application/use-cases/get-tenant.use-case.js';
import { ListFloorsUseCase } from '../../application/use-cases/list-floors.use-case.js';
import { SearchTenantsUseCase } from '../../application/use-cases/search-tenants.use-case.js';
import { UpdateTenantUseCase } from '../../application/use-cases/update-tenant.use-case.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { GetTenantQuery } from './dto/get-tenant.query.js';
import { SearchTenantsQuery } from './dto/search-tenants.query.js';
import { TenantResponse } from './dto/tenant.response.js';
import { UpdateTenantDto } from './dto/update-tenant.dto.js';

@ApiTags('tenants')
@Controller('tenants')
export class TenantsController {
  constructor(
    private readonly searchTenants: SearchTenantsUseCase,
    private readonly listFloors: ListFloorsUseCase,
    private readonly getTenant: GetTenantUseCase,
    private readonly createTenant: CreateTenantUseCase,
    private readonly updateTenant: UpdateTenantUseCase,
    private readonly deleteTenant: DeleteTenantUseCase,
  ) {}

  @Get()
  @ApiEnvelopeResponse(TenantResponse, { paginated: true })
  async search(@Query() query: SearchTenantsQuery): Promise<PagedResult<TenantResponse>> {
    const page = await this.searchTenants.execute({
      search: query.search,
      categoryId: query.categoryId,
      floor: query.floor,
      page: query.page,
      pageSize: query.pageSize,
    });
    return PagedResult.from(page, (tenant) => TenantResponse.from(tenant));
  }

  @Get('floors')
  @ApiEnvelopeResponse('integer', { isArray: true })
  floors(): Promise<number[]> {
    return this.listFloors.execute();
  }

  @Get(':id')
  @ApiEnvelopeResponse(TenantResponse)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetTenantQuery,
  ): Promise<TenantResponse> {
    const tenant = await this.getTenant.execute({ id, searchQuery: query.q });
    return TenantResponse.from(tenant);
  }

  @Post()
  @AdminOnly()
  @ApiEnvelopeResponse(TenantResponse, { status: 'created' })
  async create(@Body() body: CreateTenantDto): Promise<TenantResponse> {
    return TenantResponse.from(await this.createTenant.execute(body));
  }

  @Patch(':id')
  @AdminOnly()
  @ApiEnvelopeResponse(TenantResponse)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateTenantDto,
  ): Promise<TenantResponse> {
    const tenant = await this.updateTenant.execute({ id, changes: body });
    return TenantResponse.from(tenant);
  }

  @Delete(':id')
  @AdminOnly()
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteTenant.execute({ id });
  }
}
