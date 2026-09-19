export type Nullable<T> = T | null

export type ID = string

export interface Timestamps {
  createdAt: string
  updatedAt: string
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
