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
    whatChanged: 'What changed',
    viewPullRequest: 'View pull request',
  },

  nav: {
    links: [
      { label: 'Internships', href: '#internships' },
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

  proof: {
    facts: [
      {
        value: '10k+',
        label: 'invoices a year through the system I built end to end at WEBA',
      },
      {
        value: '95%+',
        label: 'accuracy on the stadium occupancy models I built for the FPF',
      },
      {
        value: '1st',
        label: 'place overall at FEUP Engineering Days, 2026',
      },
    ],
    availability: 'Open to new challenges · Porto or remote',
  },

  internships: {
    title: 'Internships',
    product: 'The product',
    roles: [
      {
        org: 'WEBA',
        role: 'Software Engineer, summer internship',
        when: 'Jul 2026 – Sep 2026',
        status: 'Production-ready',
        summary:
          'A full-stack application that automates reading, extracting and managing invoice data. It combines QR codes with OCR to handle documents that arrive in different layouts and file formats.',
        ownership:
          'I was the only developer. The whole application is mine, from the first commit to the production deployment.',
        metrics: [
          { value: '10k+', label: 'invoices / year' },
          { value: '1', label: 'developer — me' },
          { value: 'Sep 2026', label: 'production-ready' },
        ],
        challenge:
          'Build a flow flexible enough to accept several file types, extract information from documents with different structures, and expose that data reliably in an application used by real clients.',
        did: [
          'Sole developer: Angular frontend and .NET backend, both written by me',
          'QR code reading and the OCR extraction pipeline across multiple document layouts',
          'Docker containerisation and the full CI/CD pipeline',
          'Production deployment and release',
        ],
        impact: [
          'Handles a flow of more than 10,000 invoices a year',
          'Left production-ready at the end of the internship, September 2026',
          'Built with direct mentoring from the company founder, who signed off on the result',
          'Removes manual data entry for invoices arriving in mixed formats',
        ],
        stack: ['Angular', '.NET', 'C#', 'Docker', 'CI/CD', 'OCR'],
      },
      {
        org: 'ARMIS Group',
        role: 'AI Engineer, curricular internship',
        when: 'Feb 2026 – Jul 2026',
        status: 'FPF',
        summary:
          'A ticketing sales intelligence tool for the Portuguese Football Federation: data analysis and predictive models behind an API, so the people running ticket sales can steer them with data instead of intuition.',
        ownership:
          'Embedded in a team of more than ten people. I owned the API and the predictive models behind it.',
        metrics: [
          { value: '95%+', label: 'occupancy forecast accuracy' },
          { value: '10+', label: 'people on the team' },
          { value: 'FPF', label: 'the client' },
        ],
        challenge:
          'Turn structured data and analytical results into something a business team can actually use, on an architecture that survives the jump from proof of concept to product.',
        did: [
          'RESTful API in ASP.NET Core, exposing the analysis to the product',
          'Data analysis in Python over historical ticketing data',
          'Predictive models forecasting stadium occupancy',
          'Azure SQL integration',
        ],
        impact: [
          'Occupancy forecasts above 95% accuracy',
          'Gives the sales side a data-backed read on each fixture instead of intuition',
          'Delivered for the Portuguese Football Federation',
        ],
        stack: ['Python', 'C#', 'ASP.NET Core', 'Azure SQL', 'ML'],
      },
    ],
  },

  contributions: {
    title: 'Open source',
    intro:
      'Finding the root cause in a codebase that is not mine, proposing the smallest fix that holds, and covering it with tests. Merged into projects with 60k and 10k stars.',
    listLabel: 'Latest contributions',
    items: [
      {
        repo: 'Ultralytics',
        pr: '#25873',
        href: 'https://github.com/ultralytics/ultralytics/pull/25873',
        what: 'NMS support for CoreML Segment and Pose exports.',
        diff: '+35 −41',
        detail: [
          'Enabled nms=True for segmentation and pose CoreML exports',
          'Kept masks and keypoints aligned after NMS, and fixed the padding in NMSModel',
          'Closed issue #25865, which I had opened',
        ],
      },
      {
        repo: 'Ultralytics',
        pr: '#25863',
        href: 'https://github.com/ultralytics/ultralytics/pull/25863',
        what: 'Aliasing fix in the augmentation config.',
        diff: '+11 −2',
        detail: [
          'Dataset construction was silently mutating a shared hyp config',
          'Root-cause analysis of a side effect on shared state',
          'Minimal fix, covered by a regression test',
        ],
      },
      {
        repo: 'Uno Platform',
        pr: '#24135',
        href: 'https://github.com/unoplatform/uno/pull/24135',
        what: 'Test coverage for VisualStateGroup transitions.',
        diff: '+137 −0',
        detail: [
          'Full transition selection, plus From-only and To-only matches',
          'Cases where no transition matches at all',
        ],
      },
    ],
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
        stack: 'Speech-to-text, LLMs, RAG, text-to-speech, Web Audio API',
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
        name: 'FEUP Engineering Days',
        kind: 'Competition, 1st place',
        when: '2026',
        summary:
          'First place overall among more than 200 participants, competing individually across a series of engineering challenges.',
        stack: 'Analysis, hands-on problem solving, working under time pressure',
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
          'A working electromechanical prototype designed, built and programmed from scratch in 24 hours.',
        stack: 'Arduino, electronics, prototyping',
        detail: [
          'I built the whole prototype myself: the woodwork, the circuit assembly and the Arduino firmware',
          'From reading the problem to design, build, programming and validation',
          'Hardware and software integrated under a 24-hour deadline',
        ],
      },
      {
        name: 'sergioalmeida.dev',
        kind: 'Personal project, this site',
        when: '2026',
        summary:
          'This site, self-hosted end to end. It runs on a repurposed laptop at home, reachable from the internet through a Cloudflare Tunnel, with separate staging and production environments — for €0 a month.',
        stack: 'React, TypeScript, Tailwind, Nginx, Cloudflare Tunnel, GitHub Actions',
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
        name: 'iaedu',
        kind: 'Personal project',
        when: '2026',
        summary:
          'AI study platform built on top of the free API my faculty provides. That endpoint only accepts text, so I put a router in front of it that turns a deliberately narrow API into a general-purpose one.',
        stack: 'Next.js, TypeScript, Prisma, Supabase, Vercel',
        detail: [
          'Router in front of a text-only endpoint: PDFs and images are extracted to text, audio is transcribed through an external API, so the same model handles input it was never exposed to',
          'Quality modes that pick the model automatically, instead of making the user choose',
          'Streaming chat over Server-Sent Events, with RAG over uploaded documents and web pages',
          'Conversation persistence and Google authentication',
          'SSRF protection on URL ingestion: localhost, private networks and 169.254.x.x all blocked',
          'Used daily through exam season, by me and by a handful of friends',
        ],
        links: [
          { label: 'Demo', href: 'https://iafeup.vercel.app' },
          { label: 'Code', href: 'https://github.com/SergioAlmeida29/ai_interface' },
        ],
      },
      {
        name: 'Prog-Project',
        kind: 'Academic project',
        when: '2025',
        summary:
          'PNG image processor in C++ with its own scripting language and a full test suite.',
        stack: 'C++17, CMake, sanitizers',
        detail: [
          'Polymorphic hierarchy over a Command abstraction, with a parser and an execution pipeline',
          'Around 70 test cases with pixel-by-pixel comparison against expected images',
          'AddressSanitizer and UndefinedBehaviorSanitizer wired into CMake',
          'Explicit ownership, manual memory management and documented leak fixes',
        ],
        links: [
          { label: 'Code', href: 'https://github.com/SergioAlmeida29/Prog-Project' },
        ],
      },
      {
        name: 'FiveM roleplay server',
        kind: 'Co-founder and developer',
        when: '2019 – 2023',
        summary:
          'Online community with custom backend systems, a database behind hundreds of player accounts, and more than 100 concurrent players.',
        stack: 'Lua, PHP, MySQL, Blender',
        detail: [
          'Designed the backend systems and the database holding hundreds of accounts and their persistent state',
          'Caching to keep queries fast with a hundred-plus players writing at once',
          'Wrote and integrated the server-side scripts, and managed the asset pipeline',
          'Ran the community side too: moderation, support and the team around it',
        ],
      },
    ],
  },

  skills: {
    title: 'Skills',
    tiers: [
      {
        label: 'Core — happy to go deep on these',
        items: 'Python, C#, ASP.NET Core, FastAPI, SQL, REST APIs, microservices',
        primary: true,
      },
      {
        label: 'AI and data',
        items: 'LLMs, RAG, predictive models, computer vision, YOLO, OCR, Pandas',
      },
      {
        label: 'Frontend',
        items: 'TypeScript, Angular, React, Next.js, Tailwind, Prisma',
      },
      {
        label: 'Infrastructure and quality',
        items:
          'Docker, CI/CD, GitHub Actions, Nginx, Cloudflare, PostgreSQL, Azure SQL, testing, sanitizers',
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
        note: 'Lead organiser of the XI Encontro Solidário de Tunas, with over a thousand people involved.',
      },
      {
        when: '2024 – Present',
        role: 'Technical support for events',
        org: 'FEUP',
        note: 'Setting up and running sound, video and lighting at faculty events.',
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
    extras: [
      'Tuna de Engenharia da U.Porto',
      'EBEC 2026, electromechanical prototype in 24h',
      'Technical support for events at FEUP',
      'FiveM server with over 100 concurrent players',
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
