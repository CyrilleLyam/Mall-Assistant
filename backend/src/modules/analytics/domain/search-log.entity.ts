import { Entity } from '../../../shared/domain/entity.js';
import { newId } from '../../../shared/domain/id.js';
import { ValidationError } from '../../../shared/domain/domain.error.js';

const MAX_QUERY_LENGTH = 100;

export interface SearchLogProps {
  tenantId: string;
  query: string;
  createdAt: Date;
}

export class SearchLog extends Entity {
  private constructor(
    id: string,
    readonly tenantId: string,
    readonly query: string,
    readonly createdAt: Date,
  ) {
    super(id);
  }

  static create(props: SearchLogProps): SearchLog {
    const query = props.query.trim().toLowerCase().slice(0, MAX_QUERY_LENGTH);
    if (query.length === 0) {
      throw new ValidationError('Search query must not be empty');
    }
    return new SearchLog(newId(), props.tenantId, query, props.createdAt);
  }

  static restore(id: string, props: SearchLogProps): SearchLog {
    return new SearchLog(id, props.tenantId, props.query, props.createdAt);
  }
}
