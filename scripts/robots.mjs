import { writeFileSync } from 'node:fs'

const path = new URL('../dist/robots.txt', import.meta.url)
writeFileSync(path, 'User-agent: *\nDisallow: /\n')
console.log('robots.txt -> Disallow: / (staging)')
