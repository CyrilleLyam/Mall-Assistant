import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetSearchesPerDayUseCase } from './application/use-cases/get-searches-per-day.use-case.js';
import { GetTopSearchesUseCase } from './application/use-cases/get-top-searches.use-case.js';
import { GetTopSearchTermsUseCase } from './application/use-cases/get-top-search-terms.use-case.js';
import { RecordSearchQueryUseCase } from './application/use-cases/record-search-query.use-case.js';
import { RecordSearchUseCase } from './application/use-cases/record-search.use-case.js';
import { SearchLogRepository } from './domain/search-log.repository.js';
import { SearchQueryRepository } from './domain/search-query.repository.js';
import { SearchLogOrmEntity } from './infrastructure/persistence/search-log.orm-entity.js';
import { SearchQueryOrmEntity } from './infrastructure/persistence/search-query.orm-entity.js';
import { TypeOrmSearchLogRepository } from './infrastructure/persistence/typeorm-search-log.repository.js';
import { TypeOrmSearchQueryRepository } from './infrastructure/persistence/typeorm-search-query.repository.js';
import { AnalyticsController } from './presentation/http/analytics.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([SearchLogOrmEntity, SearchQueryOrmEntity])],
  controllers: [AnalyticsController],
  providers: [
    RecordSearchUseCase,
    RecordSearchQueryUseCase,
    GetTopSearchesUseCase,
    GetTopSearchTermsUseCase,
    GetSearchesPerDayUseCase,
    { provide: SearchLogRepository, useClass: TypeOrmSearchLogRepository },
    { provide: SearchQueryRepository, useClass: TypeOrmSearchQueryRepository },
  ],
  exports: [RecordSearchUseCase, RecordSearchQueryUseCase],
})
export class AnalyticsModule {}
