# Handoff de Deploy: /new

Atualizado em 2026-09-09. Este documento fecha a investigação da issue #28 e
define a sequência para deixar a versão pronta para revisão de deploy. Não houve
commit, push, PR ou promoção nesta sessão.

## Estado verificável

### Decisões recebidas nesta retoma

- O objetivo ativo é otimizar apenas `/new` para iniciar a transição, equilibrando
  performance e design; a home original não é candidata a promoção nesta vaga.
- É permitido adiar a máscara especular de cartões fora da dobra. O texto About
  fica inalterado em PT/EN.
- A home original deve ser restaurada enquanto `/new` é refinada. Confirmado em
  2026-09-09.
- A água, a resolução dos efeitos, a refração e o RGB não devem ser simplificados
  sem uma medição que prove ser necessário.

- Branch: `feat/28-frontend-directions`.
- O worktree tem alterações locais extensas e todas estão unstaged. Não há uma
  fronteira de commits que separe a exploração inicial, as otimizações e esta
  retoma. Não descartar nem reverter alterações sem revisão.
- `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build:staging` e
  `BASE_URL=http://127.0.0.1:4178 CHROME_PATH=/usr/bin/google-chrome npm run test:ui`
  passaram em 2026-09-09.
- O build consulta a API GitHub para atualizar `src/content/now.generated.ts`.
  Quando a API falha, preserva os dados existentes; quando responde, muda este
  ficheiro. Isso é esperado, mas torna o estado local diferente depois de um build.
- A promoção continua bloqueada por `release-review.md`: aprovação do vidro/texto
  atrás da navegação e revisão visual das interações. O About atual em PT/EN foi
  explicitamente mantido em 2026-09-09.

## Problemas confirmados

### P0 corrigido: isolamento entre / e /new

Na auditoria, `README.md` e `new-version.md` diziam que `/` mantinha o original,
mas o código aplicava alterações da experiência nova globalmente:

- `Nav.tsx` substituiu a navegação antiga em todas as rotas.
- `Expandable.tsx` substituiu a área clicável completa pelo botão `+` em todas as
  instâncias, incluindo projetos da home original.
- Os links e rótulos de navegação em `content/en.ts` e `content/pt.ts` foram
  alterados globalmente.
- `new-version.css` é importado por `main.tsx`; várias regras de navegação e dos
  breakpoints não estão sob `html[data-preview]`.
- `Water` é intencionalmente comum às duas experiências; não o remover por este
  motivo. A água animada é uma restrição confirmada de `/new`.

**Implementação proposta:** recuperar o markup, os links e a interação HEAD para
`/`; criar variantes específicas de `/new` (`NewNav` e, se necessário,
`NewExpandable`) ou aceitar uma prop explícita de preview nos componentes comuns.
Todo o CSS exclusivo deve começar com `html[data-preview]`. Só depois separar os
imports de `/new` para não aumentar a carga da home original.

**Aceitação:** screenshots e testes de `/` demonstram a navegação, CTA Contacto e
disclosures originais; `/new` preserva os seis destinos, o indicador e o botão `+`.

**Aplicado nesta retoma:** `Nav` tem ramos separados para a versão original e para
a prévia; a versão original limita-se às três secções históricas, CV e Contacto.
`Expandable` mantém a linha inteira clicável em `/` e o botão `+` isolado em
`/new`. As regras de nav, disclosure e breakpoints que estavam soltas no CSS agora
estão limitadas a `html[data-preview]`. O teste UI confirma os dois comportamentos.

### P0 corrigido: o background antigo em /new

Isto explica a observação do utilizador. Não é um pedido de rede: são camadas CSS
inline no `index.css`, ainda processadas e compostas.

Em `/new`, depois de a água WebGL estar pronta, o browser confirmou:

- `body::before`: gradientes antigos ativos;
- `body::after`: luzes radiais antigas ativas e com animação `drift`;
- `html::after`: grão antigo ativo;
- `html::before`: escondido apenas porque `Water` definiu `data-water="gl"`.

`html::before` volta a ficar visível quando WebGL, precisão highp ou shaders falham,
porque o atributo só é definido depois da inicialização do canvas. A água tem alpha
e não substitui visualmente as camadas que ficam por cima dela.

**Implementação proposta:** manter a cor base de `body` e a água, mas desativar os
quatro pseudo-elementos antigos sob `html[data-preview]`. A regra deve existir no
CSS crítico antes do primeiro render, em vez de depender de `data-water`. Validar
o fallback WebGL como uma superfície escura estática deliberada, não como o fundo
antigo reativado.

