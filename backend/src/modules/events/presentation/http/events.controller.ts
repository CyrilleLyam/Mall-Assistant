import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Clock } from '../../../../shared/application/clock.js';
import { PagedResult } from '../../../../shared/presentation/http/api-response.js';
import { ApiEnvelopeResponse } from '../../../../shared/presentation/http/api-envelope-response.decorator.js';
import { AdminOnly } from '../../../identity/presentation/decorators/admin-only.decorator.js';
import { CreateEventUseCase } from '../../application/use-cases/create-event.use-case.js';
import { DeleteEventUseCase } from '../../application/use-cases/delete-event.use-case.js';
import { GetEventUseCase } from '../../application/use-cases/get-event.use-case.js';
import { ListEventsUseCase } from '../../application/use-cases/list-events.use-case.js';
import { UpdateEventUseCase } from '../../application/use-cases/update-event.use-case.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { EventResponse } from './dto/event.response.js';
import { ListEventsQuery } from './dto/list-events.query.js';
import { UpdateEventDto } from './dto/update-event.dto.js';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly listEvents: ListEventsUseCase,
    private readonly getEvent: GetEventUseCase,
    private readonly createEvent: CreateEventUseCase,
    private readonly updateEvent: UpdateEventUseCase,
    private readonly deleteEvent: DeleteEventUseCase,
    private readonly clock: Clock,
  ) {}

  @Get()
  @ApiEnvelopeResponse(EventResponse, { paginated: true })
  async list(@Query() query: ListEventsQuery): Promise<PagedResult<EventResponse>> {
    const page = await this.listEvents.execute({
      status: query.status,
      page: query.page,
      pageSize: query.pageSize,
    });
    const today = this.clock.today();
    return PagedResult.from(page, (event) => EventResponse.from(event, today));
  }

  @Get(':id')
  @ApiEnvelopeResponse(EventResponse)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EventResponse> {
    const event = await this.getEvent.execute({ id });
    return EventResponse.from(event, this.clock.today());
  }

  @Post()
  @AdminOnly()
  @ApiEnvelopeResponse(EventResponse, { status: 'created' })
  async create(@Body() body: CreateEventDto): Promise<EventResponse> {
    const event = await this.createEvent.execute(body);
    return EventResponse.from(event, this.clock.today());
  }

  @Patch(':id')
  @AdminOnly()
  @ApiEnvelopeResponse(EventResponse)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateEventDto,
  ): Promise<EventResponse> {
    const event = await this.updateEvent.execute({ id, changes: body });
    return EventResponse.from(event, this.clock.today());
  }

  @Delete(':id')
  @AdminOnly()
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteEvent.execute({ id });
  }
}
