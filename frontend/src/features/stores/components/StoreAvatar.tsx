import { cn } from '@/shared/lib/utils'
import { categoryTone } from '../lib/category-tone'

interface StoreAvatarProps {
  name: string
  categoryId?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES = {
  sm: 'size-9 rounded-lg text-sm',
  md: 'size-12 rounded-xl text-base',
  lg: 'size-16 rounded-2xl text-xl',
}

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => Array.from(word)[0])
    .join('')
    .toUpperCase()

export function StoreAvatar({ name, categoryId, size = 'md' }: StoreAvatarProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center font-semibold',
        categoryTone(categoryId).avatar,
        SIZE_CLASSES[size],
      )}
    >
      {initialsOf(name)}
    </div>
  )
}
