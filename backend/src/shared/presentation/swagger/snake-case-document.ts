import type { OpenAPIObject } from '@nestjs/swagger';
import { toSnakeCase } from '../http/case-conversion.js';

interface SchemaLike {
  properties?: Record<string, unknown>;
  required?: string[];
}

interface OperationLike {
  parameters?: Array<{ name?: string; in?: string }>;
}

export function snakeCaseDocument(document: OpenAPIObject): OpenAPIObject {
  for (const schema of Object.values(document.components?.schemas ?? {})) {
    const target = schema as SchemaLike;
    if (target.properties) {
      target.properties = Object.fromEntries(
        Object.entries(target.properties).map(([name, definition]) => [
          toSnakeCase(name),
          definition,
        ]),
      );
    }
    if (target.required) {
      target.required = target.required.map(toSnakeCase);
    }
  }

  for (const pathItem of Object.values(document.paths)) {
    for (const operation of Object.values(pathItem) as OperationLike[]) {
      if (typeof operation !== 'object' || operation === null) {
        continue;
      }
      for (const parameter of operation.parameters ?? []) {
        if (parameter.in === 'query' && parameter.name) {
          parameter.name = toSnakeCase(parameter.name);
        }
      }
    }
  }

  return document;
}
