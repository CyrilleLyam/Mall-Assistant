export type EventStatus = 'current' | 'upcoming' | 'past'

export interface MallEvent {
  id: string
  titleEn: string
  titleKm: string
  descriptionEn: string
  descriptionKm: string
  startDate: string
  endDate: string
  status: EventStatus
}

export type EventInput = Omit<MallEvent, 'id' | 'status'>
