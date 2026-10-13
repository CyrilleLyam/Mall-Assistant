import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Clock } from '../../application/clock.js';

@Injectable()
export class SystemClock extends Clock {
  private readonly dateFormat: Intl.DateTimeFormat;

  constructor(config: ConfigService) {
    super();
    const timeZone = config.get<string>('APP_TIMEZONE') ?? 'Asia/Phnom_Penh';
    this.dateFormat = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  now(): Date {
    return new Date();
  }

  today(): string {
    return this.dateFormat.format(this.now());
  }
}
