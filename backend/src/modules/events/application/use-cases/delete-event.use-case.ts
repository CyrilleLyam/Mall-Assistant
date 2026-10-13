import { Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../../shared/domain/domain.error.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import { MallEventRepository } from '../../domain/mall-event.repository.js';

@Injectable()
export class DeleteEventUseCase implements UseCase<{ id: string }, void> {
  constructor(private readonly events: MallEventRepository) {}

  async execute({ id }: { id: string }): Promise<void> {
    if (!(await this.events.delete(id))) {
      throw new NotFoundError(`Event ${id} not found`);
    }
  }
}
