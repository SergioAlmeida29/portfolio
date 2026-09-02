// Corre depois de `vite build --mode staging`: substitui o robots.txt
// da build por um que bloqueia toda a indexação.
// (Belt-and-braces: o nginx de staging já envia X-Robots-Tag: noindex
// e o site está atrás de Cloudflare Access.)
import { writeFileSync } from 'node:fs'

const path = new URL('../dist/robots.txt', import.meta.url)
writeFileSync(path, 'User-agent: *\nDisallow: /\n')
console.log('robots.txt -> Disallow: / (staging)')
