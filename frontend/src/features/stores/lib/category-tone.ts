export interface CategoryTone {
  avatar: string
  badge: string
}

const TONES = [
  {
    avatar: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
    badge: 'border-transparent bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
  },
  {
    avatar: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
    badge: 'border-transparent bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  },
  {
    avatar: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
    badge: 'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  },
  {
    avatar: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    badge: 'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
  {
    avatar: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
    badge: 'border-transparent bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  },
  {
    avatar: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    badge: 'border-transparent bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
  },
] satisfies CategoryTone[]

const NEUTRAL: CategoryTone = {
  avatar: 'bg-muted text-muted-foreground',
  badge: 'border-transparent bg-muted text-muted-foreground',
}

export function categoryTone(categoryId: string | undefined): CategoryTone {
  if (!categoryId) {
    return NEUTRAL
  }
  let hash = 0
  for (const char of categoryId) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return TONES[hash % TONES.length]
}
