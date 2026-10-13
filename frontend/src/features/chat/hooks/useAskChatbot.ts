import { useMutation } from '@tanstack/react-query'
import { chatApi } from '../api/chat.api'

export function useAskChatbot() {
  return useMutation({ mutationFn: chatApi.ask })
}
