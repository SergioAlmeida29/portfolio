# sergioalmeida.dev

Portfólio pessoal em React, TypeScript e Tailwind.

## Desenvolvimento

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

## Nova versão

`/new` reúne a composição, scroll fluido e títulos sticky da V1 com o novo
material Liquid Glass. A atividade semanal tem mais destaque e a navegação
inclui as seis secções, com indicador animado da secção ativa.

As rotas `/v1`, `/v2` e `/v3` foram removidas. `/` mantém a versão original
enquanto a nova não for aprovada. Não há seletores entre experiências antigas.

O vidro usa `@samasante/liquid-glass`. Chromium recebe refração do backdrop;
Safari/Firefox recebem o material com blur e reflexos, sem a mesma refração live.
Não é o renderizador nativo da Apple.

**Antes da versão final:** confirmar o efeito de distorção/texto escuro por trás e
substituir o texto do About. As decisões estão em
[`docs/release-review.md`](docs/release-review.md).

Implementação e referências: [`docs/new-version.md`](docs/new-version.md).
Medições e limitações de performance: [`docs/performance.md`](docs/performance.md).

## Testes de interface

Com o servidor de desenvolvimento em execução:

```bash
npx playwright install chromium
npm run test:ui
```

Para usar um Chrome já instalado, definir `CHROME_PATH` em vez de descarregar
o browser. `BASE_URL` permite apontar para outro servidor. Os testes cobrem as
regressões de navegação, reflexos, expansão, movimento e preferências de acessibilidade.
