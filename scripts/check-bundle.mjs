import { readdirSync, readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const assets = new URL('../dist/assets/', import.meta.url)
const totals = { js: 0, css: 0 }
const limits = { js: 180 * 1024, css: 15 * 1024 }

for (const file of readdirSync(assets)) {
  const type = file.endsWith('.js') ? 'js' : file.endsWith('.css') ? 'css' : null
  if (type) totals[type] += gzipSync(readFileSync(new URL(file, assets))).length
}

for (const type of ['js', 'css']) {
  const size = (totals[type] / 1024).toFixed(1)
  const limit = limits[type] / 1024
  console.log(`${type.toUpperCase()}: ${size} / ${limit} KiB gzip`)
  if (!totals[type] || totals[type] > limits[type]) process.exitCode = 1
}
