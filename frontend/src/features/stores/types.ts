export interface Store {
  id: string
  nameEn: string
  nameKm: string
  descriptionEn: string
  descriptionKm: string
  floor: number
  openTime: string
  closeTime: string
  categoryId: string
}

export type StoreInput = Omit<Store, 'id'>

export interface Category {
  id: string
  nameEn: string
  nameKm: string
}

export interface StoreSearchParams {
  search?: string
  categoryId?: string
  floor?: number
}
