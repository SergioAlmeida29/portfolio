import { chromium } from 'playwright'

// Local laboratory samples, not field Core Web Vitals. Run without other browser tests.
const targets = [['before', process.env.BASE_URL ?? 'http://127.0.0.1:4173']]
if (process.env.COMPARE_URL) targets.push(['after', process.env.COMPARE_URL])
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: process.env.HARDWARE ? ['--enable-gpu', '--use-angle=gl'] : ['--enable-unsafe-swiftshader'],
})
const results = []
try {
  const session = await browser.newBrowserCDPSession()
  const { gpu } = await session.send('SystemInfo.getInfo')
  for (let run = 0; run < Number(process.env.RUNS ?? 3); run++) {
    for (const width of [1440, 390]) {
      for (const [label, url] of run % 2 ? [...targets].reverse() : targets) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, locale: 'en-US' })
        try {
          const page = await context.newPage()
          const client = await context.newCDPSession(page)
          await client.send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.CPU_RATE ?? 1) })
          await page.addInitScript(() => {
            window.loadProbe = { maps: 0, pngMs: 0, imageBytes: 0, longMs: 0, lcpCandidateMs: 0, layoutShiftSum: 0 }
            const encode = HTMLCanvasElement.prototype.toDataURL
            HTMLCanvasElement.prototype.toDataURL = function (...args) {
              const start = performance.now()
              const value = encode.apply(this, args)
              window.loadProbe.maps++
              window.loadProbe.pngMs += performance.now() - start
              return value
            }
            const create = CanvasRenderingContext2D.prototype.createImageData
            CanvasRenderingContext2D.prototype.createImageData = function (...args) {
              const image = create.apply(this, args)
              window.loadProbe.imageBytes += image.data.byteLength
              return image
            }
            for (const type of ['longtask', 'largest-contentful-paint', 'layout-shift']) {
              new PerformanceObserver(list => {
                for (const entry of list.getEntries()) {
                  if (type === 'longtask') window.loadProbe.longMs += entry.duration
                  if (type === 'largest-contentful-paint') window.loadProbe.lcpCandidateMs = entry.startTime
                  if (type === 'layout-shift' && !entry.hadRecentInput) window.loadProbe.layoutShiftSum += entry.value
                }
              }).observe({ type, buffered: true })
            }
          })
          for (const cache of ['cold', 'warm']) {
            if (cache === 'cold') await page.goto(`${url}/new`)
            else await page.reload()
            await page.locator('.hero h1').waitFor()
            await page.evaluate(() => document.fonts.ready)
            await page.waitForTimeout(2000)
            results.push({ run: run + 1, label, width, cache, ...await page.evaluate(() => {
              const resources = performance.getEntriesByType('resource').filter(entry => entry.name.startsWith(location.origin))
              const navigation = performance.getEntriesByType('navigation')[0]
              return {
                ...window.loadProbe,
                fcpMs: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
                transferBytes: navigation.transferSize + resources.reduce((sum, entry) => sum + entry.transferSize, 0),
                resources: resources.map(entry => ({ url: new URL(entry.name).pathname, transferBytes: entry.transferSize })),
              }
            }) })
          }
        } finally {
          await context.close()
        }
      }
    }
  }
  console.log(JSON.stringify({ renderer: gpu.auxAttributes.glRenderer, cpuRate: Number(process.env.CPU_RATE ?? 1), results }, null, 2))
} finally {
  await browser.close()
}
