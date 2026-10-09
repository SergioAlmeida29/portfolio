import { createContext, useContext } from 'react'
import { en } from './en'
import { pt } from './pt'
import type { SiteContent } from './types'

export type Lang = 'en' | 'pt'

export const dictionaries: Record<Lang, SiteContent> = { en, pt }
export const STORAGE_KEY = 'lang'

export type LangContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  content: SiteContent
}

export const LangContext = createContext<LangContextValue | null>(null)

export function useLang() {
  const value = useContext(LangContext)
  if (!value) throw new Error('useLang tem de ser usado dentro de <LangProvider>')
  return value
}

export function useContent() {
  return useLang().content
}
