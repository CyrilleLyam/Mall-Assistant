import { MessageCircle, Send, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { apiErrorStatus } from '@/shared/api/http-client'
import { Button } from '@/shared/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import { cn } from '@/shared/lib/utils'
import { useAskChatbot } from '../hooks/useAskChatbot'

interface ChatMessage {
  id: number
  author: 'user' | 'assistant'
  text: string
}

export function ChatWidget() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const ask = useAskChatbot()

  const append = (author: ChatMessage['author'], text: string) =>
    setMessages((current) => [...current, { id: current.length, author, text }])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const question = draft.trim()
    if (!question || ask.isPending) return

    append('user', question)
    setDraft('')
    ask.mutate(question, {
      onSuccess: (result) => append('assistant', result.answer),
      onError: (error) =>
        append(
          'assistant',
          apiErrorStatus(error) === 429 ? t('chat.tooManyRequests') : t('chat.unavailable'),
        ),
    })
  }

  if (!isOpen) {
    return (
      <Button
        size="lg"
        aria-label={t('chat.open')}
        className="fixed right-4 bottom-4 z-50 h-11 rounded-full px-5 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle />
        {t('chat.title')}
      </Button>
    )
  }

  return (
    <aside className="fixed right-4 bottom-4 z-50 w-[calc(100vw-2rem)] max-w-sm">
      <Card className="h-[28rem] gap-0 py-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b py-3">
          <CardTitle>{t('chat.title')}</CardTitle>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t('chat.close')}
            onClick={() => setIsOpen(false)}
          >
            <X />
          </Button>
        </CardHeader>
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-2 p-4" aria-live="polite">
            <p className="text-sm text-muted-foreground">{t('chat.greeting')}</p>
            {messages.map((message) => (
              <p
                key={message.id}
                className={cn(
                  'rounded-xl px-3 py-2 text-sm',
                  message.author === 'user'
                    ? 'ml-8 bg-primary text-primary-foreground'
                    : 'mr-8 bg-muted',
                )}
              >
                {message.text}
              </p>
            ))}
          </div>
        </ScrollArea>
        <CardFooter className="border-t py-3">
          <form className="flex w-full gap-2" onSubmit={submit}>
            <Input
              value={draft}
              maxLength={300}
              placeholder={t('chat.placeholder')}
              aria-label={t('chat.placeholder')}
              onChange={(event) => setDraft(event.target.value)}
            />
            <Button type="submit" size="icon" aria-label={t('chat.send')} disabled={ask.isPending}>
              <Send />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </aside>
  )
}
