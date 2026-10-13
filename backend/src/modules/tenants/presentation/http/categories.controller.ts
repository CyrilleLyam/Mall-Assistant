import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiEnvelopeResponse } from '../../../../shared/presentation/http/api-envelope-response.decorator.js';
import { ListCategoriesUseCase } from '../../application/use-cases/list-categories.use-case.js';
import { CategoryResponse } from './dto/tenant.response.js';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly listCategories: ListCategoriesUseCase) {}

  @Get()
  @ApiEnvelopeResponse(CategoryResponse, { isArray: true })
  async list(): Promise<CategoryResponse[]> {
    const categories = await this.listCategories.execute();
    return categories.map((category) => CategoryResponse.from(category));
  }
}
