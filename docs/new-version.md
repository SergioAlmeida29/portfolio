# Nova Versão Unificada

Issue [#28](https://github.com/SergioAlmeida29/portfolio/issues/28).
Rota: `/new`. As experiências V1/V2/V3 foram removidas. Não houve promoção a
produção nem substituição da home original.

## Decisões do feedback

- Manter Lenis, com `lerp: 0.075`, e o ritmo de entrada da V1.
- Amplificar o deslocamento oposto do nome: de 32/-24px para 14/-12vw ao longo do
  hero. Respeita reduced motion e mantém o nome em contorno. A timeline nativa
  do browser é usada quando disponível, com fallback Motion.
- Dar destaque ao painel semanal: ao lado do nome em desktop, com material de
  vidro, título maior e três métricas bem visíveis.
- Manter os títulos laterais sticky nas secções em desktop.
- Navegação com experiência, open source, projetos/competições, competências,
  formação e contacto. Um único sublinhado animado segue a secção ativa; não há
  barra de progresso global. Em mobile a lista tem scroll horizontal próprio.
- About permanece na página, sem alteração de texto e sem entrada na nav pedida.
- O efeito de distorção, incluindo o texto escuro por trás, permanece por decisão
  explícita do utilizador. Não está aprovado para a versão final.

**Bloqueios de aprovação:** [`release-review.md`](release-review.md).

## Material de vidro

A implementação artesanal foi substituída por `@samasante/liquid-glass@0.1.1`
(MIT, sem dependências runtime além dos peers React/React DOM). A biblioteca gere
o campo de refração da superfície, separação RGB, curvatura, borda e atualização
da geometria quando o painel muda de tamanho.

`src/components/ui/glass-panel.tsx` é o ponto único para aplicar o material a
cartões, atividade, contacto e navegação. Os parâmetros foram afinados para
acentuar a borda refrativa e manter os filhos nítidos. A navegação usa mais blur
para preservar a leitura sobre o conteúdo em movimento.

O reflexo de interação é uma camada separada, limitada à borda:

- segue o rato com uma spring;
- desaparece no último ponto quando o rato sai;
- não redefine coordenadas para o canto superior;
- reaparece no ponto de entrada quando está invisível;
- numa reentrada rápida, continua a posição anterior suavemente;
- não cria o antigo brilho central que se esticava ao expandir WEBA/ARMIS.

O material luminoso estático da biblioteca é independente desse reflexo. Reduced
transparency usa fundo sólido sem refração; reduced motion desliga o reflexo
animado e o movimento do nome. Mudar preferências não remonta o conteúdo do cartão.

### Pesquisa e limites

Foram consultadas a apresentação oficial da Apple, a técnica da Aave e as
implementações `liquid-glass-react`, React Bits GlassSurface, Vaso e
`@samasante/liquid-glass`. Escolheu-se a última pela API de material, controlo
óptico e atualização de dimensões, sem impor layout ou movimentos aos cartões.

- [Apple: introdução ao Liquid Glass](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)
- [Aave: Building Glass for the Web](https://aave.com/design/building-glass-for-the-web)
- [Biblioteca adotada](https://github.com/samasante/liquid-glass)
- [Liquid Glass React](https://github.com/rdev/liquid-glass-react)
- [React Bits GlassSurface](https://reactbits.dev/components/glass-surface)

A versão atual usa o modo de material sobre o backdrop vivo. A refração desse
backdrop está disponível em Chromium; Safari/Firefox recebem o material CSS,
sem a mesma distorção. A opção cross-browser de refratar uma cópia do conteúdo
da biblioteca não é usada aqui. Não se promete igualdade pixel-perfect com o
renderizador proprietário da Apple.

Nos quatro painéis isolados por um `Reveal` transparente filtrado, o backdrop
amostrado está vazio. `EmptyBackdropGlass` usa frost nativo e uma máscara especular
em cache, adaptada do canal B da biblioteca; a navegação mantém o material original.
Este caminho depende dessa estrutura e não é um substituto genérico de `Glass`.
A medição de 2026-09-09 e as diferenças visuais residuais estão em
[`performance.md`](performance.md#retoma-de-2026-09-09).

## Navegação e regressões

`Nav.tsx` acompanha as seis secções por posição, com leituras limitadas a um frame
quando a geometria muda e observação das mudanças de altura do main/secções.
O scroll normal reutiliza as posições medidas. `aria-current="location"` indica
o destino ativo. O sublinhado usa layout animation do Motion. No hero não existe
uma secção ativa. About mantém Formação ativa até à chegada ao Contacto.

Lenis já lê o `scroll-padding-top` do CSS: foi removido o offset adicional que
deixava o destino 112px demasiado baixo e mantinha ativa a secção anterior.

## Verificação

```bash
npm run typecheck
npm run lint
./node_modules/.bin/vite build
CHROME_PATH=/usr/bin/google-chrome npm run test:ui
```

O build Vite é executado diretamente para não alterar as métricas do GitHub.
Os testes UI usam `BASE_URL` (por omissão o servidor Vite em 5173), verificam
larguras 320/390/1024/1280/1440, PT/EN, indicador de secção, navegação por âncora,
entrada/saída/reentrada do rato, expansão, movimento do nome, remoção das rotas
antigas e preferências de acessibilidade. `SCREENSHOT_DIR` permite guardar imagens.

Diagnóstico, otimizações e limitações medidas: [`performance.md`](performance.md).
