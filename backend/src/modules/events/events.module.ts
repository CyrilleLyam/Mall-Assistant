import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateEventUseCase } from './application/use-cases/create-event.use-case.js';
import { DeleteEventUseCase } from './application/use-cases/delete-event.use-case.js';
import { GetEventUseCase } from './application/use-cases/get-event.use-case.js';
import { ListEventsUseCase } from './application/use-cases/list-events.use-case.js';
import { UpdateEventUseCase } from './application/use-cases/update-event.use-case.js';
import { MallEventRepository } from './domain/mall-event.repository.js';
import { MallEventOrmEntity } from './infrastructure/persistence/mall-event.orm-entity.js';
import { TypeOrmMallEventRepository } from './infrastructure/persistence/typeorm-mall-event.repository.js';
import { EventsController } from './presentation/http/events.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([MallEventOrmEntity])],
  controllers: [EventsController],
  providers: [
    ListEventsUseCase,
    GetEventUseCase,
    CreateEventUseCase,
    UpdateEventUseCase,
    DeleteEventUseCase,
    { provide: MallEventRepository, useClass: TypeOrmMallEventRepository },
  ],
  exports: [MallEventRepository],
})
export class EventsModule {}
