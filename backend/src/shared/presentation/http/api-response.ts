import { ApiProperty } from '@nestjs/swagger';
import type { Page } from '../../application/page.js';

export class PaginationMeta {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;
}

export class ApiResponseEnvelope {
  @ApiProperty()
  error: boolean;

  @ApiProperty({ type: Object, nullable: true })
  data: unknown;

  @ApiProperty({ type: PaginationMeta, nullable: true })
  pagination: PaginationMeta | null;
}

export class PagedResult<T> {
  constructor(
    readonly items: T[],
    readonly pagination: PaginationMeta,
  ) {}

  static from<TSource, TItem>(
    page: Page<TSource>,
    mapItem: (item: TSource) => TItem,
  ): PagedResult<TItem> {
    return new PagedResult(page.items.map(mapItem), {
      page: page.page,
      pageSize: page.pageSize,
      totalItems: page.totalItems,
      totalPages: Math.ceil(page.totalItems / page.pageSize),
    });
  }
}
