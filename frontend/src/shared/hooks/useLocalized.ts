import { useTranslation } from 'react-i18next'
import { pickLocalized } from '../lib/localized'

export function useLocalized() {
  const { i18n } = useTranslation()
  return (english: string, khmer: string): string =>
    pickLocalized(i18n.resolvedLanguage ?? 'en', english, khmer)
}
