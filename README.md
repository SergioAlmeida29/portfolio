# sergioalmeida.dev

[![deploy](https://github.com/SergioAlmeida29/portfolio/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/SergioAlmeida29/portfolio/actions/workflows/deploy.yml)
[![quality](https://github.com/SergioAlmeida29/portfolio/actions/workflows/quality.yml/badge.svg?branch=main)](https://github.com/SergioAlmeida29/portfolio/actions/workflows/quality.yml)
[![codeql](https://github.com/SergioAlmeida29/portfolio/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/SergioAlmeida29/portfolio/actions/workflows/codeql.yml)

Portfólio pessoal em React, TypeScript e Tailwind. Alojado numa máquina própria,
atrás de um túnel Cloudflare: `main` serve produção, `dev` serve staging.

## Desenvolvimento

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

## CI/CD

| Workflow | Quando | O que faz |
|---|---|---|
| `deploy` | push a `main` e `dev`, PR | typecheck, lint, build; publica e faz smoke test em produção ou staging |
| `quality` | PR, push a `main` e `dev` | Lighthouse, Playwright, axe-core e verificação de links sobre o build |
| `codeql` | PR, push, semanal | análise estática de segurança |
| `gitleaks` | PR, push | procura segredos na árvore e no histórico |
| `preview` | PR | publica o PR em `staging.sergioalmeida.dev/pr/<n>/` |
| `now-refresh` | diário | recolhe os números do GitHub e republica se mudaram |
| `rollback` | manual | volta a uma release anterior e verifica o site |
| `ai-review`, `ai-triage`, `ai-command` | PR, issues, `/oc` | revisão, etiquetagem e respostas por modelos gratuitos |

O deploy é atómico: cada build vai para `releases/<id>` e um symlink `current`
faz flip. As cinco últimas releases ficam guardadas, que é o que torna o
rollback instantâneo.
