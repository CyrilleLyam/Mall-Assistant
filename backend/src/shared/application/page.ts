export interface PageRequest {
  page: number;
  pageSize: number;
}

export interface Page<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
}
