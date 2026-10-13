import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiEnvelopeResponse } from '../../../../shared/presentation/http/api-envelope-response.decorator.js';
import { GetSearchesPerDayUseCase } from '../../application/use-cases/get-searches-per-day.use-case.js';
import { GetTopSearchesUseCase } from '../../application/use-cases/get-top-searches.use-case.js';
import { GetTopSearchTermsUseCase } from '../../application/use-cases/get-top-search-terms.use-case.js';
import { AdminOnly } from '../../../identity/presentation/decorators/admin-only.decorator.js';
import {
  DailySearchCountResponse,
  TopSearchResponse,
  TopTermResponse,
} from './dto/analytics.response.js';
import { SearchesPerDayQuery } from './dto/searches-per-day.query.js';
import { TopSearchesQuery } from './dto/top-searches.query.js';
import { TopTermsQuery } from './dto/top-terms.query.js';

@ApiTags('analytics')
@Controller('analytics')
@AdminOnly()
export class AnalyticsController {
  constructor(
    private readonly getTopSearches: GetTopSearchesUseCase,
    private readonly getTopSearchTerms: GetTopSearchTermsUseCase,
    private readonly getSearchesPerDay: GetSearchesPerDayUseCase,
  ) {}

  @Get('top-searches')
  @ApiEnvelopeResponse(TopSearchResponse, { isArray: true })
  topSearches(@Query() query: TopSearchesQuery): Promise<TopSearchResponse[]> {
    return this.getTopSearches.execute(query);
  }

  @Get('top-terms')
  @ApiEnvelopeResponse(TopTermResponse, { isArray: true })
  topTerms(@Query() query: TopTermsQuery): Promise<TopTermResponse[]> {
    return this.getTopSearchTerms.execute(query);
  }

  @Get('searches-per-day')
  @ApiEnvelopeResponse(DailySearchCountResponse, { isArray: true })
  searchesPerDay(
    @Query() query: SearchesPerDayQuery,
  ): Promise<DailySearchCountResponse[]> {
    return this.getSearchesPerDay.execute(query);
  }
}
