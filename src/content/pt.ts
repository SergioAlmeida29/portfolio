import type { SiteContent } from './types'

export const pt: SiteContent = {
  meta: {
    description:
      'Sérgio Almeida — software engineer focado em backend e inteligência artificial. Estudante de Engenharia Informática e Computação na FEUP, Porto. Aberto a novos desafios.',
    ogDescription:
      'Software engineer focado em backend e inteligência artificial. Estudante na FEUP, Porto.',
  },

  ui: {
    skipToContent: 'Saltar para o conteúdo',
    open: 'Abrir',
    close: 'Fechar',
    backToTop: 'Voltar ao topo',
    detail: 'Detalhe',
    whatIDid: 'O que fiz',
    result: 'Resultado',
    whatChanged: 'O que mudou',
    viewPullRequest: 'Ver pull request',
  },

  nav: {
    links: [
      { label: 'Estágios', href: '#internships' },
      { label: 'Open source', href: '#open-source' },
      { label: 'Projetos', href: '#projects' },
    ],
    contact: 'Contacto',
    cv: 'CV',
  },

  hero: {
    eyebrow: 'Software engineer · Porto',
    lede: 'Construo sistemas backend e produtos com inteligência artificial, do primeiro protótipo ao deployment.',
    primaryCta: 'Ver trabalho',
    cvCta: 'Descarregar CV',
    contactCta: 'Contacto',
  },

  proof: {
    facts: [
      {
        value: '10k+',
        label: 'faturas por ano no sistema que construí de raiz na WEBA',
      },
      {
        value: '95%+',
        label: 'de precisão nos modelos de lotação que construí para a FPF',
      },
      {
        value: '1.º',
        label: 'lugar geral nos FEUP Engineering Days, 2026',
      },
    ],
    availability: 'Aberto a novos desafios · Porto ou remoto',
  },

  internships: {
    title: 'Estágios',
    product: 'O produto',
    roles: [
      {
        org: 'WEBA',
        role: 'Software Engineer, estágio de verão',
        when: 'Jul 2026 – Set 2026',
        status: 'Pronto para produção',
        summary:
          'Aplicação full-stack que automatiza a leitura, extração e gestão de dados de faturas. Combina QR codes e OCR para processar documentos que chegam em estruturas e formatos diferentes.',
        ownership:
          'Fui o único developer. A aplicação inteira é minha, do primeiro commit ao deployment em produção.',
        metrics: [
          { value: '10k+', label: 'faturas / ano' },
          { value: '1', label: 'developer — eu' },
          { value: 'Set 2026', label: 'pronto para produção' },
        ],
        challenge:
          'Criar um fluxo suficientemente flexível para receber vários tipos de ficheiro, extrair informação de documentos com estruturas diferentes e disponibilizar os dados de forma fiável numa aplicação usada por clientes reais.',
        did: [
          'Único developer: frontend em Angular e backend em .NET, ambos escritos por mim',
          'Leitura de QR codes e pipeline de extração por OCR sobre vários tipos de documento',
          'Containerização com Docker e todo o pipeline de CI/CD',
          'Deployment e colocação em produção',
        ],
        impact: [
          'Suporta um fluxo de mais de 10 000 faturas por ano',
          'Ficou pronto para produção no final do estágio, em setembro de 2026',
          'Desenvolvido com acompanhamento direto do fundador da empresa, que aprovou o resultado',
          'Elimina a introdução manual de dados de faturas em formatos mistos',
        ],
        stack: ['Angular', '.NET', 'C#', 'Docker', 'CI/CD', 'OCR'],
      },
      {
        org: 'ARMIS Group',
        role: 'AI Engineer, estágio curricular',
        when: 'Fev 2026 – Jul 2026',
        status: 'FPF',
        summary:
          'Ferramenta de ticketing sales intelligence para a Federação Portuguesa de Futebol: análise de dados e modelos preditivos por trás de uma API, para quem gere a venda de bilhetes decidir com dados em vez de intuição.',
        ownership:
          'Integrado numa equipa de mais de dez pessoas. A API e os modelos preditivos por trás dela eram meus.',
        metrics: [
          { value: '95%+', label: 'de precisão na previsão de lotação' },
          { value: '10+', label: 'pessoas na equipa' },
          { value: 'FPF', label: 'o cliente' },
        ],
        challenge:
          'Transformar dados estruturados e resultados analíticos em algo que uma equipa de negócio consegue mesmo usar, com uma arquitetura que aguentasse a passagem de prova de conceito a produto.',
        did: [
          'API RESTful em ASP.NET Core, a expor a análise ao produto',
          'Análise de dados em Python sobre o histórico de vendas de bilhetes',
          'Modelos preditivos para a lotação do estádio',
          'Integração com Azure SQL',
        ],
        impact: [
          'Previsões de lotação com mais de 95% de precisão',
          'Dá a quem vende uma leitura de cada jogo apoiada em dados, em vez de intuição',
          'Entregue para a Federação Portuguesa de Futebol',
        ],
        stack: ['Python', 'C#', 'ASP.NET Core', 'Azure SQL', 'ML'],
      },
    ],
  },

  contributions: {
    title: 'Open source',
    intro:
      'Encontrar a causa raiz numa codebase que não é minha, propor a correção mínima que se sustenta e cobri-la com testes. Integradas em projetos com 60 mil e 10 mil estrelas.',
    listLabel: 'Últimas contribuições',
    items: [
      {
        repo: 'Ultralytics',
        pr: '#25873',
        href: 'https://github.com/ultralytics/ultralytics/pull/25873',
        what: 'Suporte de NMS em exports CoreML de Segment e Pose.',
        diff: '+35 −41',
        detail: [
          'Ativou nms=True em exports CoreML de segmentação e pose',
          'Manteve máscaras e keypoints alinhados depois do NMS, e corrigiu o padding no NMSModel',
          'Fechou o issue #25865, aberto por mim',
        ],
      },
      {
        repo: 'Ultralytics',
        pr: '#25863',
        href: 'https://github.com/ultralytics/ultralytics/pull/25863',
        what: 'Correção de aliasing na configuração de augmentations.',
        diff: '+11 −2',
        detail: [
          'A construção de datasets alterava em silêncio uma configuração hyp partilhada',
          'Análise de causa raiz num efeito lateral sobre estado partilhado',
          'Correção mínima, coberta por um teste de regressão',
        ],
      },
      {
        repo: 'Uno Platform',
        pr: '#24135',
        href: 'https://github.com/unoplatform/uno/pull/24135',
        what: 'Cobertura de testes para transições em VisualStateGroup.',
        diff: '+137 −0',
        detail: [
          'Seleção de transições completas, e transições apenas com From ou apenas com To',
          'Situações em que nenhuma transição corresponde',
        ],
      },
    ],
    more: 'Mais no GitHub',
    moreHref: 'https://github.com/SergioAlmeida29',
  },

  projects: {
    title: 'Projetos e competições',
    items: [
      {
        name: 'Assistente por voz para invisuais',
        kind: 'AI Critical Challenge, 2.º lugar',
        when: '2025',
        summary:
          'Assistente por voz em tempo real, construído no AI Critical Challenge, organizado pela Critical Software e pela AEFEUP. Voz à entrada, um LLM e recuperação pelo meio, voz à saída — feito em menos de uma semana.',
        stack: 'Speech-to-text, LLMs, RAG, text-to-speech, Web Audio API',
        detail: [
          'Segundo lugar com uma equipa de dois, contra equipas de cinco. Construí o sistema inteiro; o meu colega tratou da documentação',
          'Voz para texto, interpretação por LLM, recuperação por RAG, e a resposta convertida de volta para voz',
          'Várias APIs integradas num sistema coerente e rápido o suficiente para conversa natural',
          'Visualizador de áudio em tempo real sem bibliotecas: AudioContext e AnalyserNode com FFT de 256 a alimentar uma animação em Canvas, mais echo cancellation, noise suppression e automatic gain control',
          'Prémio de 500 euros. A aplicação do desafio é privada; o repositório público é o frontend extraído dela',
        ],
        links: [
          { label: 'Demo do frontend', href: 'https://sergioalmeida29.github.io/Critical-FrontEnd/' },
          { label: 'Código do frontend', href: 'https://github.com/SergioAlmeida29/Critical-FrontEnd' },
        ],
      },
      {
        name: 'FEUP Engineering Days',
        kind: 'Competição, 1.º lugar',
        when: '2026',
        summary:
          'Primeiro lugar geral entre mais de 200 participantes, a competir individualmente numa série de desafios de engenharia.',
        stack: 'Análise, resolução prática de problemas, trabalho sob pressão',
        detail: [
          'Mais de 200 participantes, a competir individualmente e não em equipa',
          'Desafios sucessivos de naturezas diferentes, de problemas práticos de terreno a engenharia e resolução de problemas',
          'Avaliação por júris de várias empresas da indústria',
          'Primeiro lugar na classificação geral',
        ],
      },
      {
        name: 'EBEC',
        kind: 'Competição europeia',
        when: '2026',
        summary:
          'Protótipo eletromecânico funcional concebido, construído e programado de raiz em 24 horas.',
        stack: 'Arduino, eletrónica, prototipagem',
        detail: [
          'Construí o protótipo todo sozinho: a madeira, a montagem do circuito e o firmware do Arduino',
          'Da interpretação do problema ao desenho, construção, programação e validação',
          'Hardware e software integrados sob um prazo de 24 horas',
        ],
      },
      {
        name: 'sergioalmeida.dev',
        kind: 'Projeto pessoal, este site',
        when: '2026',
        summary:
          'Este site, self-hosted de ponta a ponta. Corre num portátil reaproveitado em casa, acessível a partir da internet por um Cloudflare Tunnel, com ambientes de staging e produção separados — a 0 € por mês.',
        stack: 'React, TypeScript, Tailwind, Nginx, Cloudflare Tunnel, GitHub Actions',
        detail: [
          'Self-hosted num portátil Acer reaproveitado: sem fatura de cloud e com controlo total do stack',
          'Cloudflare Tunnel à frente do Nginx, sem portas expostas à internet',
          'main para produção e dev para staging atrás de Cloudflare Access, com deploys atómicos por GitHub Actions',
          'Acessibilidade como requisito: navegação por teclado, foco visível, suporte a reduced-motion',
        ],
        links: [
          { label: 'Código', href: 'https://github.com/SergioAlmeida29/portfolio' },
        ],
      },
      {
        name: 'iaedu',
        kind: 'Projeto pessoal',
        when: '2026',
        summary:
          'Plataforma de estudo com IA construída sobre a API gratuita que a faculdade disponibiliza. Esse endpoint só aceita texto, por isso pus um router à frente dele que transforma uma API propositadamente estreita numa API de uso geral.',
        stack: 'Next.js, TypeScript, Prisma, Supabase, Vercel',
        detail: [
          'Router à frente de um endpoint só de texto: PDFs e imagens são extraídos para texto e o áudio é transcrito por uma API externa, para o mesmo modelo aceitar input a que nunca foi exposto',
          'Modos de qualidade que escolhem o modelo automaticamente, em vez de obrigar o utilizador a escolher',
          'Chat em streaming por Server-Sent Events, com RAG sobre documentos carregados e páginas web',
          'Persistência de conversas e autenticação com Google',
          'Proteção contra SSRF na ingestão de URLs: bloqueio de localhost, redes privadas e 169.254.x.x',
          'Usado diariamente na época de exames, por mim e por alguns amigos',
        ],
        links: [
          { label: 'Demo', href: 'https://iafeup.vercel.app' },
          { label: 'Código', href: 'https://github.com/SergioAlmeida29/ai_interface' },
        ],
      },
      {
        name: 'Prog-Project',
        kind: 'Projeto académico',
        when: '2025',
        summary:
          'Processador de imagens PNG em C++ com uma linguagem de scripts própria e uma bateria de testes.',
        stack: 'C++17, CMake, sanitizers',
        detail: [
          'Hierarquia polimórfica sobre uma abstração Command, com parser e pipeline de execução',
          'Cerca de 70 casos de teste com comparação pixel a pixel contra imagens esperadas',
          'AddressSanitizer e UndefinedBehaviorSanitizer configurados em CMake',
          'Ownership explícito, gestão manual de memória e correção de leaks documentada',
        ],
        links: [
          { label: 'Código', href: 'https://github.com/SergioAlmeida29/Prog-Project' },
        ],
      },
      {
        name: 'Servidor de roleplay FiveM',
        kind: 'Cofundador e developer',
        when: '2019 – 2023',
        summary:
          'Comunidade online com sistemas backend próprios, uma base de dados por trás de centenas de contas de jogador, e mais de 100 jogadores em simultâneo.',
        stack: 'Lua, PHP, MySQL, Blender',
        detail: [
          'Desenho dos sistemas backend e da base de dados com centenas de contas e o respetivo estado persistente',
          'Caching para manter as queries rápidas com mais de cem jogadores a escrever ao mesmo tempo',
          'Desenvolvimento e integração dos scripts do servidor, e gestão do pipeline de assets',
          'Gestão da comunidade também: moderação, apoio e a equipa à volta',
        ],
      },
    ],
  },

  skills: {
    title: 'Competências',
    tiers: [
      {
        label: 'Base — defendo estas a fundo',
        items: 'Python, C#, ASP.NET Core, FastAPI, SQL, APIs REST, microserviços',
        primary: true,
      },
      {
        label: 'IA e dados',
        items: 'LLMs, RAG, modelos preditivos, computer vision, YOLO, OCR, Pandas',
      },
      {
        label: 'Frontend',
        items: 'TypeScript, Angular, React, Next.js, Tailwind, Prisma',
      },
      {
        label: 'Infraestrutura e qualidade',
        items:
          'Docker, CI/CD, GitHub Actions, Nginx, Cloudflare, PostgreSQL, Azure SQL, testes, sanitizers',
      },
    ],
  },

  education: {
    title: 'Formação',
    rows: [
      {
        when: '2023 – 2027 (previsão)',
        role: 'Licenciatura em Engenharia Informática e Computação',
        org: 'FEUP',
        note: 'Programação, estruturas de dados, engenharia de software, bases de dados e processamento de imagem.',
      },
      {
        when: '2023 – Presente',
        role: 'Membro',
        org: 'Tuna de Engenharia da U.Porto',
        note: 'Organizador principal do XI Encontro Solidário de Tunas, com mais de mil pessoas envolvidas.',
      },
      {
        when: '2024 – Presente',
        role: 'Apoio técnico a eventos',
        org: 'FEUP',
        note: 'Montagem e operação de som, imagem e iluminação em eventos da faculdade.',
      },
    ],
    languagesLabel: 'Idiomas',
    languages: [
      'Português — nativo',
      'Inglês — C1, professional working proficiency',
    ],
  },

  about: {
    title: 'Sobre',
    headline:
      'Já entreguei um produto sozinho, de ponta a ponta, e já entreguei dentro de uma equipa de dez. A engenharia que interessa é a mesma: perceber a restrição, encontrar a menor mudança que se aguenta, e prová-la.',
    body: [
      'Estudante de Engenharia Informática e Computação na FEUP, com foco em backend, inteligência artificial e dados. Na WEBA fui o único developer de um produto de automação de faturas: escrevi o frontend em Angular, o backend em .NET, o pipeline de OCR, o Docker e o CI/CD, e deixei-o pronto para produção. Na ARMIS fui uma de mais de dez pessoas a construir ticketing intelligence para a Federação Portuguesa de Futebol, onde a API e os modelos preditivos eram meus.',
      'Estes dois estágios ensinaram-me lições opostas: ser dono de todas as decisões, e encaixar em decisões já tomadas. O open source ensinou-me uma terceira. Na Ultralytics e na Uno Platform trabalho em codebases que não são minhas, onde a única mudança aceitável é a mais pequena que se consegue defender com um teste.',
      'O que quero a seguir é continuar nessa costura: sistemas backend onde uma API, um modelo e um utilizador real se encontram.',
    ],
    extras: [
      'Tuna de Engenharia da U.Porto',
      'EBEC 2026, protótipo eletromecânico em 24h',
      'Apoio técnico a eventos na FEUP',
      'Servidor FiveM com mais de 100 jogadores em simultâneo',
    ],
  },

  notFound: {
    code: 'Erro 404',
    title: 'Página não encontrada',
    back: 'Voltar ao início',
  },

  contact: {
    heading: 'Vamos falar.',
    email: 'sergioalmeida29.05@gmail.com',
    cv: 'Descarregar CV',
    location: 'Porto, Portugal. Aberto a novos desafios.',
  },
}
