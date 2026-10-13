import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { camelizeKeys } from './case-conversion.js';

@Injectable()
export class CamelCaseInputPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    return metadata.type === 'body' || metadata.type === 'query'
      ? camelizeKeys(value)
      : value;
  }
}
