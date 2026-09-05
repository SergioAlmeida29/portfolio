import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const USER = 'SergioAlmeida29'

const DAYS = 7
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/content/now.generated.ts')

const since = new Date(Date.now() - DAYS * 86400_000).toISOString().slice(0, 10)

const headers = {
  accept: 'application/vnd.github+json',
  'user-agent': `${USER}-portfolio-build`,
  ...(process.env.GITHUB_TOKEN && {
    authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  }),
}

async function search(path, q, perPage = 1) {
  const url = `https://api.github.com/search/${path}?q=${encodeURIComponent(q)}&per_page=${perPage}`
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) })

  if (!res.ok) {
    throw new Error(`${path}: HTTP ${res.status}`)
  }

  const body = await res.json()

  if (typeof body.total_count !== 'number') {
    throw new Error(`${path}: resposta sem total_count`)
  }

  return body
}

const count = async (path, q) => (await search(path, q)).total_count

async function externalRepos(q) {
  const body = await search('issues', q, 100)
  const tally = new Map()

  for (const item of body.items ?? []) {
    const repo = item.repository_url.split('/repos/')[1]

    if (repo.startsWith(`${USER}/`)) continue

    tally.set(repo, (tally.get(repo) ?? 0) + 1)
  }

  return [...tally.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([repo]) => repo)
}

async function merged() {
  const q = `author:${USER} type:pr is:merged`
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=updated&order=desc&per_page=20`
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) })

  if (!res.ok) throw new Error(`merged: HTTP ${res.status}`)

  const items = (await res.json()).items ?? []
  const externos = items
    .map((i) => ({ item: i, repo: i.repository_url.split('/repos/')[1] }))
    .filter(({ repo }) => !repo.startsWith(`${USER}/`))
    .slice(0, 3)

  return await Promise.all(
    externos.map(async ({ item, repo }) => {
      let additions = null
      let deletions = null

      try {
        const d = await fetch(`https://api.github.com/repos/${repo}/pulls/${item.number}`, {
          headers,
          signal: AbortSignal.timeout(10_000),
        })

        if (d.ok) {
          const pr = await d.json()
          additions = pr.additions ?? null
          deletions = pr.deletions ?? null
        }
      } catch {}

      return {
        repo,
        number: item.number,
        title: item.title,
        url: item.html_url,
        mergedAt: item.pull_request?.merged_at ?? null,
        additions,
        deletions,
      }
    }),
  )
}

function write(data) {
  let output = data

  try {
    const source = readFileSync(OUT, 'utf8')
    const match = source.match(/^export const now = ([\s\S]+) as const\s*$/)
    const previous = match && JSON.parse(match[1])

    if (previous) {
      const previousValues = { ...previous }
      const currentValues = { ...data }
      delete previousValues.collectedAt
      delete currentValues.collectedAt

      if (JSON.stringify(previousValues) === JSON.stringify(currentValues)) {
        output = { ...data, collectedAt: previous.collectedAt }
      }
    }
  } catch {}

  writeFileSync(
    OUT,
    `export const now = ${JSON.stringify(output, null, 2)} as const\n`,
  )
}

const prQuery = `author:${USER} type:pr created:>=${since}`

try {
  const [commits, pullRequests, issues, repos, contributions] = await Promise.all([
    count('commits', `author:${USER} author-date:>=${since}`),
    count('issues', prQuery),
    count('issues', `author:${USER} type:issue created:>=${since}`),
    externalRepos(prQuery),
    merged(),
  ])

  write({
    commits,
    pullRequests,
    issues,
    repos,
    contributions,
    days: DAYS,
    collectedAt: new Date().toISOString(),
  })
  console.log(
    `now: ${commits} commits, ${pullRequests} PRs, ${issues} issues (${DAYS}d) — ${repos.join(', ') || 'sem repos externos'}\n` +
      `     merged: ${contributions.map((c) => `${c.repo}#${c.number}`).join(', ') || 'nenhum'}`,
  )
} catch (error) {
  let kept = false

  try {
    readFileSync(OUT)
    kept = true
  } catch {
    write({
      commits: 0,
      pullRequests: 0,
      issues: 0,
      repos: [],
      contributions: [],
      days: DAYS,
      collectedAt: null,
    })
  }

  console.warn(
    `now: ${error.message} — ${kept ? 'mantido o ficheiro anterior' : 'escrito a zeros'}`,
  )
}
