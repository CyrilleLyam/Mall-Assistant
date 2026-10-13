import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetSearchesPerDayUseCase } from './application/use-cases/get-searches-per-day.use-case.js';
import { GetTopSearchesUseCase } from './application/use-cases/get-top-searches.use-case.js';
import { RecordSearchUseCase } from './application/use-cases/record-search.use-case.js';
import { SearchLogRepository } from './domain/search-log.repository.js';
import { SearchLogOrmEntity } from './infrastructure/persistence/search-log.orm-entity.js';
import { TypeOrmSearchLogRepository } from './infrastructure/persistence/typeorm-search-log.repository.js';
import { AnalyticsController } from './presentation/http/analytics.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([SearchLogOrmEntity])],
  controllers: [AnalyticsController],
  providers: [
    RecordSearchUseCase,
    GetTopSearchesUseCase,
    GetSearchesPerDayUseCase,
    { provide: SearchLogRepository, useClass: TypeOrmSearchLogRepository },
  ],
  exports: [RecordSearchUseCase],
})
export class AnalyticsModule {}
