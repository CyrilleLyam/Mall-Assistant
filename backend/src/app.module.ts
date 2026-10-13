import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { validateEnv } from './config/env.validation.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';
import { ChatModule } from './modules/chat/chat.module.js';
import { EventsModule } from './modules/events/events.module.js';
import { IdentityModule } from './modules/identity/identity.module.js';
import { TenantsModule } from './modules/tenants/tenants.module.js';
import { DatabaseModule } from './shared/infrastructure/database/database.module.js';
import { LoggingModule } from './shared/infrastructure/logging/logging.module.js';
import { SharedModule } from './shared/infrastructure/shared.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    LoggingModule,
    DatabaseModule,
    SharedModule,
    IdentityModule,
    TenantsModule,
    EventsModule,
    AnalyticsModule,
    ChatModule,
  ],
})
export class AppModule {}
