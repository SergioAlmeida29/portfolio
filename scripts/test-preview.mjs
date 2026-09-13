import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { preview } from 'vite'

const [base = '/', outDir = 'dist', script = 'scripts/check-ui.mjs'] = process.argv.slice(2)
const server = await preview({
  base,
  build: { outDir },
  preview: { host: '127.0.0.1', port: Number(process.env.PORT ?? 4173), strictPort: true },
})
const url = server.resolvedUrls.local[0]
console.log(`Preview: ${url}`)

try {
  const test = spawn(process.execPath, [script], {
    stdio: 'inherit',
    env: { ...process.env, BASE_URL: url },
  })
  const [code] = await once(test, 'exit')
  process.exitCode = code ?? 1
} finally {
  await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()))
}
