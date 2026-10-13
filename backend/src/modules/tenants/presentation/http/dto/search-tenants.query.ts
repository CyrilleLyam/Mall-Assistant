import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PaginationQuery } from '../../../../../shared/presentation/http/pagination.query.js';

export class SearchTenantsQuery extends PaginationQuery {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  floor?: number;
}