**Aceitação:** em Chrome com WebGL e com WebGL bloqueado, `/new` não tem
`body::before`, `html::before`, `body::after` nem `html::after` pintados. `/` mantém
as quatro camadas existentes.

**Aplicado nesta retoma:** `new-version.css` desativa as quatro pseudo-camadas sob
`html[data-preview]`, mantendo `body` como fundo base e o canvas de água intacto.

### P0 corrigido: rota publicada incompleta

O Nginx faz fallback SPA para `/new/`, mas `isPreview` aceita apenas `/new`; o
resultado é `Page not found`. A auditoria no browser confirmou-o.

**Implementação proposta:** normalizar o pathname ou aceitar explicitamente
`/new/`; escolher uma URL canónica e redirecionar a outra antes do render.

**Aceitação:** `/new` e `/new/` chegam à prévia sem 404; URL canónica, título e
`data-preview` são consistentes.

**Aplicado nesta retoma:** `/new/` é aceite como prévia e tem cobertura no teste UI.

## Carga inicial e performance

### Medição atual

Em Chrome 152 local, cache frio e 1440x900, tanto `/` como `/new` descarregaram os
mesmos oito recursos, sem falhas:

| Recurso | Transferência |
| --- | ---: |
| Aplicação | 52.9 KB |
| Motion | 49.3 KB |
| React | 56.8 KB |
| CSS | 11.3 KB |
| Geist Latin | 29.7 KB |
| Geist Mono Latin | 23.4 KB |
| Runtime e favicon | 1.6 KB |
| Total | 224.9 KB |

Os valores são da máquina local e incluem headers, não substituem uma medição via
Cloudflare nem em rede móvel. Não há imagens, vídeos ou modelos inicialmente
carregados. Os ruídos antigos são data URIs no CSS, não pedidos HTTP.

O bundle não tem divisão por rota: `main.tsx` importa CSS, router e `Home`; `Home`
importa todas as secções; `GlassPanel` importa `@samasante/liquid-glass` de forma
estática. Assim `/` carrega o CSS e o código necessários apenas para `/new`, e
`/new` monta desde o início todas as secções abaixo da dobra.

### Ordem de otimização

1. Os três P0 acima foram corrigidos nesta retoma. Manter testes para evitar que a
   separação entre as duas experiências volte a vazar.
2. Usar import dinâmico para a rota e CSS exclusivos só se uma medição confirmar
   que a carga extra em `/` justifica a complexidade. O
   objetivo é que `/` não descarregue Lenis, Liquid Glass, máscara especular nem
   `new-version.css`; `/new` pode continuar a carregar o que lhe pertence.
3. Medir no browser o custo da montagem inicial dos quatro `EmptyBackdropGlass`.
   Atualmente todos criam síncronamente uma máscara PNG 512x512 num `useLayoutEffect`,
   inclusive WEBA, ARMIS e Contacto fora do viewport. Se houver tarefa longa,
   adiar a criação dos painéis fora da dobra com `IntersectionObserver` e manter uma
   superfície CSS estática até a máscara estar pronta. Não reduzir `mapSize` nem
   remover reflexos sem aprovação visual.

   **Aplicado parcialmente:** os cartões de experiência e contacto usam
   `IntersectionObserver` com margem de 200px. Após 2,2 segundos em 1440x900, o
   browser gerou três mapas em vez de quatro; o Contacto continua adiado até se
   aproximar. A máscara da atividade permanece imediata para não atrasar o hero.
4. Medir a expansão: a máscara é recalculada em cada alteração de altura e a
   medição anterior observou 17–18 mapas. Se for um problema real, atualizar a
   máscara no fim da animação ou limitar atualizações a um frame. Isto pode mudar a
   borda durante a expansão, logo exige comparação visual antes de ficar.
5. Perfilar separadamente a navegação Liquid Glass. Mantém três
   `feDisplacementMap`, `frost: 7` e backdrop filter ao longo de todo o scroll;
   é o custo de composição restante mais provável. Não a substituir por CSS nem
   diminuir refração/RGB sem decisão explícita.
6. A água mantém um canvas WebGL de viewport completo, cinco iterações no fragment
   shader e RAF enquanto a página está visível. Já para em background e respeita
   reduced motion. Não reduzir resolução ou parar a animação em idle sem aprovação,
   pois a água animada é uma restrição. Medir GPU/potência em mobile antes de mudar.
