import type { OpenAPIObject } from '@nestjs/swagger';
import { snakeCaseDocument } from './snake-case-document.js';

describe('snakeCaseDocument', () => {
  it('renames schema properties, required lists and query parameters', () => {
    const document = {
      openapi: '3.0.0',
      info: { title: 't', version: '1' },
      components: {
        schemas: {
          CreateTenantDto: {
            type: 'object',
            properties: { nameEn: { type: 'string' }, floor: { type: 'number' } },
            required: ['nameEn'],
          },
        },
      },
      paths: {
        '/tenants': {
          get: {
            parameters: [
              { name: 'categoryId', in: 'query' },
              { name: 'id', in: 'path' },
            ],
          },
        },
      },
    } as unknown as OpenAPIObject;

    const result = snakeCaseDocument(document) as any;

    expect(Object.keys(result.components.schemas.CreateTenantDto.properties)).toEqual([
      'name_en',
      'floor',
    ]);
    expect(result.components.schemas.CreateTenantDto.required).toEqual(['name_en']);
    expect(result.paths['/tenants'].get.parameters.map((p: any) => p.name)).toEqual([
      'category_id',
      'id',
    ]);
  });
});
