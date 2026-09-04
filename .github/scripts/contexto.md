Projecto: sergioalmeida.dev — portefólio pessoal de Sérgio Almeida, estudante de
Engenharia Informática na FEUP. Vite + React 19 + TypeScript + Tailwind v4 + `motion/react`.

Alojamento próprio: um Acer em casa, com túnel Cloudflare e nginx. `main` serve produção em
https://sergioalmeida.dev; `dev` serve staging em https://staging.sergioalmeida.dev, atrás de
Cloudflare Access. O deploy é atómico: o build vai para `releases/<sha>` e um symlink `current`
faz flip. Custo de infraestrutura: zero euros, e isso é uma restrição do projecto, não um acaso.

O repositório é público e é ele próprio peça de portefólio. O histórico é produto: não mostra
tentativas nem reversões.

Regras permanentes do projecto, que valem como critério de revisão:

- DRY. Uma fonte de verdade por facto. O mesmo facto escrito em dois sítios é defeito.
- Conteúdo em `src/content/`, números do GitHub em `src/content/now.generated.ts`, estilos em
  `src/index.css`. Texto literal dentro de um componente é defeito.
- Estruturas iguais usam os mesmos campos.
- Dependências novas precisam de uma razão concreta.
- Direcção: moderno, simples, minimalista. Cada efeito tem de melhorar a interface ou a
  performance; um efeito que não faça nem uma coisa nem outra sai.
- Estilo: aspas simples, sem ponto e vírgula, vírgula final.
- Commits conventional de uma linha, sem corpo e sem rodapés de atribuição.
- Nada entra sem issue: um PR fecha um issue com `Closes #n`.
