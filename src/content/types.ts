/**
 * Forma do conteúdo do site. Cada idioma preenche exatamente esta estrutura,
 * portanto o TypeScript garante que nenhuma tradução fica para trás.
 */

export type Link = { label: string; href: string }
export type Metric = { value: string; label: string }

export type Role = {
  org: string
  role: string
  when: string
  status: string
  /** O produto: o que existe no mundo. */
  summary: string
  /** A minha posição nele, numa linha. */
  ownership: string
  metrics: Metric[]
  challenge: string
  /** O que fiz eu. */
  did: string[]
  /** O que resultou disso. */
  impact: string[]
  stack: string[]
}

export type Contribution = {
  repo: string
  pr: string
  href: string
  what: string
  diff: string
  detail: string[]
}

export type Project = {
  name: string
  kind: string
  when: string
  summary: string
  stack: string
  detail: string[]
  links?: Link[]
}

export type EducationRow = {
  when: string
  role: string
  org: string
  note: string
}

export type SkillTier = {
  label: string
  items: string
  /** Marca o nível que defendo a fundo, para haver hierarquia visível. */
  primary?: boolean
}

export type SiteContent = {
  meta: { description: string; ogDescription: string }
  ui: {
    skipToContent: string
    open: string
    close: string
    backToTop: string
    detail: string
    whatIDid: string
    result: string
    whatChanged: string
    viewPullRequest: string
  }
  nav: { links: Link[]; contact: string; cv: string }
  hero: {
    eyebrow: string
    lede: string
    primaryCta: string
    cvCta: string
    contactCta: string
  }
  proof: { facts: Metric[]; availability: string }
  internships: { title: string; product: string; roles: Role[] }
  contributions: {
    title: string
    intro: string
    listLabel: string
    items: Contribution[]
    more: string
    moreHref: string
  }
  projects: { title: string; items: Project[] }
  skills: { title: string; tiers: SkillTier[] }
  education: {
    title: string
    rows: EducationRow[]
    languagesLabel: string
    languages: string[]
  }
  about: { title: string; headline: string; body: string[]; extras: string[] }
  notFound: { code: string; title: string; back: string }
  contact: {
    heading: string
    email: string
    cv: string
    location: string
  }
}
