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
Deploy automático por GitHub Actions com runner self-hosted em push para `main`.

Ver `infra/` para as configs.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # gera dist/
```
