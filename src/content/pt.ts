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
  },

  nav: {
    links: [
      { label: 'Experiência', href: '#work' },
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

  now: {
    title: 'Esta semana',
    window: 'últimos 7 dias no GitHub',
    commits: 'commits',
    pullRequests: 'pull requests',
    issues: 'issues',
    reposLabel: 'Sobretudo em',
    status: 'Último ano da licenciatura · aberto a novas oportunidades',
    updated: 'Atualizado a',
    unavailable: 'Atividade indisponível no momento do build.',
  },


  internships: {
    title: 'Experiência profissional',
    product: 'O produto',
    roles: [
      {
        org: 'WEBA',
        role: 'Software Engineer, estágio de verão',
        when: 'Jul 2026 – Set 2026',
        summary:
          'Aplicação full-stack que lê dados de faturas automaticamente, combinando QR codes e OCR em estruturas e formatos diferentes.',
        mine: 'Único developer, do primeiro commit ao deployment em produção.',
        stack: ['Angular', '.NET', 'C#', 'Docker', 'CI/CD', 'OCR'],
        challenge:
          'Aceitar vários tipos de ficheiro, extrair informação de documentos com estruturas diferentes e disponibilizá-la de forma fiável a clientes reais.',
        did: [
          'Frontend em Angular e backend em .NET, ambos escritos por mim',
          'Leitura de QR codes e pipeline de extração por OCR sobre vários tipos de documento',
          'Containerização com Docker e todo o pipeline de CI/CD',
          'Deployment e colocação em produção',
        ],
        impact: [
          'Suporta um fluxo de mais de 10 000 faturas por ano',
          'Ficou pronto para produção no final do estágio',
          'Elimina a introdução manual de dados de faturas em formatos mistos',
        ],
        metrics: [
          { value: '10k+', label: 'faturas / ano' },
          { value: '1', label: 'developer' },
          { value: 'Set 2026', label: 'em produção' },
        ],
      },
      {
        org: 'ARMIS Group',
        role: 'AI Engineer, estágio curricular',
        when: 'Fev 2026 – Jul 2026',
        summary:
          'Ticketing sales intelligence para a Federação Portuguesa de Futebol: modelos preditivos por trás de uma API.',
        mine: 'Um numa equipa de dez. A API e os modelos eram meus.',
        stack: ['Python', 'C#', 'ASP.NET Core', 'Azure SQL', 'ML'],
        challenge:
          'Transformar resultados analíticos em algo que uma equipa de negócio usa, com uma arquitetura que aguenta a passagem de prova de conceito a produto.',
        did: [
          'API RESTful em ASP.NET Core, a expor a análise ao produto',
          'Análise de dados em Python sobre o histórico de vendas de bilhetes',
          'Modelos preditivos para a lotação do estádio',
          'Integração com Azure SQL',
        ],
        impact: [
          'Previsões de lotação com mais de 95% de precisão',
          'Dá a quem vende uma leitura de cada jogo apoiada em dados',
          'Entregue para a Federação Portuguesa de Futebol',
        ],
        metrics: [
          { value: '95%+', label: 'de precisão' },
          { value: '10+', label: 'pessoas na equipa' },
          { value: 'FPF', label: 'o cliente' },
        ],
      },
    ],
  },

  contributions: {
    title: 'Open source',
    listLabel: 'Últimas contribuições integradas',
    merged: 'merged',
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
        stack: ['Speech-to-text', 'LLMs', 'RAG', 'text-to-speech', 'Web Audio API'],
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
        name: 'sergioalmeida.dev',
        kind: 'Projeto pessoal, este site',
        when: '2026',
        summary:
          'Este site, self-hosted de ponta a ponta. Corre num portátil reaproveitado em casa, acessível a partir da internet por um Cloudflare Tunnel, com ambientes de staging e produção separados — a 0 € por mês.',
        stack: ['React', 'TypeScript', 'Tailwind', 'Nginx', 'Cloudflare Tunnel', 'GitHub Actions'],
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
        name: 'Servidor de roleplay FiveM',
        kind: 'Cofundador e developer',
        when: '2019 – 2023',
        summary:
          'Comunidade online com sistemas backend próprios, uma base de dados por trás de centenas de contas de jogador, e mais de 100 jogadores em simultâneo.',
        stack: ['Lua', 'PHP', 'MySQL', 'Blender'],
        detail: [
          'Desenho dos sistemas backend e da base de dados com centenas de contas e o respetivo estado persistente',
          'Caching para manter as queries rápidas com mais de cem jogadores a escrever ao mesmo tempo',
          'Desenvolvimento e integração dos scripts do servidor, e gestão do pipeline de assets',
          'Gestão da comunidade também: moderação, apoio e a equipa à volta',
        ],
      },
      {
        name: 'iaedu',
        kind: 'Projeto pessoal',
        when: '2026',
        summary:
          'A faculdade dá aos alunos um endpoint de IA que só aceita texto e só devolve texto. Construí um router à frente dele que o transforma num endpoint completo — com ferramentas, imagens, gestão de contexto e níveis de esforço.',
        stack: ['Next.js', 'TypeScript', 'Prisma', 'Supabase', 'Vercel'],
        detail: [
          'A API de um modelo de fronteira faz muito mais do que responder: chama ferramentas, gere contexto, gere orçamento de tokens, escolhe modelo, define esforço de raciocínio. O endpoint da faculdade não faz nada disso. O router acrescenta tudo isso por cima de texto a entrar e texto a sair',
          'Chamada de ferramentas num endpoint que não tem noção do que é uma ferramenta — ao ponto de se lhe poder apontar um agente de código',
          'Imagens e PDFs são extraídos para texto e o áudio é transcrito por uma API externa, para o modelo receber aquilo a que nunca foi exposto',
          'Níveis de esforço que transformam uma pergunta em várias passagens, em vez de obrigar o utilizador a escolher modelo',
          'Chat em streaming por Server-Sent Events, com RAG sobre documentos carregados e páginas web',
          'Proteção contra SSRF na ingestão de URLs: localhost, redes privadas e 169.254.x.x bloqueados',
          'Usado todos os dias na época de exames, por mim e por um punhado de amigos',
        ],
        links: [
          { label: 'Demo', href: 'https://iafeup.vercel.app' },
          { label: 'Código', href: 'https://github.com/SergioAlmeida29/ai_interface' },
        ],
      },
      {
        name: 'FEUP Engineering Days',
        kind: 'Competição, 1.º lugar',
        when: '2026',
        summary:
          'Primeiro lugar geral entre mais de 200 participantes, a competir individualmente numa série de desafios de engenharia.',
        stack: ['Análise', 'resolução prática de problemas', 'trabalho sob pressão'],
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
          'Um robô que apanha objetos numa pista e retira-os, desenhado, construído e programado de raiz em 24 horas.',
        stack: ['Arduino', 'sensores ultrassónicos', 'eletrónica', 'madeira'],
        detail: [
          'Competição em equipa: 24 horas entre ler o problema e ter um robô a andar',
          'Tudo feito à mão, do corte da madeira à montagem do circuito e ao firmware em Arduino',
          'As peças e os sensores compravam-se com um orçamento fixo de pontos, por isso cada sensor era uma escolha com custo, e não uma opção livre',
          'Sensores ultrassónicos para medir distância, a comandar a lógica de recolha',
        ],
      },
    ],
  },

  skills: {
    title: 'Competências',
    groups: [
      {
        label: 'Backend',
        items: ['Python', 'C#', 'ASP.NET Core', 'FastAPI', 'SQL', 'APIs REST', 'microserviços'],
      },
      {
        label: 'Frontend',
        items: ['TypeScript', 'Angular', 'React', 'Next.js', 'Tailwind', 'Prisma'],
      },
      {
        label: 'IA e dados',
        items: ['LLMs', 'RAG', 'modelos preditivos', 'computer vision', 'YOLO', 'OCR', 'Pandas'],
      },
      {
        label: 'Infraestrutura',
        items:
          ['Docker', 'CI/CD', 'GitHub Actions', 'Nginx', 'Cloudflare', 'PostgreSQL', 'Azure SQL', 'testes', 'sanitizers'],
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
        note: 'Organizador principal do XI Encontro Solidário de Tunas.',
        detail: [
          'Organizador principal do XI Encontro Solidário de Tunas, com mais de mil pessoas envolvidas',
          'Orçamento, logística e patrocínios, coordenados com os grupos participantes',
          'Anos a atuar ao vivo, que é onde se aprende a segurar uma sala',
        ],
      },
      {
        when: '2024 – Presente',
        role: 'Apoio técnico a eventos',
        org: 'FEUP',
        note: 'Som, imagem e iluminação em eventos da faculdade.',
        detail: [
          'Montagem e operação de som, imagem e iluminação em eventos da faculdade',
          'Operação ao vivo, onde um problema tem de se resolver com a sala a assistir',
          'De pequenas sessões a auditórios cheios',
        ],
      },
    ],
    languagesLabel: 'Idiomas',
    languages: [
      'Português — nativo',
      'Inglês — C1, fluente em contexto profissional',
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
