import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Options } from 'pino-http';
import { buildLoggerParams } from './logger.config.js';

const optionsFor = (pretty: boolean, level = 'info') =>
  buildLoggerParams({ level, pretty }).pinoHttp as Options;

const requestWith = (headers: Record<string, string>) => ({ headers }) as unknown as IncomingMessage;
const responseWith = (statusCode: number) =>
  ({ statusCode, setHeader: vi.fn() }) as unknown as ServerResponse;

describe('buildLoggerParams', () => {
  it('uses the configured level', () => {
    expect(optionsFor(false, 'debug').level).toBe('debug');
  });

  it('prints readable lines only when pretty output is requested', () => {
    expect(optionsFor(true).transport).toMatchObject({ target: 'pino-pretty' });
    expect(optionsFor(false).transport).toBeUndefined();
  });

  it('keeps a request id sent by the client and echoes it back', () => {
    const setHeader = vi.fn();
    const response = { statusCode: 200, setHeader } as unknown as ServerResponse;

    const id = optionsFor(false).genReqId!(requestWith({ 'x-request-id': 'abc-123' }), response);

    expect(id).toBe('abc-123');
    expect(setHeader).toHaveBeenCalledWith('x-request-id', 'abc-123');
  });

  it('generates a UUID v7 request id when the client sends none or an oversized one', () => {
    const uuidV7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    const genReqId = optionsFor(false).genReqId!;

    expect(genReqId(requestWith({}), responseWith(200))).toMatch(uuidV7);
    expect(genReqId(requestWith({ 'x-request-id': 'x'.repeat(200) }), responseWith(200))).toMatch(
      uuidV7,
    );
  });

  it('logs 5xx as error, 4xx as warn and the rest as info', () => {
    const customLogLevel = optionsFor(false).customLogLevel!;
    const request = requestWith({});

    expect(customLogLevel(request, responseWith(500), undefined as never)).toBe('error');
    expect(customLogLevel(request, responseWith(404), undefined as never)).toBe('warn');
    expect(customLogLevel(request, responseWith(200), undefined as never)).toBe('info');
    expect(customLogLevel(request, responseWith(200), new Error('boom'))).toBe('error');
  });

  it('adds the authenticated user id to the request log', () => {
    const customProps = optionsFor(false).customProps!;
    const anonymous = requestWith({});
    const signedIn = Object.assign(requestWith({}), { user: { id: 'user-1' } });

    expect(customProps(anonymous, responseWith(200))).toEqual({});
    expect(customProps(signedIn, responseWith(200))).toEqual({ userId: 'user-1' });
  });
});
