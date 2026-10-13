import { httpClient } from '@/shared/api/http-client'
import { unwrap, type ApiResponse } from '@/shared/api/api-response'

export interface ChatAnswer {
  answer: string
  grounded: boolean
}

export const chatApi = {
  ask(question: string): Promise<ChatAnswer> {
    return unwrap(httpClient.post<ApiResponse<ChatAnswer>>('/chat', { question }))
  },
}
