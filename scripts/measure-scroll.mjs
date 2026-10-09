import { chromium } from 'playwright'

// Use production preview URLs and run alone: other browser workloads skew timings.
const normalize = url => url.replace(/\/+$/, '')
const base = normalize(process.env.BASE_URL ?? 'http://127.0.0.1:4173')
const targets = [['before', base]]
if (process.env.COMPARE_URL) targets.push(['after', normalize(process.env.COMPARE_URL)])
const runs = Number(process.env.RUNS ?? 3)
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: process.env.HARDWARE ? ['--enable-gpu', '--use-angle=gl'] : ['--enable-unsafe-swiftshader'],
})
const session = await browser.newBrowserCDPSession()
const { gpu } = await session.send('SystemInfo.getInfo')
const results = []
try {
  // Warm each build's shaders before collecting comparable samples.
  for (const [, url] of targets) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await page.goto(`${url}/`)
    await page.waitForTimeout(2500)
    await page.close()
  }
  for (let run = 0; run < runs; run++) {
    for (const [label, url] of targets) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US' })
      await page.addInitScript(() => {
        window.__work = { maps: 0, pngMs: 0, imageBytes: 0, rects: 0, longMs: 0, longCount: 0 }
        const toDataURL = HTMLCanvasElement.prototype.toDataURL
        HTMLCanvasElement.prototype.toDataURL = function (...args) {
          const start = performance.now()
          const result = toDataURL.apply(this, args)
          window.__work.maps++
          window.__work.pngMs += performance.now() - start
          return result
        }
        const toBlob = HTMLCanvasElement.prototype.toBlob
        HTMLCanvasElement.prototype.toBlob = function (callback, ...args) {
          const start = performance.now()
          return toBlob.call(this, blob => {
            window.__work.maps++
            window.__work.pngMs += performance.now() - start
            callback(blob)
          }, ...args)
        }
        const createImageData = CanvasRenderingContext2D.prototype.createImageData
        CanvasRenderingContext2D.prototype.createImageData = function (...args) {
          const image = createImageData.apply(this, args)
          window.__work.imageBytes += image.data.byteLength
          return image
        }
        const getRect = Element.prototype.getBoundingClientRect
        Element.prototype.getBoundingClientRect = function (...args) {
          window.__work.rects++
          return getRect.apply(this, args)
        }
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            window.__work.longMs += entry.duration
            window.__work.longCount++
          }
        }).observe({ type: 'longtask', buffered: true })
      })
      const client = await page.context().newCDPSession(page)
      await client.send('Performance.enable')
      await page.goto(`${url}/`)
      await page.locator('.hero h1').waitFor()
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1600)
      for (const region of process.env.REGIONS?.split(',') ?? ['top', 'bottom', 'expand']) {
        if (region === 'bottom') await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight - innerHeight - 800, behavior: 'instant' }))
        if (region === 'expand') await page.locator('#work button[aria-expanded]').first().scrollIntoViewIfNeeded()
        await page.waitForTimeout(700)
        await page.evaluate(() => { window.__work = { maps: 0, pngMs: 0, imageBytes: 0, rects: 0, longMs: 0, longCount: 0 } })
        const before = (await client.send('Performance.getMetrics')).metrics
        const recording = page.evaluate(() => new Promise(resolve => {
          const frames = []
          const start = performance.now()
          let previous = start
          function sample(now) {
            frames.push(now - previous)
            previous = now
            if (now - start < 2400) requestAnimationFrame(sample)
            else {
              frames.shift()
              const ordered = [...frames].sort((a, b) => a - b)
              resolve({ frames: frames.length, p50: ordered[Math.floor(ordered.length * .5)], p95: ordered[Math.floor(ordered.length * .95)], over34ms: frames.filter(value => value > 34).length, ...window.__work })
            }
          }
          requestAnimationFrame(sample)
        }))
        if (region === 'expand') await page.locator('#work button[aria-expanded]').first().click()
        else {
          for (const delta of [300, 250, 250]) {
            await page.mouse.wheel(0, delta)
            await page.waitForTimeout(400)
          }
        }
        const measured = await recording
        const after = (await client.send('Performance.getMetrics')).metrics
        for (const metric of ['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration', 'LayoutCount', 'RecalcStyleCount']) {
          measured[metric] = after.find(x => x.name === metric).value - before.find(x => x.name === metric).value
        }
        results.push({ run: run + 1, label, url, region, ...measured })
      }
      await page.close()
    }
  }
  console.log(JSON.stringify({ renderer: gpu.auxAttributes.glRenderer, features: gpu.featureStatus, results }, null, 2))
} finally {
  await browser.close()
}
