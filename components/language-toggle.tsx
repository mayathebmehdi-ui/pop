'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { Button } from '@/components/ui/button'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
      aria-label="Toggle language"
      className="relative"
    >
      <Languages className="h-4 w-4" />
      <span className="absolute -bottom-1 -right-1 text-xs font-bold text-primary">
        {language.toUpperCase()}
      </span>
      <span className="sr-only">Toggle language</span>
    </Button>
  )
}

