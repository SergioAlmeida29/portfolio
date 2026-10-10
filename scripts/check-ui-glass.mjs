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

const readMapPixels = (map) => map.evaluate(async (element) => {
  const image = new Image()
  image.src = element.getAttribute('href')
  await image.decode()
  return image.naturalWidth * image.naturalHeight
})

const readCentralVariation = (map) => map.evaluate(async (element) => {
  const image = new Image()
  image.src = element.getAttribute('href')
  await image.decode()
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0)
  const start = Math.floor(canvas.height / 4)
  const pixels = context.getImageData(Math.floor(canvas.width / 4), start, 1, Math.floor(canvas.height / 2)).data
  const red = Array.from(pixels).filter((_, index) => index % 4 === 0)
  return Math.max(...red) - Math.min(...red)
})

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.addInitScript(() => {
    window.panelMapCount = 0
    const createImageData = CanvasRenderingContext2D.prototype.createImageData
    CanvasRenderingContext2D.prototype.createImageData = function (...args) {
      const image = createImageData.apply(this, args)
      if (image.width === 512 && image.height === 512) window.panelMapCount++
      return image
    }
  })
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
  // Captura com glass-material activo (tint + SVG filter + blur)
  const activeScreenshot = await page.screenshot({ clip })
  // Esconder o glass-material por completo via opacity: 0.
  // Desligar propriedades individuais (backdropFilter, filter) não é fiável porque:
  // a) a lib pode aplicar o filtro SVG noutro elemento não encontrado por querySelectorAll
  // b) o --glass-tint do CSS não é um inline style e não seria desligado
  // Com opacity: 0 o material desaparece todo, expondo o backdrop de contraste por baixo,
  // o que produz uma diferença de pixéis grande e estável mesmo em SwiftShader headless.
  await material.evaluate((element) => { element.style.opacity = '0' })
  await page.waitForTimeout(100)
  const inactiveScreenshot = await page.screenshot({ clip })
  await material.evaluate((element) => { element.style.removeProperty('opacity') })
  const composition = await compareGlassScreenshots(page, activeScreenshot, inactiveScreenshot)
  assert.ok(composition.changedRatio > 0.10 && composition.meanDelta > 2,
    `navigation material must visibly cover the backdrop (changed ${composition.changedRatio.toFixed(3)}, mean ${composition.meanDelta.toFixed(2)})`)
  assert.equal(await shell.evaluate((element) => getComputedStyle(element).clipPath), 'none',
    'navigation shell must not clip the backdrop filter')
  const filter = await material.evaluate((element) => element.style.backdropFilter)
  assert.match(filter, /url\(/, 'navigation material must use the SVG refraction filter')
  await material.evaluate((element) => {
    element.style.backdropFilter = element.style.backdropFilter.replace(/url\([^)]*\)/, '')
  })
  await page.waitForTimeout(100)
  const plainScreenshot = await page.screenshot({ clip })
  await material.evaluate((element, value) => { element.style.backdropFilter = value }, filter)
  const refraction = await compareGlassScreenshots(page, activeScreenshot, plainScreenshot)
  assert.ok(refraction.changedRatio > 0.03 && refraction.meanDelta > 1,
    `navigation must visibly refract the backdrop (changed ${refraction.changedRatio.toFixed(3)}, mean ${refraction.meanDelta.toFixed(2)})`)
  await page.evaluate(() => document.querySelector('[data-glass-composition-test]')?.remove())

  const disclosure = page.locator('#work button[aria-expanded]').first()
  await disclosure.scrollIntoViewIfNeeded()
  const panelMask = page.locator('#work [data-liquid-glass="empty-backdrop"] > [data-lg-layer]').nth(1)
  await page.waitForFunction(() => {
    const mask = document.querySelector('#work [data-liquid-glass="empty-backdrop"] > [data-lg-layer]:nth-child(2)')
    return mask && getComputedStyle(mask).maskImage.includes('data:image/png')
  })
  await page.waitForTimeout(400)
  const closedMask = await panelMask.evaluate(element => element.style.maskImage)
  await page.evaluate(() => { window.panelMapCount = 0 })
  await disclosure.click()
  await page.waitForTimeout(100)
  assert.equal(await panelMask.evaluate(element => getComputedStyle(element).visibility), 'visible',
    'the existing reflection must remain visible during expansion')
  await page.waitForFunction(previous => {
    const mask = document.querySelector('#work [data-liquid-glass="empty-backdrop"] > [data-lg-layer]:nth-child(2)')
    return mask && mask.style.maskImage !== previous && getComputedStyle(mask).visibility === 'visible'
  }, closedMask)
  assert.equal(await page.evaluate(() => window.panelMapCount), 1,
    'expansion must generate one final mask instead of a mask on every animation frame')
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
  const map = page.locator('.nav-shell feImage')
  const mobileMap = await map.getAttribute('href')
  assert.ok(await readMapPixels(map) <= 65536, 'mobile navigation must respect the displacement map pixel budget')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.waitForFunction(async previous => {
    const source = document.querySelector('.nav-shell feImage')?.getAttribute('href')
    if (!source?.startsWith('data:image/png') || source === previous) return false
    const image = new Image()
    image.src = source
    await image.decode()
    return image.naturalWidth * image.naturalHeight <= 65536
  }, mobileMap)
  assert.ok(await readMapPixels(map) <= 65536, 'desktop navigation must respect the displacement map pixel budget')
  assert.ok(await readCentralVariation(map) <= 1, 'horizontal refraction must stay constant across the central band without a crease')
  const desktopMap = await map.getAttribute('href')
  await page.mouse.wheel(0, 400)
  await page.waitForTimeout(250)
  assert.equal(await map.getAttribute('href'), desktopMap, 'scroll must not regenerate the navigation map')
  console.log('glass: deferred material and transparency preserve DOM, focus, scroll and state')
} finally {
  await browser.close()
}
