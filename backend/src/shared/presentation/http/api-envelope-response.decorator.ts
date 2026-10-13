import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiResponseEnvelope, PaginationMeta } from './api-response.js';

type EnvelopeModel = Type<unknown> | 'integer' | 'string';

interface EnvelopeOptions {
  status?: 'ok' | 'created';
  isArray?: boolean;
  paginated?: boolean;
}

export const ApiEnvelopeResponse = (
  model: EnvelopeModel,
  { status = 'ok', isArray = false, paginated = false }: EnvelopeOptions = {},
) => {
  const respond = status === 'created' ? ApiCreatedResponse : ApiOkResponse;
  const item = typeof model === 'string' ? { type: model } : { $ref: getSchemaPath(model) };

  return applyDecorators(
    ApiExtraModels(ApiResponseEnvelope, PaginationMeta, ...(typeof model === 'string' ? [] : [model])),
    respond({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseEnvelope) },
          {
            type: 'object',
            properties: {
              data: isArray || paginated ? { type: 'array', items: item } : item,
              ...(paginated && { pagination: { $ref: getSchemaPath(PaginationMeta) } }),
            },
          },
        ],
      },
    }),
  );
};
