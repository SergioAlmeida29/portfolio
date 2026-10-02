import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const base = (process.env.BASE_URL ?? 'http://127.0.0.1:5173').replace(/\/+$/, '')
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--enable-unsafe-swiftshader'],
})

async function compareGlassScreenshots(page, active, inactive) {
  return page.evaluate(async ({ active, inactive }) => {
    const load = (data) => new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = `data:image/png;base64,${data}`
    })
    const [activeImage, inactiveImage] = await Promise.all([load(active), load(inactive)])
    const width = Math.min(activeImage.naturalWidth, inactiveImage.naturalWidth)
    const height = Math.min(activeImage.naturalHeight, inactiveImage.naturalHeight)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('glass composition test requires a 2D canvas')
    context.drawImage(activeImage, 0, 0)
    const activePixels = context.getImageData(0, 0, width, height).data
    context.clearRect(0, 0, width, height)
    context.drawImage(inactiveImage, 0, 0)
    const inactivePixels = context.getImageData(0, 0, width, height).data
    let changed = 0
    let total = 0
    let maximum = 0
    for (let index = 0; index < activePixels.length; index += 4) {
      const delta = Math.abs(activePixels[index] - inactivePixels[index]) +
        Math.abs(activePixels[index + 1] - inactivePixels[index + 1]) +
        Math.abs(activePixels[index + 2] - inactivePixels[index + 2])
      total += delta
      maximum = Math.max(maximum, delta)
      if (delta > 12) changed++
    }
    const pixels = width * height
    return { changedRatio: changed / pixels, meanDelta: total / (pixels * 3), maximum }
  }, { active: active.toString('base64'), inactive: inactive.toString('base64') })
}

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto(`${base}/`)
  const brand = page.locator('.nav-brand')
  await brand.focus()
  await page.evaluate(() => { window.originalBrand = document.querySelector('.nav-brand') })
  await page.waitForFunction(() => document.querySelectorAll('.nav-shell feDisplacementMap').length === 3)
  assert.ok(await page.evaluate(() => document.activeElement === window.originalBrand && window.originalBrand.isConnected),
    'deferred material must preserve the focused navigation node')

  await page.evaluate(() => {
    const backdrop = document.createElement('div')
    backdrop.dataset.glassCompositionTest = 'true'
    Object.assign(backdrop.style, {
      position: 'fixed',
      zIndex: '30',
      inset: '0 0 auto',
      height: '150px',
      pointerEvents: 'none',
      background: 'repeating-linear-gradient(90deg, #fff 0 10px, #000 10px 20px)',
      color: '#f00',
      font: '700 38px sans-serif',
      lineHeight: '72px',
      letterSpacing: '6px',
      whiteSpace: 'nowrap',
    })
    backdrop.textContent = 'RGB GLASS TEST RGB GLASS TEST RGB GLASS TEST'
    document.body.append(backdrop)
  })
  await page.waitForTimeout(150)
  const shell = page.locator('.nav-shell')
  const material = shell.locator('.glass-material')
  const shellBox = await shell.boundingBox()
  assert.ok(shellBox, 'navigation shell must have a box for the composition test')
  const clip = {
    x: Math.floor(shellBox.x),
    y: Math.floor(shellBox.y),
    width: Math.ceil(shellBox.width),
    height: Math.ceil(shellBox.height),
  }
  const activeScreenshot = await page.screenshot({ clip })
  await material.evaluate((element) => {
    element.style.backdropFilter = 'none'
    element.style.webkitBackdropFilter = 'none'
  })
  await page.waitForTimeout(100)
  const inactiveScreenshot = await page.screenshot({ clip })
  const composition = await compareGlassScreenshots(page, activeScreenshot, inactiveScreenshot)
  await material.evaluate((element) => {
    element.style.removeProperty('backdrop-filter')
    element.style.removeProperty('-webkit-backdrop-filter')
  })
  assert.ok(composition.changedRatio > 0.08 && composition.meanDelta > 1,
    `navigation material must change the composed backdrop (changed ${composition.changedRatio.toFixed(3)}, mean ${composition.meanDelta.toFixed(2)})`)
  await page.evaluate(() => document.querySelector('[data-glass-composition-test]')?.remove())

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
