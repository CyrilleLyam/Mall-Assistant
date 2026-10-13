import { Entity } from '../../../shared/domain/entity.js';
import { newId } from '../../../shared/domain/id.js';
import { ValidationError } from '../../../shared/domain/domain.error.js';

export interface CategoryProps {
  nameEn: string;
  nameKm: string;
}

export class Category extends Entity {
  private constructor(
    id: string,
    readonly nameEn: string,
    readonly nameKm: string,
  ) {
    super(id);
  }

  static create(props: CategoryProps): Category {
    Category.assertValid(props);
    return new Category(newId(), props.nameEn, props.nameKm);
  }

  static restore(id: string, props: CategoryProps): Category {
    return new Category(id, props.nameEn, props.nameKm);
  }

  private static assertValid(props: CategoryProps): void {
    if (!props.nameEn.trim() || !props.nameKm.trim()) {
      throw new ValidationError('Category names must not be empty');
    }
  }
}
