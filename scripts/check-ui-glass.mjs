import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const base = (process.env.BASE_URL ?? 'http://127.0.0.1:5173').replace(/\/+$/, '')
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--enable-unsafe-swiftshader'],
})

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.addInitScript(() => {
    const callbacks = new Map()
    let nextId = 0
    window.requestIdleCallback = callback => {
      callbacks.set(++nextId, callback)
      return nextId
    }
    window.cancelIdleCallback = id => callbacks.delete(id)
    window.releaseIdle = () => {
      for (const callback of callbacks.values()) callback({ didTimeout: false, timeRemaining: () => 50 })
      callbacks.clear()
    }
  })
  await page.goto(`${base}/`)
  const brand = page.locator('.nav-brand')
  await brand.focus()
  await page.evaluate(() => { window.originalBrand = document.querySelector('.nav-brand') })
  await page.evaluate(() => window.releaseIdle())
  await page.waitForFunction(() => document.querySelectorAll('.nav-shell feDisplacementMap').length === 3)
  assert.ok(await page.evaluate(() => document.activeElement === window.originalBrand && window.originalBrand.isConnected),
    'deferred material must preserve the focused navigation node')

  const disclosure = page.locator('#work button[aria-expanded]').first()
  await disclosure.click()
  await page.locator('.nav-sections a[href="#education"]').focus()
  await page.evaluate(() => {
    window.originalLink = document.activeElement
    window.originalStrip = document.querySelector('.nav-sections')
    window.stripScroll = window.originalStrip.scrollLeft
    window.originalDisclosure = document.querySelector('#work button[aria-expanded]')
  })
  const client = await page.context().newCDPSession(page)
  for (const value of ['reduce', 'no-preference']) {
    await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value }] })
    await page.waitForFunction(reduced => document.querySelector('.nav-shell').hasAttribute('data-opaque') === reduced, value === 'reduce')
    assert.ok(await page.evaluate(() => document.activeElement === window.originalLink && window.originalLink.isConnected),
      `${value}: transparency must preserve keyboard focus`)
    assert.ok(await page.evaluate(() => document.querySelector('.nav-sections') === window.originalStrip &&
      Math.abs(window.originalStrip.scrollLeft - window.stripScroll) < 1), `${value}: navigation scroll must be preserved`)
    assert.ok(await page.evaluate(() => window.originalDisclosure.isConnected && window.originalDisclosure.getAttribute('aria-expanded') === 'true'),
      `${value}: disclosure identity and state must be preserved`)
  }
  console.log('glass: deferred material and transparency preserve DOM, focus, scroll and state')
} finally {
  await browser.close()
}
