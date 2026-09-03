export type Link = { label: string; href: string }
export type Metric = { value: string; label: string }

export type Role = {
  org: string
  role: string
  when: string
  summary: string
  mine: string
  stack: string[]
  challenge: string
  did: string[]
  impact: string[]
  metrics: Metric[]
}

export type Project = {
  name: string
  kind: string
  when: string
  summary: string
  stack: string[]
  detail: string[]
  links?: Link[]
}

export type EducationRow = {
  when: string
  role: string
  org: string
  note: string
  detail?: string[]
}

export type SkillGroup = {
  label: string
  items: string[]
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
  }
  nav: { links: Link[]; contact: string; cv: string }
  hero: {
    eyebrow: string
    lede: string
    primaryCta: string
    cvCta: string
    contactCta: string
  }
  now: {
    title: string
    window: string
    commits: string
    pullRequests: string
    issues: string
    reposLabel: string
    status: string
    updated: string
    unavailable: string
  }
  internships: { title: string; product: string; roles: Role[] }
  contributions: {
    title: string
    listLabel: string
    merged: string
    more: string
    moreHref: string
  }
  projects: { title: string; items: Project[] }
  skills: { title: string; groups: SkillGroup[] }
  education: {
    title: string
    rows: EducationRow[]
    languagesLabel: string
    languages: string[]
  }
  about: { title: string; headline: string; body: string[] }
  notFound: { code: string; title: string; back: string }
  contact: {
    heading: string
    email: string
    cv: string
    location: string
  }
}
