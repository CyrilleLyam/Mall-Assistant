import { MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { apiErrorStatus } from '@/shared/api/http-client'
import { Button } from '@/shared/components/ui/button'
import { Card, CardFooter, CardHeader } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { ScrollArea } from '@/shared/components/ui/scroll-area'
import { cn } from '@/shared/lib/utils'
import { useAskChatbot } from '../hooks/useAskChatbot'

interface ChatMessage {
  id: number
  author: 'user' | 'assistant'
  text: string
}

function AssistantAvatar() {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
      <Sparkles className="size-4" />
    </span>
  )
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
        className="fixed right-4 bottom-4 z-50 h-12 rounded-full px-5 shadow-lg shadow-primary/30"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle />
        {t('chat.title')}
      </Button>
    )
  }

  return (
    <aside className="fixed right-4 bottom-4 z-50 w-[calc(100vw-2rem)] max-w-sm">
      <Card className="h-[30rem] gap-0 overflow-hidden py-0 shadow-2xl">
        <CardHeader className="flex flex-row items-center gap-3 bg-primary py-3 text-primary-foreground">
          <span className="grid size-9 place-items-center rounded-full bg-primary-foreground/15">
            <Sparkles className="size-5" />
          </span>
          <div className="flex-1">
            <p className="leading-tight font-semibold">{t('chat.title')}</p>
            <p className="text-xs opacity-80">{t('chat.subtitle')}</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
            aria-label={t('chat.close')}
            onClick={() => setIsOpen(false)}
          >
            <X />
          </Button>
        </CardHeader>
        <ScrollArea className="min-h-0 flex-1 bg-muted/30">
          <div className="space-y-3 p-4" aria-live="polite">
            <div className="flex items-start gap-2">
              <AssistantAvatar />
              <p className="rounded-2xl rounded-tl-sm bg-background px-3 py-2 text-sm shadow-xs">
                {t('chat.greeting')}
              </p>
            </div>
            {messages.map((message) =>
              message.author === 'user' ? (
                <div key={message.id} className="flex justify-end">
                  <p className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
                    {message.text}
                  </p>
                </div>
              ) : (
                <div key={message.id} className="flex items-start gap-2">
                  <AssistantAvatar />
                  <p className="max-w-[80%] rounded-2xl rounded-tl-sm bg-background px-3 py-2 text-sm shadow-xs">
                    {message.text}
                  </p>
                </div>
              ),
            )}
            {ask.isPending && (
              <div className="flex items-start gap-2" role="status" aria-label={t('common.loading')}>
                <AssistantAvatar />
                <div className="flex gap-1 rounded-2xl rounded-tl-sm bg-background px-3 py-3 shadow-xs">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className={cn(
                        'size-1.5 animate-bounce rounded-full bg-muted-foreground/60',
                        dot === 1 && '[animation-delay:150ms]',
                        dot === 2 && '[animation-delay:300ms]',
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <CardFooter className="border-t bg-background py-3">
          <form className="flex w-full gap-2" onSubmit={submit}>
            <Input
              value={draft}
              maxLength={300}
              placeholder={t('chat.placeholder')}
              aria-label={t('chat.placeholder')}
              className="h-9 rounded-full px-4"
              onChange={(event) => setDraft(event.target.value)}
            />
            <Button
              type="submit"
              size="icon"
              className="size-9 rounded-full"
              aria-label={t('chat.send')}
              disabled={ask.isPending}
            >
              <Send />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </aside>
  )
}
