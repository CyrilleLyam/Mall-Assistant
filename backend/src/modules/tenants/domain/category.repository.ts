import { Category } from './category.entity.js';

export abstract class CategoryRepository {
  abstract findAll(): Promise<Category[]>;
  abstract findById(id: string): Promise<Category | null>;
}
