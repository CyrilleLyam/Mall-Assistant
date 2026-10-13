import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Params } from 'nestjs-pino';
import { newId } from '../../domain/id.js';

export interface LoggingOptions {
  level: string;
  pretty: boolean;
}

const REQUEST_ID_HEADER = 'x-request-id';
const MAX_REQUEST_ID_LENGTH = 128;

const resolveRequestId = (request: IncomingMessage, response: ServerResponse): string => {
  const incoming = request.headers[REQUEST_ID_HEADER];
  const requestId =
    typeof incoming === 'string' && incoming.length > 0 && incoming.length <= MAX_REQUEST_ID_LENGTH
      ? incoming
      : newId();
  response.setHeader(REQUEST_ID_HEADER, requestId);
  return requestId;
};

const resolveLogLevel = (
  _request: IncomingMessage,
  response: ServerResponse,
  error?: Error,
): 'info' | 'warn' | 'error' => {
  if (error || response.statusCode >= 500) {
    return 'error';
  }
  return response.statusCode >= 400 ? 'warn' : 'info';
};

export function buildLoggerParams({ level, pretty }: LoggingOptions): Params {
  return {
    pinoHttp: {
      level,
      genReqId: resolveRequestId,
      customLogLevel: resolveLogLevel,
      customProps: (request) => {
        const user = (request as { user?: { id?: string } }).user;
        return user?.id ? { userId: user.id } : {};
      },
      redact: {
        paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'],
        censor: '[redacted]',
      },
      serializers: {
        req: (request: { id: string; method: string; url: string }) => ({
          id: request.id,
          method: request.method,
          url: request.url,
        }),
        res: (response: { statusCode: number }) => ({ statusCode: response.statusCode }),
      },
      autoLogging: { ignore: (request) => request.url?.startsWith('/docs') ?? false },
      transport: pretty
        ? {
            target: 'pino-pretty',
            options: { singleLine: true, translateTime: 'SYS:HH:MM:ss', ignore: 'pid,hostname' },
          }
        : undefined,
    },
  };
}
