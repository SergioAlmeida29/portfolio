import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const base = (process.env.BASE_URL ?? 'http://127.0.0.1:5173').replace(/\/+$/, '')
const home = new URL(`${base}/`).pathname
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--enable-unsafe-swiftshader'],
})

const aligned = (page, id) => page.waitForFunction(id => {
  const target = document.getElementById(id)
  const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 0
  return target && Math.abs(target.getBoundingClientRect().top - offset) < 8 &&
    document.querySelector('.nav-sections [aria-current]')?.getAttribute('href') === `#${id}`
}, id)

try {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion, locale: 'en-US' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    try {
      await page.goto(`${base}/#education`)
      await aligned(page, 'education')
      await page.evaluate(() => {
        window.anchorSamples = []
        window.addEventListener('click', () => {
          const sample = () => {
            window.anchorSamples.push(scrollY)
            if (window.anchorSamples.length < 20) requestAnimationFrame(sample)
          }
          requestAnimationFrame(sample)
        }, { once: true })
      })
      await page.locator('.nav-sections a[href="#work"]').click()
      await page.waitForFunction(() => window.anchorSamples.length === 20)
      if (reducedMotion === 'no-preference') {
        assert.ok(await page.evaluate(() => new Set(window.anchorSamples).size > 2), 'anchor clicks must keep progressive scrolling')
      }
      await aligned(page, 'work')
      assert.equal(new URL(page.url()).hash, '#work')
      await page.goBack()
      await aligned(page, 'education')
      await page.goForward()
      await aligned(page, 'work')
      await page.reload()
      await aligned(page, 'work')

      for (const route of ['missing-page', 'new', 'v1', 'v2', 'v3']) {
        await page.goto(`${base}/${route}`)
        await page.locator('main h1').waitFor()
        assert.equal(await page.locator('.hero').count(), 0, `${route}: unknown routes must show NotFound`)
        assert.equal(await page.locator('html').getAttribute('data-preview'), null)
        assert.deepEqual(await page.locator('header a[href*="#"]').evaluateAll(links => links.map(link => link.getAttribute('href'))),
          ['top', 'work', 'open-source', 'projects', 'contact'].map(id => `${home}#${id}`), '404 links must target the home base')
        await page.locator('header a').first().click()
        await page.locator('.hero h1').waitFor()
        assert.equal(new URL(page.url()).pathname, home)
      }
      await page.goto(`${base}/missing-page`)
      await page.locator(`header a[href="${home}#work"]`).click()
      await aligned(page, 'work')
      await page.goto(`${base}/index.html`)
      await page.locator('.hero h1').waitFor()
      await page.evaluate(() => document.fonts.ready)
      await page.waitForFunction(() => document.querySelectorAll('.nav-shell feDisplacementMap').length === 3)
      assert.equal(await page.locator('html').evaluate(el => el.classList.contains('lenis')), reducedMotion === 'no-preference')

      if (reducedMotion === 'no-preference') {
        await page.evaluate(() => {
          window.wheelSamples = []
          window.addEventListener('wheel', () => {
            const sample = () => {
              window.wheelSamples.push(scrollY)
              if (window.wheelSamples.length < 20) requestAnimationFrame(sample)
            }
            requestAnimationFrame(sample)
          }, { once: true, passive: true })
        })
        await page.mouse.move(1100, 700)
        await page.mouse.wheel(0, 600)
        await page.waitForFunction(() => window.wheelSamples.length === 20)
        const intermediate = await page.evaluate(() => window.wheelSamples.filter(y => y > 0 && y < 590))
        assert.ok(new Set(intermediate).size > 2, 'wheel scrolling must progress through intermediate positions')
        await page.waitForFunction(() => Math.abs(scrollY - 600) < 2)
      } else {
        assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).scrollBehavior), 'auto')
      }
      assert.deepEqual(errors, [], reducedMotion)
      console.log(`navigation ${reducedMotion}: anchors, history, 404 and scroll passed`)
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}
