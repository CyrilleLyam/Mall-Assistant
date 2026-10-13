import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { DomainError } from '../../domain/domain.error.js';
import { snakeizeKeys } from '../http/case-conversion.js';

const STATUS_BY_CODE: Record<string, HttpStatus> = {
  VALIDATION_ERROR: HttpStatus.BAD_REQUEST,
  UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
  NOT_FOUND: HttpStatus.NOT_FOUND,
  CONFLICT: HttpStatus.CONFLICT,
  SERVICE_UNAVAILABLE: HttpStatus.SERVICE_UNAVAILABLE,
};

interface ErrorDetails {
  statusCode: number;
  code: string;
  message: string | string[];
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const details = this.describe(exception);
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(details.statusCode)
      .json(snakeizeKeys({ error: true, ...details, data: null, pagination: null }));
  }

  private describe(exception: unknown): ErrorDetails {
    if (exception instanceof DomainError) {
      return {
        statusCode: STATUS_BY_CODE[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR,
        code: exception.code,
        message: exception.message,
      };
    }

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      const detail =
        typeof payload === 'object'
          ? (payload as { message?: string | string[] })
          : { message: payload };
      const statusCode = exception.getStatus();
      return {
        statusCode,
        code: HttpStatus[statusCode] ?? 'ERROR',
        message: detail.message ?? exception.message,
      };
    }

    this.logger.error(exception);
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    };
  }
}
