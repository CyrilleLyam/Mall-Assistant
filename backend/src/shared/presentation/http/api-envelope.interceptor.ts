import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { PagedResult } from './api-response.js';

@Injectable()
export class ApiEnvelopeInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((result: unknown) => {
        if (result === undefined) {
          return result;
        }
        if (result instanceof PagedResult) {
          return { error: false, data: result.items, pagination: result.pagination };
        }
        return { error: false, data: result, pagination: null };
      }),
    );
  }
}
