import type { SiteContent } from './types'

export const en: SiteContent = {
  meta: {
    description:
      'Sérgio Almeida — software engineer focused on backend and AI. Informatics and Computing Engineering student at FEUP, Porto. Open to new challenges.',
    ogDescription:
      'Software engineer focused on backend and AI. FEUP student, Porto.',
  },

  ui: {
    skipToContent: 'Skip to content',
    open: 'Open',
    close: 'Close',
    backToTop: 'Back to top',
    detail: 'Detail',
    whatIDid: 'What I did',
    result: 'Result',
  },

  nav: {
    links: [
      { label: 'Work experience', href: '#work' },
      { label: 'Open source', href: '#open-source' },
      { label: 'Projects', href: '#projects' },
    ],
    contact: 'Contact',
    cv: 'CV',
  },

  hero: {
    eyebrow: 'Software engineer · Porto',
    lede: 'I build backend systems and AI products, from the first prototype to deployment.',
    primaryCta: 'See my work',
    cvCta: 'Download CV',
    contactCta: 'Contact',
  },

  now: {
    title: 'This week',
    window: 'last 7 days on GitHub',
    commits: 'commits',
    pullRequests: 'pull requests',
    issues: 'issues',
    reposLabel: 'Mostly in',
    status: 'Final year of my BSc · open to new opportunities',
    updated: 'Updated',
    unavailable: 'Activity not available at build time.',
  },


  internships: {
    title: 'Work experience',
    product: 'The product',
    roles: [
      {
        org: 'WEBA',
        role: 'Software Engineer, summer internship',
        when: 'Jul 2026 – Sep 2026',
        summary:
          'Full-stack app that reads invoice data automatically, combining QR codes with OCR across mixed layouts and file formats.',
        mine: 'Sole developer, from the first commit to the production deployment.',
        stack: ['Angular', '.NET', 'C#', 'Docker', 'CI/CD', 'OCR'],
        challenge:
          'Accept several file types, extract information from documents with different structures, and expose that data reliably to real clients.',
        did: [
          'Angular frontend and .NET backend, both written by me',
          'QR code reading and the OCR extraction pipeline across multiple document layouts',
          'Docker containerisation and the full CI/CD pipeline',
          'Production deployment and release',
        ],
        impact: [
          'Handles a flow of more than 10,000 invoices a year',
          'Left production-ready at the end of the internship',
          'Removes manual data entry for invoices arriving in mixed formats',
        ],
        metrics: [
          { value: '10k+', label: 'invoices / year' },
          { value: '1', label: 'developer' },
          { value: 'Sep 2026', label: 'in production' },
        ],
      },
      {
        org: 'ARMIS Group',
        role: 'AI Engineer, curricular internship',
        when: 'Feb 2026 – Jul 2026',
        summary:
          'Ticketing sales intelligence for the Portuguese Football Federation: predictive models behind an API.',
        mine: 'One of a team of ten. The API and the models were mine.',
        stack: ['Python', 'C#', 'ASP.NET Core', 'Azure SQL', 'ML'],
        challenge:
          'Turn analytical results into something a business team can use, on an architecture that survives the jump from proof of concept to product.',
        did: [
          'RESTful API in ASP.NET Core, exposing the analysis to the product',
          'Data analysis in Python over historical ticketing data',
          'Predictive models forecasting stadium occupancy',
          'Azure SQL integration',
        ],
        impact: [
          'Occupancy forecasts above 95% accuracy',
          'Gives the sales side a data-backed read on each fixture',
          'Delivered for the Portuguese Football Federation',
        ],
        metrics: [
          { value: '95%+', label: 'forecast accuracy' },
          { value: '10+', label: 'people on the team' },
          { value: 'FPF', label: 'the client' },
        ],
      },
    ],
  },

  contributions: {
    title: 'Open source',
    listLabel: 'Last contributions merged',
    merged: 'merged',
    more: 'More on GitHub',
    moreHref: 'https://github.com/SergioAlmeida29',
  },

  projects: {
    title: 'Projects and competitions',
    items: [
      {
        name: 'Voice assistant for blind users',
        kind: 'AI Critical Challenge, 2nd place',
        when: '2025',
        summary:
          'Real-time voice assistant built at the AI Critical Challenge, run by Critical Software and AEFEUP. Speech in, an LLM and retrieval in the middle, speech out — built in under a week.',
        stack: ['Speech-to-text', 'LLMs', 'RAG', 'text-to-speech', 'Web Audio API'],
        detail: [
          'Second place with a team of two, against teams of five. I built the whole system; my teammate handled the documentation',
          'Speech to text, interpretation by an LLM, retrieval through RAG, and the answer converted back to speech',
          'Several APIs integrated into one system, fast enough to hold a natural conversation',
          'Real-time audio visualiser with no libraries: AudioContext and AnalyserNode with a 256-point FFT driving a Canvas animation, plus echo cancellation, noise suppression and automatic gain control',
          '€500 prize. The challenge application is private; the public repository is the frontend extracted from it',
        ],
        links: [
          { label: 'Frontend demo', href: 'https://sergioalmeida29.github.io/Critical-FrontEnd/' },
          { label: 'Frontend code', href: 'https://github.com/SergioAlmeida29/Critical-FrontEnd' },
        ],
      },
      {
        name: 'sergioalmeida.dev',
        kind: 'Personal project, this site',
        when: '2026',
        summary:
          'This site, self-hosted end to end. It runs on a repurposed laptop at home, reachable from the internet through a Cloudflare Tunnel, with separate staging and production environments — for €0 a month.',
        stack: ['React', 'TypeScript', 'Tailwind', 'Nginx', 'Cloudflare Tunnel', 'GitHub Actions'],
        detail: [
          'Self-hosted on a repurposed Acer laptop: no cloud bill, full control of the stack',
          'Cloudflare Tunnel in front of Nginx, with no ports exposed to the internet',
          'main to production and dev to staging behind Cloudflare Access, with atomic deploys from GitHub Actions',
          'Accessibility as a requirement: keyboard navigation, visible focus, reduced-motion support',
        ],
        links: [
          { label: 'Code', href: 'https://github.com/SergioAlmeida29/portfolio' },
        ],
      },
      {
        name: 'FiveM roleplay server',
        kind: 'Co-founder and developer',
        when: '2019 – 2023',
        summary:
          'Online community with custom backend systems, a database behind hundreds of player accounts, and more than 100 concurrent players.',
        stack: ['Lua', 'PHP', 'MySQL', 'Blender'],
        detail: [
          'Designed the backend systems and the database holding hundreds of accounts and their persistent state',
          'Caching to keep queries fast with a hundred-plus players writing at once',
          'Wrote and integrated the server-side scripts, and managed the asset pipeline',
          'Ran the community side too: moderation, support and the team around it',
        ],
      },
      {
        name: 'iaedu',
        kind: 'Personal project',
        when: '2026',
        summary:
          'My faculty gives students an AI endpoint that only takes text in and gives text out. I built a router in front of it that turns it into a general-purpose one — tools, images, context and reasoning effort included.',
        stack: ['Next.js', 'TypeScript', 'Prisma', 'Supabase', 'Vercel'],
        detail: [
          'A frontier model API does a lot more than answer: tool calling, context management, token budgets, model selection, reasoning effort. The faculty endpoint does none of it. The router adds all of it on top of plain text in, plain text out',
          'Tool calling on an endpoint that has no notion of tools — enough that a coding agent can be pointed at it',
          'Images and PDFs are extracted to text, audio is transcribed through an external API, so the model handles input it was never exposed to',
          'Effort levels that turn one question into several passes, instead of making the user pick a model',
          'Streaming chat over Server-Sent Events, with RAG over uploaded documents and web pages',
          'SSRF protection on URL ingestion: localhost, private networks and 169.254.x.x all blocked',
          'Used daily through exam season, by me and by a handful of friends',
        ],
        links: [
          { label: 'Demo', href: 'https://iafeup.vercel.app' },
          { label: 'Code', href: 'https://github.com/SergioAlmeida29/ai_interface' },
        ],
      },
      {
        name: 'FEUP Engineering Days',
        kind: 'Competition, 1st place',
        when: '2026',
        summary:
          'First place overall among more than 200 participants, competing individually across a series of engineering challenges.',
        stack: ['Analysis', 'hands-on problem solving', 'working under time pressure'],
        detail: [
          'More than 200 participants, competing individually rather than in teams',
          'Successive challenges of different kinds, from hands-on field problems to engineering and problem solving',
          'Judged by panels from several industry companies',
          'First place in the overall standings',
        ],
      },
      {
        name: 'EBEC',
        kind: 'European competition',
        when: '2026',
        summary:
          'A robot that picks objects off a track and clears them, designed, built and programmed from scratch in 24 hours.',
        stack: ['Arduino', 'ultrasonic sensors', 'electronics', 'woodwork'],
        detail: [
          'Team competition: 24 hours from reading the problem to a robot that ran',
          'Everything by hand, from cutting the wood to assembling the circuit and writing the Arduino firmware',
          'Parts and sensors had to be bought with a fixed budget of points, so every sensor was a trade-off rather than a free choice',
          'Ultrasonic sensors for distance, driving the pick-up logic',
        ],
      },
    ],
  },

  skills: {
    title: 'Skills',
    groups: [
      {
        label: 'Backend',
        items: ['Python', 'C#', 'ASP.NET Core', 'FastAPI', 'SQL', 'REST APIs', 'microservices'],
      },
      {
        label: 'Frontend',
        items: ['TypeScript', 'Angular', 'React', 'Next.js', 'Tailwind', 'Prisma'],
      },
      {
        label: 'AI and data',
        items: ['LLMs', 'RAG', 'predictive models', 'computer vision', 'YOLO', 'OCR', 'Pandas'],
      },
      {
        label: 'Infrastructure',
        items:
          ['Docker', 'CI/CD', 'GitHub Actions', 'Nginx', 'Cloudflare', 'PostgreSQL', 'Azure SQL', 'testing', 'sanitizers'],
      },
    ],
  },

  education: {
    title: 'Education',
    rows: [
      {
        when: '2023 – 2027 (expected)',
        role: 'BSc in Informatics and Computing Engineering',
        org: 'FEUP',
        note: 'Programming, data structures, software engineering, databases and image processing.',
      },
      {
        when: '2023 – Present',
        role: 'Member',
        org: 'Tuna de Engenharia da U.Porto',
        note: 'Lead organiser of the XI Encontro Solidário de Tunas.',
        detail: [
          'Lead organiser of the XI Encontro Solidário de Tunas, with over a thousand people involved',
          'Budget, logistics and sponsors, coordinated with the groups taking part',
          'Years of performing live, which is where I learned to hold a room',
        ],
      },
      {
        when: '2024 – Present',
        role: 'Technical support for events',
        org: 'FEUP',
        note: 'Sound, video and lighting at faculty events.',
        detail: [
          'Setting up and operating sound, video and lighting at faculty events',
          'Live operation, where a problem has to be solved while the room is watching',
          'From small talks to full auditoriums',
        ],
      },
    ],
    languagesLabel: 'Languages',
    languages: [
      'Portuguese — native',
      'English — C1, professional working proficiency',
    ],
  },

  about: {
    title: 'About',
    headline:
      'I have shipped a product alone, end to end, and I have shipped inside a team of ten. The engineering that matters is the same: understand the constraint, find the smallest change that holds, and prove it.',
    body: [
      'Informatics and Computing Engineering student at FEUP, focused on backend, artificial intelligence and data. At WEBA I was the only developer on an invoice automation product: I wrote the Angular frontend, the .NET backend, the OCR pipeline, the Docker setup and the CI/CD, and left it production-ready. At ARMIS I was one of more than ten people building ticketing intelligence for the Portuguese Football Federation, where the API and the predictive models were mine.',
      'Those two internships taught me opposite lessons: owning every decision, and fitting into decisions already made. Open source taught me a third one. In Ultralytics and Uno Platform I work in codebases that are not mine, where the only acceptable change is the smallest one you can defend with a test.',
      'What I want next is to stay close to that seam: backend systems where an API, a model and a real user meet.',
    ],
  },

  notFound: {
    code: 'Error 404',
    title: 'Page not found',
    back: 'Back to home',
  },

  contact: {
    heading: "Let's talk.",
    email: 'sergioalmeida29.05@gmail.com',
    cv: 'Download CV',
    location: 'Porto, Portugal. Open to new challenges.',
  },
}
