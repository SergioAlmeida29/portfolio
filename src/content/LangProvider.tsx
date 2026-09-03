import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  dictionaries,
  LangContext,
  STORAGE_KEY,
  type Lang,
  type LangContextValue,
} from './context'

/**
 * Inglês é o idioma principal: é o que serve recrutadores fora de Portugal.
 * O português continua completo, à escolha, e a escolha fica guardada.
 */
function initialLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'pt') return saved
  } catch {
    /* localStorage pode estar bloqueado; o default resolve. */
  }
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* Sem persistência, a escolha vale só para esta visita. */
    }
  }, [])

  /* O atributo lang do documento tem de acompanhar: leitores de ecrã e
     tradutores automáticos dependem dele, e o SEO também. */
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
