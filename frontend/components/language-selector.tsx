'use client'

import { useState, useRef, useEffect } from 'react'
import * as Icons from 'lucide-react'
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/translations'

interface LanguageSelectorProps {
  currentLang: string
  onSelectLang: (langCode: string) => void
}

export function LanguageSelector({ currentLang, onSelectLang }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0]

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="language-selector-wrapper notranslate" translate="no" ref={ref}>
      <button
        type="button"
        className="language-selector-btn"
        onClick={() => setOpen(!open)}
        title={`Language: ${activeLang.nativeName} (${activeLang.name}). Click to change.`}
        aria-label="Select website language"
        aria-expanded={open}
      >
        <Icons.Globe className="w-3.5 h-3.5" />
        <span className="notranslate" translate="no">{activeLang.code.toUpperCase()}</span>
        <Icons.ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="language-dropdown-menu notranslate" translate="no" role="menu">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLang
            return (
              <button
                key={lang.code}
                type="button"
                className={`language-option notranslate ${isSelected ? 'selected' : ''}`}
                translate="no"
                onClick={() => {
                  onSelectLang(lang.code)
                  setOpen(false)
                }}
                role="menuitem"
              >
                <span className="lang-native notranslate" translate="no">{lang.nativeName}</span>
                <span className="lang-name notranslate" translate="no">({lang.name})</span>
                {isSelected && <Icons.Check className="w-3.5 h-3.5 ml-auto text-primary" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
