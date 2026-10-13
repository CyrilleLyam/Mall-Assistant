const localeFor = (language: string): string => (language === 'km' ? 'km-KH' : 'en-GB')

const parseIsoDate = (isoDate: string): Date => {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const formatDate = (isoDate: string, language: string): string =>
  new Intl.DateTimeFormat(localeFor(language), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parseIsoDate(isoDate))

export const formatDayMonth = (isoDate: string, language: string): string =>
  new Intl.DateTimeFormat(localeFor(language), { day: 'numeric', month: 'short' }).format(
    parseIsoDate(isoDate),
  )

export const dayAndMonth = (isoDate: string, language: string): { day: string; month: string } => {
  const date = parseIsoDate(isoDate)
  const locale = localeFor(language)
  return {
    day: new Intl.DateTimeFormat(locale, { day: 'numeric' }).format(date),
    month: new Intl.DateTimeFormat(locale, { month: 'short' }).format(date),
  }
}
