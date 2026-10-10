import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const base = (process.env.BASE_URL ?? 'http://127.0.0.1:5173').replace(/\/+$/, '')
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--enable-unsafe-swiftshader'],
})

try {
  for (const mode of ['loaded', 'timeout', 'reduced']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' })
    let releaseFonts
    const fonts = new Promise(resolve => { releaseFonts = resolve })
    await page.route('**/*.woff2', async route => { await fonts; await route.continue() })
    try {
      await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' })
      await page.locator('.hero h1').waitFor()
      await page.waitForTimeout(250)
      if (mode === 'reduced') {
        assert.equal(await page.locator('.hero h1 .will-change-transform').count(), 0)
        assert.equal(await page.locator('.hero-lede').evaluate(element => getComputedStyle(element).opacity), '1', 'reduced motion must expose content while fonts are pending')
        continue
      }
      assert.ok(await page.locator('.hero h1 .will-change-transform').evaluateAll(words => words.every(word =>
        word.getAnimations().length === 0 && new DOMMatrixReadOnly(getComputedStyle(word).transform).m42 >= word.offsetHeight,
      )), 'the name must wait for fonts before starting its entrance')
      if (mode === 'loaded') releaseFonts()
      await page.waitForFunction(() => [...document.querySelectorAll('.hero h1 .will-change-transform')].every(word =>
        word.getAnimations().some(animation => animation.effect.getKeyframes().some(frame => frame.transform)),
      ))
      assert.equal(await page.evaluate(() => document.fonts.status), mode === 'loaded' ? 'loaded' : 'loading')
      await page.waitForFunction(() => [...document.querySelectorAll('.hero h1 .will-change-transform')].every(word =>
        Math.abs(new DOMMatrixReadOnly(getComputedStyle(word).transform).m42) < 0.01,
      ), undefined, { timeout: 5000 })
      console.log(`loading ${mode}: native entrance completes`)
    } finally {
      releaseFonts()
      await page.unrouteAll({ behavior: 'wait' })
      await page.close()
    }
  }
} finally {
  await browser.close()
}
