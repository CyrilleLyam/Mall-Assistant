import { Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.js';
import { Category } from '../../domain/category.entity.js';
import { CategoryRepository } from '../../domain/category.repository.js';

@Injectable()
export class ListCategoriesUseCase implements UseCase<void, Category[]> {
  constructor(private readonly categories: CategoryRepository) {}

  execute(): Promise<Category[]> {
    return this.categories.findAll();
  }
}
