import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';
import { toSnakeCase } from './case-conversion.js';

const collectMessages = (errors: ValidationError[]): string[] =>
  errors.flatMap((error) => [
    ...Object.values(error.constraints ?? {}).map((message) =>
      message.replace(error.property, toSnakeCase(error.property)),
    ),
    ...collectMessages(error.children ?? []),
  ]);

export const validationExceptionFactory = (
  errors: ValidationError[],
): BadRequestException => new BadRequestException(collectMessages(errors));
