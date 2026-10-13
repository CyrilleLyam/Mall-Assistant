import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ApiExceptionFilter } from '../filters/api-exception.filter.js';
import { ApiEnvelopeInterceptor } from './api-envelope.interceptor.js';
import { CamelCaseInputPipe } from './camel-case-input.pipe.js';
import { SnakeCaseResponseInterceptor } from './snake-case-response.interceptor.js';
import { validationExceptionFactory } from './validation-exception.factory.js';

export function configureHttp(app: INestApplication): void {
  app.useGlobalPipes(
    new CamelCaseInputPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.useGlobalInterceptors(new SnakeCaseResponseInterceptor(), new ApiEnvelopeInterceptor());
  app.useGlobalFilters(new ApiExceptionFilter());
}
