# sergioalmeida.dev

Portfólio pessoal — SPA React com cena 3D (React Three Fiber) e scroll-jacking (GSAP).

## Stack

- **Build:** Vite
- **App:** React + TypeScript + react-router-dom
- **3D:** React Three Fiber + Drei
- **Animação:** GSAP + ScrollTrigger
- **Estilos:** Tailwind CSS

## Infraestrutura

Auto-alojado (Ubuntu Server) exposto via Cloudflare Tunnel. Nginx serve a build estática.
Deploy automático por GitHub Actions com runner self-hosted (push `dev` → staging, `main` → produção).

Ver `infra/` e `docs/` para as configs.

## Scripts

```bash
npm install
npm run dev            # servidor de desenvolvimento (localhost:5173)
npm run typecheck      # tsc -b
npm run lint           # oxlint
npm run build          # produção  -> dist/  (.env.production)
npm run build:staging  # staging   -> dist/  (.env.staging, robots.txt disallow-all)
npm run preview        # serve o dist/ localmente
```

## Ambientes

| Modo | Ficheiro env | `VITE_APP_ENV` | Destino |
|------|--------------|----------------|---------|
| `build` | `.env.production` | `production` | https://sergioalmeida.dev |
| `build:staging` | `.env.staging` | `staging` | https://staging.sergioalmeida.dev |
