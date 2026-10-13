import { useTranslation } from 'react-i18next'
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'km', label: 'ខ្មែរ' },
] as const

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      aria-label="Language"
      value={i18n.resolvedLanguage}
      onValueChange={(code) => {
        if (code) void i18n.changeLanguage(code)
      }}
    >
      {LANGUAGES.map(({ code, label }) => (
        <ToggleGroupItem key={code} value={code}>
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