7. Só depois das medições, rever filtros CSS comuns abaixo da dobra (`.glass-panel`,
   `.glass-soft`, marquee e observadores Motion). Não fazer virtualização ou novos
   pacotes: o conteúdo é curto e o ganho é especulativo.

### Resultado existente da máscara

O caminho de máscara dos quatro painéis foi comparado com uma referência reconstruída
que força a biblioteca original no mesmo código. Em três repetições na Radeon 780M,
Chrome 152, a mediana do intervalo de frame passou de aproximadamente 83ms para 33ms
no topo, final e expansão; a máscara não teve frames acima de 34ms nessa amostra.
Não é 60fps, não é medição em mobile e não prova equivalência pixel-perfect. A
documentação completa está em `performance.md`.

## Qualidade, compatibilidade e deploy

### Testes que faltam

- `test:ui` não corre no workflow `deploy.yml`; CI faz apenas typecheck, lint e
  build. Adicionar uma etapa que constrói, inicia `vite preview`, espera pelo
  servidor, executa Playwright e termina o processo. Confirmar primeiro que o runner
  self-hosted tem Chrome acessível em `CHROME_PATH`.
- Cobrir `/new/` e `/` no teste UI. O teste atual verifica apenas que `/` tem um
  `h1`, por isso não deteta o vazamento da nova navegação.
- Testar WebKit e Firefox: o fallback de Liquid Glass é documentado mas não foi
  validado nesta retoma. Incluir transparência e movimento reduzidos.
- Medir LCP, INP, CLS, tarefas longas, GPU e requests em Android físico ou hardware
  semelhante. A medição desktop headless não é evidência de campo.
- Antes de promover, testar no staging real: `/new`, `/new/`, `/`, refresh direto,
  PT/EN, Cloudflare Access, robots e cache dos assets com hash.

### Dependências e licenças

`@samasante/liquid-glass@0.1.1` foi adicionada. A porção adaptada para a máscara
está identificada com licença MIT em `src/lib/specular-map.ts` e em
`public/third-party-notices.txt`. Confirmar na revisão que o aviso público deve
continuar no deploy. Não há outra dependência nova necessária para a correção.

## Sequência de execução para o GPT Astra

1. Ler este documento, `release-review.md`, `performance.md`, `new-version.md` e a
   issue #28. Confirmar que continua em `feat/28-frontend-directions` e preservar o
   worktree sujo.
2. Separar rigorosamente `/` e `/new`; não apagar a versão original para resolver
   o vazamento. Normalizar `/new/`.
3. Remover as pseudo-camadas do background antigo apenas em `/new`, preservando a
   água e o fundo base. Testar o fallback sem WebGL.
4. Acrescentar os testes de rota e regressão da home; integrar UI test no CI apenas
   depois de confirmar browser no runner.
5. Fazer uma medição before/after da carga e das tarefas longas. Implementar só a
   primeira otimização que tenha um gargalo demonstrado e executar a comparação
   visual desktop/mobile.
6. Executar typecheck, lint, build, build:staging, UI tests Chromium, testes de
   fallback e revisão de staging. Atualizar `performance.md` com comandos, ambiente,
   números e limites reais.
7. Pedir as decisões de aprovação abaixo. Só com todas positivas: organizar commits
   por assunto, abrir PR para `feat/frontend`, validar staging e seguir o fluxo em
   `../../docs/fluxo-de-trabalho.md`. Não promover diretamente para `main`.

## Decisões pendentes do utilizador

1. `/` deve continuar exatamente como antes enquanto `/new` é refinada? A
   recomendação é **sim**, conforme a documentação e a issue.
2. Em `/new`, confirmas remover por completo os gradientes, luzes e grão antigos,
   mantendo apenas o fundo base escuro e a água animada? Esta é a correção direta
   para o background antigo ainda visível.
3. Aceitas adiar a máscara dos cartões fora da dobra e, se a medição justificar,
   atualizá-la apenas no fim da expansão? Isto melhora carga e expansão, mas pode
   alterar subtilmente a borda durante a abertura.
4. Para o Liquid Glass da navegação, a prioridade é fidelidade máxima ou uma meta
   de fluidez próxima de 60fps? A configuração atual preserva fidelidade e continua
   perto de 33ms por frame no ambiente medido.
5. O About atual em PT e EN foi mantido por decisão explícita; não alterar sem novo
   pedido.
6. Depois de experimentar staging: o texto escuro/distorção atrás da navegação fica,
   é reduzido ou sai? E aprovas o material e expansão dos cartões?
