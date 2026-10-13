import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { ApiEnvelopeInterceptor } from './api-envelope.interceptor.js';
import { PagedResult } from './api-response.js';

const wrap = (result: unknown) =>
  lastValueFrom(
    new ApiEnvelopeInterceptor().intercept(
      {} as ExecutionContext,
      { handle: () => of(result) } as CallHandler,
    ),
  );

describe('ApiEnvelopeInterceptor', () => {
  it('wraps a single result with no pagination', async () => {
    await expect(wrap({ id: '1' })).resolves.toEqual({
      error: false,
      data: { id: '1' },
      pagination: null,
    });
  });

  it('wraps arrays and primitives as data', async () => {
    await expect(wrap([1, 2])).resolves.toEqual({ error: false, data: [1, 2], pagination: null });
    await expect(wrap(0)).resolves.toEqual({ error: false, data: 0, pagination: null });
  });

  it('puts paged items in data and the page details in pagination', async () => {
    const paged = PagedResult.from(
      { items: ['a', 'b'], totalItems: 5, page: 2, pageSize: 2 },
      (item) => item.toUpperCase(),
    );

    await expect(wrap(paged)).resolves.toEqual({
      error: false,
      data: ['A', 'B'],
      pagination: { page: 2, pageSize: 2, totalItems: 5, totalPages: 3 },
    });
  });

  it('leaves an empty response empty', async () => {
    await expect(wrap(undefined)).resolves.toBeUndefined();
  });
});
