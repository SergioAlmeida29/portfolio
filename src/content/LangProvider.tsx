import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  dictionaries,
  LangContext,
  STORAGE_KEY,
  type Lang,
  type LangContextValue,
} from './context'

function initialLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'pt') return saved
  } catch {}
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }, [])

  useEffect(() => {
    const content = dictionaries[lang]
    document.documentElement.lang = lang
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', content.meta.description)
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', content.meta.ogDescription)
  }, [lang])

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, content: dictionaries[lang] }),
    [lang, setLang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}
