import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { buildLoggerParams } from './logger.config.js';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        buildLoggerParams({
          level: config.get<string>('LOG_LEVEL') ?? 'info',
          pretty: config.get<string>('NODE_ENV') !== 'production',
        }),
    }),
  ],
})
export class LoggingModule {}
