export type Language = 'en' | 'km'

export const pickLocalized = (language: string, english: string, khmer: string): string =>
  language === 'km' && khmer ? khmer : english
