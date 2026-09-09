# Performance de /new

Estado em 2026-09-09: a máscara para fundos vazios, já presente no trabalho local,
foi validada separadamente das primeiras otimizações abaixo. Há agora um ganho
medido, mas não 60fps estáveis nem equivalência visual pixel-perfect.
Ver [Retoma de 2026-09-09](#retoma-de-2026-09-09).

## Restrição

Manter o design, a refração durante o scroll, a separação RGB, a resolução dos
efeitos, a água animada e o movimento do nome. O utilizador rejeitou simplificar
temporariamente o vidro durante o scroll.

## Diagnóstico

O perfil confirma que o custo principal está no desenho/composição do vidro,
não em geração de mapas durante o scroll: o percurso inicial registou zero
regenerações de mapas, mas esperas longas no compositor. A expansão de cartões
é um caso separado, porque altera a geometria do material.

Os primeiros testes headless usavam SwiftShader. As comparações finais foram
repetidas com a AMD Radeon 780M, aceleração GL e composição GPU ativas. Os
valores são de um percurso automatizado, não uma garantia de FPS noutros browsers.

## Alterações aplicadas

- Navegação: posições das secções são guardadas em coordenadas do documento,
  recalculadas em resize, mudanças de altura, idioma e expansão. O scroll normal
  deixa de ler a geometria das seis secções a cada frame.
- Nome: usa uma timeline CSS nativa quando suportada, com os mesmos 14/-12vw e
  o mesmo intervalo de scroll. Mantém o fallback Motion e reduced motion.
- Reflexo: o mesmo gradiente de 240px move-se como uma imagem de 480px dentro da
  máscara da borda, em vez de reconstruir o fundo inteiro do painel por frame.
  As springs, opacidade e comportamento de entrada/saída não foram alterados.
- Material: objetos de parâmetros e estilos constantes são reutilizados.
- Água: o shader não executa as cinco iterações de ondas onde a máscara final
  seria zero. A resolução, os parâmetros e os píxeis visíveis mantêm-se.
- Resize da água: evita realocar o drawing buffer se a dimensão não mudou.

## Comparação anterior (2026-09-08)

Dois builds de produção, aquecimento prévio, três repetições alternadas, viewport
1440x900 e janela de medição de 2,4 segundos. Nenhum outro teste de browser foi
executado em paralelo com a comparação final.

| Scroll inicial | Antes | Depois |
| --- | --- | --- |
| Leituras de getBoundingClientRect por percurso | 152 | 5 |
| Tempo de JavaScript médio | 18,42ms | 16,28ms |
| Tempo médio em tarefas do main thread | 409,20ms | 378,48ms |
| Mediana dos intervalos entre frames | ~100ms | ~100ms |
| P95 dos intervalos entre frames | ~133ms | ~133ms |

**Resultado limitado:** houve redução do trabalho interno, mas não foi observado
um ganho significativo de fluidez. O lag não deve ser considerado resolvido.
O custo principal da refração continua presente; nenhum efeito foi removido para
melhorar os números.

## Preservação visual

Comparação antes/depois com o mesmo instante do shader, backgrounds CSS pausados,
fontes carregadas e mesmas posições do scroll. Foram comparados hero, experiência,
hover, expansão e contacto em 1440px e 390px. Pixelmatch (threshold 0.1, includeAA)
não detetou diferenças percetíveis nos dez cenários; isto não significa igualdade
binária de todos os píxeis durante qualquer animação.

A tentativa de retirar `blur(0px)` após o reveal foi **descartada**, porque mudava
a amostragem da refração. Também não foram aplicadas as experiências de redução
de refração/RGB nem alterações internas ao grafo SVG da biblioteca.

## Reproduzir

`scripts/measure-scroll.mjs` mede sem alterar os efeitos. Requer servidores de
preview dos builds antes/depois e Playwright instalado. Executar isoladamente:

```bash
CHROME_PATH=/usr/bin/google-chrome HARDWARE=1 \
BASE_URL=http://127.0.0.1:4173 COMPARE_URL=http://127.0.0.1:4174 \
RUNS=3 REGIONS=top,bottom node scripts/measure-scroll.mjs
```

O relatório imprime o renderer e estado da GPU. Sem `HARDWARE`, o teste permite
SwiftShader, que serve para diagnóstico mas não para estimar a fluidez com GPU.

## Retoma de 2026-09-09

### Otimização adicional

Após confirmar que `/new` era a rota a otimizar, foram retiradas apenas nela as
quatro pseudo-camadas do background antigo: gradientes, ruído, luzes animadas e
grão. A cor de fundo base e o canvas de água mantêm-se. Em Chrome 152, `/new` e
`/new/` passaram a ter os quatro pseudo-elementos com `display: none`; `/` conserva
as camadas originais.

Os painéis WEBA, ARMIS e contacto passaram a adiar a máscara especular até estarem
a 200px do viewport. Após 2,2 segundos em 1440x900, foram geradas três máscaras em
vez de quatro; o painel semanal do hero fica imediato. O scroll e expansão mantêm
mediana de ~33,3ms nesta máquina. A expansão continua a recalcular a máscara por
frame e é o próximo ponto a medir antes de alterar o comportamento visual.

### Ponto recuperado

O código local já continha `EmptyBackdropGlass` e `createSpecularAlphaMap`, ainda
sem resultados nestas notas. O caminho substitui o filtro SVG por frost nativo e
uma máscara especular de 512px em cache, apenas nos quatro painéis cujo `Reveal`
transparente isola um backdrop vazio: atividade, WEBA, ARMIS e contacto. A nav
continua a usar a biblioteca com as três componentes de refração RGB.

Nesta retoma foram corrigidos dois problemas reproduzidos no browser:

- Reduced transparency ainda deixava `saturate(1.3)` ativo; agora usa saturação
  neutra e o teste confirma `backdrop-filter: none` nos quatro painéis.
- Reduced motion isoladamente deixava os Reveals fora do viewport com
  `filter: none`; agora `blur(0px)` mantém a fronteira do backdrop desde o início.

A deteção de Chromium passou para o inicializador de estado, evitando um render
extra e o aviso de lint. Os parâmetros normais de material não foram alterados.

### Medição do material

Referência reconstruída a partir do mesmo código: um plugin de build temporário
seleciona `Glass` e os `optics` normais nos quatro painéis, sem editar os ficheiros
de trabalho. Não é uma comparação com um commit histórico. Ambos os builds incluem
as correções de preferências desta retoma.

Chrome 152 headless, AMD Radeon 780M, Mesa 26.0.8, GL e composição GPU ativos,
1440x900, aquecimento e três pares referência/máscara. O script
`measure-scroll.mjs` foi executado sozinho com `REGIONS=top,bottom,expand`.

| Mediana dos intervalos por percurso | Biblioteca | Máscara em cache |
| --- | --- | --- |
| Scroll inicial | 83,3–83,4ms | 33,2–33,3ms |
| Scroll final | 83,3ms | 33,3ms |
| Expansão | 83,3ms | 33,2ms |
| P95 no scroll inicial | 116,6–116,7ms | 33,4ms |

Zero regenerações de mapas durante o scroll nos dois builds. A expansão ainda
gera mapas: 6 com a biblioteca, 17–18 com a máscara, pois há mais frames e medidas
intermédias. Não houve intervalos acima de 34ms nos nove percursos da máscara.
Estes resultados não provam 60fps nem performance em mobile físico.

### Visual e regressões

Dez capturas: hero, experiência, hover, expansão e contacto em 1440px e 390px,
fontes carregadas, tempo da água fixado e animações CSS pausadas. A inspeção dos
pares desktop/experiência e mobile/hero não revelou mudança global de aspeto.
A comparação RGB não foi exata: diferença média por canal de 0,012–0,847 em 255,
e 3–301 píxeis por captura com diferença superior a 10 em algum canal. O hover
tem movimento residual; não se atribuem todas as diferenças à máscara. Não é o
teste Pixelmatch anterior nem uma aprovação visual final.

Typecheck, lint sem avisos, build Vite e testes UI passaram. Os testes cobrem
320/390/1024/1280/1440px, PT/EN, navegação, rato, expansão e preferências, incluindo
agora reduced motion isoladamente. O detector mecânico dos componentes alterados
não reportou ocorrências. Safari/Firefox não foram testados nesta retoma.

Artefactos temporários em `/tmp/opencode/`: builds `portfolio-reference` e
`portfolio-after`, scripts `compare-builds.mjs` e `check-material.mjs`, capturas
`material-*.png` e `ui-check/`. Podem desaparecer ao reiniciar.

### Próxima sessão

- Não considerar a fluidez totalmente resolvida: a mediana continua perto de 33ms.
- Validar visualmente a máscara com o utilizador e testar os fallbacks noutros
  motores. A otimização depende de um pai transparente filtrado sem outros filhos
  pintados; não generalizar a outros cartões.
- Manter os bloqueios em `release-review.md`. Sem commit, push, PR ou deploy
  nesta retoma; a navegação e disclosures da home original foram restaurados.
