import assert from 'node:assert/strict'
import { chromium, firefox, webkit } from 'playwright'

const base = (process.env.BASE_URL ?? 'http://127.0.0.1:5173').replace(/\/+$/, '')
const routes = ['/']

for (const [name, engine, options] of [
  ['chromium-no-webgl', chromium, { executablePath: process.env.CHROME_PATH || undefined, args: ['--disable-webgl'] }],
  ['firefox', firefox, {}],
  ['webkit', webkit, {}],
]) {
  const browser = await engine.launch(options)
  try {
    for (const route of routes) {
      for (const reducedMotion of ['no-preference', 'reduce']) {
        const label = `${name} ${route} ${reducedMotion}`
        const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion, locale: 'en-US' })
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        page.on('console', message => {
          if (message.type() === 'error') errors.push(message.text())
        })
        try {
          assert.equal((await page.goto(`${base}${route}`))?.status(), 200, `${label}: response`)
          await page.locator('.hero h1').waitFor()
          await page.evaluate(() => document.fonts.ready)
          assert.equal(await page.locator('html').getAttribute('data-preview'), 'liquid-glass', label)
          if (name === 'chromium-no-webgl') {
            assert.equal(await page.evaluate(() => document.createElement('canvas').getContext('webgl')), null, label)
            assert.equal(await page.locator('html').getAttribute('data-water'), 'fallback', label)
            assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el, '::before').display), 'block', `${label}: static background fallback`)
          }
          assert.equal(await page.locator('[data-empty-backdrop]').count(), 4, `${label}: fallback cards`)
          assert.ok(await page.locator('[data-empty-backdrop]').evaluateAll(panels => panels.every(panel => {
            const style = getComputedStyle(panel)
            return (style.backdropFilter || style.webkitBackdropFilter || 'none') !== 'none'
          })), `${label}: native frost remains available`)
          if (name !== 'chromium-no-webgl') {
            assert.ok(await page.locator('[data-empty-backdrop] > [data-lg-layer]:nth-child(2)').evaluateAll(layers =>
              layers.length === 4 && layers.every(layer => getComputedStyle(layer).display === 'none'),
            ), `${label}: unsupported refraction uses native fallback`)
          }
          const button = page.locator('#work button[aria-expanded]').first()
          await button.scrollIntoViewIfNeeded()
          await button.focus()
          await page.keyboard.press('Enter')
          assert.equal(await button.getAttribute('aria-expanded'), 'true', `${label}: keyboard disclosure`)
          if (reducedMotion === 'reduce') {
            const panelId = await button.getAttribute('aria-controls')
            assert.ok(await page.evaluate(async id => {
              await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
              const panel = document.getElementById(id)
              return panel && Number(getComputedStyle(panel).opacity) === 1 &&
                panel.clientHeight >= panel.scrollHeight - 1 && panel.clientHeight > 0
            }, panelId), `${label}: disclosure must reach its final size immediately with reduced motion`)
          }
          for (const id of ['work', 'open-source', 'projects', 'skills', 'education', 'contact']) {
            await page.locator(`#${id}`).scrollIntoViewIfNeeded()
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${label}: overflow at ${id}`)
          }
          if (process.env.SCREENSHOT_DIR) {
            await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/${name}-${routes.indexOf(route)}-${reducedMotion}.png` })
          }
          assert.deepEqual(errors, [], label)
          console.log(`${label}: passed`)
        } finally {
          await page.close()
        }
      }
    }
  } finally {
    await browser.close()
  }
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--enable-unsafe-swiftshader'],
})
try {
  for (const route of routes) {
    const page = await browser.newPage()
    try {
      // Keep inline bootstrap and built CSS, but never execute application modules.
      await page.route('**/*', request => request.request().resourceType() === 'script'
        ? request.fulfill({ contentType: 'application/javascript', body: '' })
        : request.continue())
      assert.equal((await page.goto(`${base}${route}`))?.status(), 200, `${route}: early response`)
      assert.equal(await page.locator('#root').evaluate(el => el.childElementCount), 0, 'app JS must not execute')
      assert.equal(await page.locator('html').getAttribute('data-preview'), 'liquid-glass', `${route}: early route marker`)
      const displays = await page.evaluate(() => [document.documentElement, document.body].flatMap(el =>
        ['::before', '::after'].map(pseudo => getComputedStyle(el, pseudo).display),
      ))
      assert.deepEqual(displays, ['none', 'none', 'none', 'none'], `${route}: early background: ${displays}`)
    } finally {
      await page.close()
    }
  }

  for (const route of routes) {
    const page = await browser.newPage({ reducedMotion: 'no-preference' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text())
    })
    try {
      await page.addInitScript(() => {
        const original = WebGLRenderingContext.prototype.drawArrays
        window.waterProbe = { draws: 0, attempts: 0, gl: null, restored: false }
        WebGLRenderingContext.prototype.drawArrays = function (...args) {
          if (this.canvas.isConnected) window.waterProbe.attempts++
          const result = original.apply(this, args)
          if (this.canvas.isConnected && !this.isContextLost()) {
            window.waterProbe.gl = this
            window.waterProbe.draws++
          }
          return result
        }
      })
      assert.equal((await page.goto(`${base}${route}`))?.status(), 200, `${route}: lifecycle response`)
      await page.locator('.hero h1').waitFor()
      await page.waitForFunction(() => document.documentElement.dataset.water === 'gl' && window.waterProbe.draws > 1)
      assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el, '::before').display), 'none', `${route}: WebGL replaces static background`)
      const button = page.locator('#work button[aria-expanded]').first()
      await button.scrollIntoViewIfNeeded()
      await button.click()
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.waitForTimeout(150)
      const stopped = await page.evaluate(() => window.waterProbe.draws)
      await page.waitForTimeout(250)
      assert.equal(await page.evaluate(() => window.waterProbe.draws), stopped, `${route}: live reduced motion stops water drawing`)
      assert.equal(await button.getAttribute('aria-expanded'), 'true', 'motion preference must not remount content')
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      await page.waitForFunction(draws => window.waterProbe.draws > draws, stopped)
      await page.evaluate(() => {
        const probe = window.waterProbe
        probe.extension = probe.gl.getExtension('WEBGL_lose_context')
        if (!probe.extension) throw new Error('WEBGL_lose_context is required for the recovery test')
        probe.gl.canvas.addEventListener('webglcontextrestored', () => { probe.restored = true }, { once: true })
        probe.extension.loseContext()
      })
      await page.waitForFunction(() => window.waterProbe.gl.isContextLost() && document.documentElement.dataset.water !== 'gl')
      const lost = await page.evaluate(() => window.waterProbe.draws)
      const attempts = await page.evaluate(() => window.waterProbe.attempts)
      await page.waitForTimeout(250)
      assert.equal(await page.evaluate(() => window.waterProbe.draws), lost, 'lost context must not draw')
      assert.equal(await page.evaluate(() => window.waterProbe.attempts), attempts, 'lost context must not attempt drawing')
      await page.evaluate(() => window.waterProbe.extension.restoreContext())
      await page.waitForFunction(draws => window.waterProbe.restored && window.waterProbe.draws > draws && document.documentElement.dataset.water === 'gl', lost)
      assert.ok(await page.evaluate(() => {
        const gl = window.waterProbe.gl
        const program = gl.getParameter(gl.CURRENT_PROGRAM)
        return program && gl.getProgramParameter(program, gl.LINK_STATUS) && gl.getError() === gl.NO_ERROR
      }), `${route}: restored context must have a valid linked program`)
      assert.equal(await button.getAttribute('aria-expanded'), 'true', 'context recovery must not remount content')

      const client = await page.context().newCDPSession(page)
      await client.send('Emulation.setEmulatedMedia', { features: [
        { name: 'prefers-reduced-motion', value: 'reduce' },
        { name: 'prefers-reduced-transparency', value: 'reduce' },
      ] })
      await page.locator('.now-card[data-opaque]').waitFor()
      const panels = page.locator('.liquid-panel, .glass, .glass-panel, .glass-nav, .glass-soft')
      assert.ok(await panels.count() > 0, `${route}: transparency check must cover panels`)
      await page.waitForFunction(() => Array.from(document.querySelectorAll('.liquid-panel, .glass, .glass-panel, .glass-nav, .glass-soft')).every((el) => {
        const style = getComputedStyle(el)
        return style.backdropFilter === 'none' && style.webkitBackdropFilter === 'none'
      }), undefined, { timeout: 5000 })
      assert.ok(await panels.evaluateAll(elements => elements.every(el => {
        const style = getComputedStyle(el)
        return style.backdropFilter === 'none' && style.webkitBackdropFilter === 'none'
      })),
        `${route}: reduced transparency disables backdrop filtering on all panels`)
      assert.equal(await button.getAttribute('aria-expanded'), 'true', 'transparency preference must not remount content')
      assert.deepEqual(errors, [], `${route}: water lifecycle`)
      console.log(`${route}: early background and water lifecycle passed`)
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}
