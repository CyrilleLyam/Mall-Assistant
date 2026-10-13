import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { cookies } from '@/shared/lib/cookies'
import en from './locales/en.json'
import km from './locales/km.json'

const LANGUAGE_COOKIE = 'language'
const LANGUAGE_COOKIE_DAYS = 365

const languageDetector = new LanguageDetector()
languageDetector.addDetector({
  name: 'languageCookie',
  lookup: () => cookies.get(LANGUAGE_COOKIE) ?? undefined,
  cacheUserLanguage: (language) =>
    cookies.set(LANGUAGE_COOKIE, language, { expires: LANGUAGE_COOKIE_DAYS, sameSite: 'lax' }),
})

const syncDocumentLanguage = (language: string): void => {
  document.documentElement.lang = language
}

void i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, km: { translation: km } },
    fallbackLng: 'en',
    supportedLngs: ['en', 'km'],
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: { order: ['languageCookie', 'navigator'], caches: ['languageCookie'] },
  })
  .then(() => syncDocumentLanguage(i18n.resolvedLanguage ?? 'en'))

i18n.on('languageChanged', syncDocumentLanguage)

export default i18n
