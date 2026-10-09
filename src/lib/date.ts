import type { Lang } from '../content'

const LOCALES: Record<Lang, string> = { en: 'en-GB', pt: 'pt-PT' }

const cache = new Map<string, Intl.DateTimeFormat>()

function formatter(lang: Lang, options: Intl.DateTimeFormatOptions) {
  const key = lang + JSON.stringify(options)
  let found = cache.get(key)

  if (!found) {
    found = new Intl.DateTimeFormat(LOCALES[lang], options)
    cache.set(key, found)
  }

  return found
}

export function monthYear(iso: string, lang: Lang) {
  return formatter(lang, { month: 'short', year: 'numeric' }).format(new Date(iso))
}

export function fullDate(iso: string, lang: Lang) {
  return formatter(lang, { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(iso),
  )
}
