import { IsIn, IsOptional } from 'class-validator';
import { PaginationQuery } from '../../../../../shared/presentation/http/pagination.query.js';

export class ListEventsQuery extends PaginationQuery {
  @IsOptional()
  @IsIn(['current', 'upcoming'])
  status?: 'current' | 'upcoming';
}
