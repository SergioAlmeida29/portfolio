import { IconBrandGithub } from '@tabler/icons-react'
import { useContent, useLang } from '../content'
import { now } from '../content/now.generated'
import { fullDate } from '../lib/date'
import { Reveal } from './ui/reveal'

export function NowPanel() {
  const { now: t } = useContent()
  const { lang } = useLang()

  const stats = [
    { value: now.commits, label: t.commits },
    { value: now.pullRequests, label: t.pullRequests },
    { value: now.issues, label: t.issues },
  ]

  const collected = now.collectedAt && fullDate(now.collectedAt, lang)

  return (
    <Reveal delay={0.42}>
      <div className="glass rounded-xl p-6 sm:p-7">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-medium tracking-tight">{t.title}</h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            {t.window}
          </span>
        </div>

        {collected ? (
          <>
            <dl className="mt-6 space-y-3">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-3">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-mono text-2xl tabular-nums leading-none text-fg">
                    {stat.value}
                  </dd>
                  <span aria-hidden className="h-px flex-1 bg-white/[0.08]" />
                  <span className="text-sm text-muted">{stat.label}</span>
                </div>
              ))}
            </dl>

            {now.repos.length > 0 && (
              <p className="mt-6 text-sm leading-relaxed text-muted">
                {t.reposLabel}{' '}
                {now.repos.map((repo, index) => (
                  <span key={repo}>
                    {index > 0 && ', '}
                    <a
                      href={`https://github.com/${repo}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[13px] text-fg/90 underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-accent hover:text-fg"
                    >
                      {repo}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </>
        ) : (
          <p className="mt-6 text-sm text-muted">{t.unavailable}</p>
        )}

        <p className="mt-7 border-t border-white/[0.07] pt-5 text-sm leading-relaxed text-fg/85">
          <span
            aria-hidden
            className="mr-2 inline-block size-1.5 -translate-y-px rounded-full bg-accent align-middle"
          />
          {t.status}
        </p>

        {collected && (
          <p className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-muted">
            <IconBrandGithub size={13} stroke={1.75} aria-hidden />
            {t.updated} {collected}
          </p>
        )}
      </div>
    </Reveal>
  )
}
