export interface StoreFact {
  nameEn: string;
  nameKm: string;
  categoryEn: string;
  categoryKm: string;
  descriptionEn: string;
  descriptionKm: string;
  floor: number;
  opensAt: string;
  closesAt: string;
}

export interface EventFact {
  titleEn: string;
  titleKm: string;
  descriptionEn: string;
  descriptionKm: string;
  startDate: string;
  endDate: string;
  status: 'current' | 'upcoming';
}

export class MallKnowledge {
  constructor(
    readonly stores: StoreFact[],
    readonly events: EventFact[],
  ) {}

  get isEmpty(): boolean {
    return this.stores.length === 0 && this.events.length === 0;
  }
}
