import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const base = (process.env.BASE_URL ?? 'http://127.0.0.1:5173').replace(/\/+$/, '')
const prBase = /^\/pr\/\d+\/?$/.test(new URL(base).pathname)
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--enable-unsafe-swiftshader'],
})
const errors = []
const reports = []
const sectionIds = ['work', 'open-source', 'projects', 'skills', 'education', 'contact']
const save = async (page, name) => {
  if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/${name}.png` })
}

try {
  for (const [width, height] of [[1280, 800], [1440, 900], [1024, 800], [390, 844], [320, 740]]) {
    const previousErrors = errors.length
    const page = await browser.newPage({ viewport: { width, height }, locale: 'en-US' })
    page.on('pageerror', error => errors.push(`${width}: ${error.message}`))
    assert.equal((await page.goto(`${base}/`))?.status(), 200, `${width}: root response`)
    await page.locator('.hero h1').waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1300)
    assert.equal(await page.locator('.nav-progress, .preview-switcher').count(), 0)
    assert.equal(await page.locator('html').getAttribute('data-preview'), 'liquid-glass')
    assert.deepEqual(await page.locator('.nav-sections a').evaluateAll(links => links.map(link => link.hash)), sectionIds.map(id => `#${id}`))
    assert.equal(await page.locator('.nav-cv').getAttribute('href'), new URL(`${base}/Sergio-Almeida-CV.pdf`).pathname)
    assert.equal(await page.locator('.nav-sections [aria-current]').count(), 0)
    assert.equal(await page.locator('.nav-shell feDisplacementMap').count(), 3, 'navigation retains full RGB refraction')
    const isolated = await page.locator('[data-empty-backdrop]').evaluateAll(panels => panels.map(panel => {
      const root = panel.parentElement
      const style = getComputedStyle(root)
      return root.childElementCount === 1 && style.filter !== 'none' &&
        style.backgroundColor === 'rgba(0, 0, 0, 0)' && style.backgroundImage === 'none'
    }))
    assert.equal(isolated.length, 4)
    assert.ok(isolated.every(Boolean), 'empty-backdrop optimization requires an unpainted, filtered parent')
    if (width === 1280) {
      const mask = page.locator('#contact [data-empty-backdrop] > [data-lg-layer]').nth(1)
      assert.equal(await mask.evaluate(el => getComputedStyle(el).maskImage), 'none', 'offscreen contact mask must stay lazy')
    }
    await save(page, `root-${width}-hero`)
    const cta = await page.locator('.hero-actions a').first().boundingBox()
    if (width >= 1024 && cta.y + cta.height > height) errors.push(`${width}: primary CTA below fold`)
    for (const id of sectionIds) {
      await page.evaluate(id => {
        const el = document.getElementById(id)
        const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset'))
        window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - offset, behavior: 'instant' })
      }, id)
      await page.waitForTimeout(950)
      if (id === 'contact') {
        await page.waitForFunction(() => {
          const layer = document.querySelector('#contact [data-empty-backdrop] > [data-lg-layer]:nth-child(2)')
          return layer && getComputedStyle(layer).display !== 'none' && getComputedStyle(layer).maskImage.includes('data:image/png')
        })
        assert.ok(await page.locator('#contact [data-empty-backdrop] > [data-lg-layer]').nth(1).evaluate(async el => {
          const url = getComputedStyle(el).maskImage.match(/^url\(["']?(.*?)["']?\)$/)?.[1]
          if (!url) return false
          const image = new Image()
          image.src = url
          await image.decode()
          return image.naturalWidth === 512 && image.naturalHeight === 512
        }), 'lazy mask must contain a decodable image, not just a mounted layer')
      }
      const active = await page.locator('.nav-sections [aria-current]').getAttribute('href')
      assert.equal(active, `#${id}`, `${width}: active section ${id}`)
      assert.equal(await page.locator('.nav-active-line').count(), 1)
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) errors.push(`${width}/${id}: page overflow`)
      const clipped = await page.locator(`#${id}`).evaluate(el => Array.from(el.querySelectorAll('.contribution-row, .project-grid, .disclosure-head, h2, h3')).filter(node => node.scrollWidth > node.clientWidth + 2).map(node => node.className))
      if (clipped.length) errors.push(`${width}/${id}: clipped ${clipped.join(', ')}`)
      if (['work', 'contact'].includes(id) && [1280, 390].includes(width)) await save(page, `root-${width}-${id}`)
    }

    const button = page.locator('#work button[aria-expanded]').first()
    await button.scrollIntoViewIfNeeded()
    const panel = page.locator('#work .liquid-panel').first()
    const before = await panel.boundingBox()
    await button.focus()
    await page.keyboard.press('Enter')
    assert.equal(await button.getAttribute('aria-expanded'), 'true')
    await page.waitForTimeout(800)
    const after = await panel.boundingBox()
    assert.ok(after.height > before.height, 'accordion expanded')
    assert.equal(Math.round(after.width), Math.round(before.width), 'glass must not stretch horizontally')
    assert.equal(await panel.evaluate(el => getComputedStyle(el, '::after').display), 'none', 'no stretching central sheen')
    if ([1280, 390].includes(width)) await save(page, `root-${width}-expanded`)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(600)

    if (width === 1280) {
      await panel.scrollIntoViewIfNeeded()
      const box = await panel.boundingBox()
      const rim = panel.locator('.glass-pointer-rim')
      await page.mouse.move(box.x + 12, box.y + box.height - 12)
      await page.waitForTimeout(450)
      assert.ok(Number(await rim.evaluate(el => getComputedStyle(el).opacity)) > 0.6)
      await page.mouse.move(box.x - 15, box.y + box.height - 12)
      await page.waitForTimeout(450)
      assert.ok(Number(await rim.evaluate(el => getComputedStyle(el).opacity)) < 0.01, 'highlight must disappear on leave')
      const position = await rim.locator('.glass-pointer-light').evaluate(el => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform)
        return [matrix.m41, matrix.m42]
      })
      assert.ok(position[0] < 30 && position[1] > box.height * 0.7, 'leave must not reset the highlight to another corner')
      await page.mouse.move(box.x + box.width - 14, box.y + 14)
      await page.waitForTimeout(450)
      const reentered = await rim.locator('.glass-pointer-light').evaluate(el => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform)
        return [matrix.m41, matrix.m42]
      })
      assert.ok(reentered[0] > box.width * 0.8 && reentered[1] < 30, 're-entry tracks its actual location')
      await page.mouse.move(0, 0)
      await page.evaluate(() => window.scrollTo({ top: 350, behavior: 'instant' }))
      await page.waitForTimeout(500)
      const travel = await page.locator('.hero-first').evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41)
      assert.ok(travel > 60, 'name scroll travel is more expressive than the previous version')
    }

    await page.getByRole('button', { name: 'PT', exact: true }).click()
    await page.waitForTimeout(300)
    assert.equal(await page.locator('html').getAttribute('lang'), 'pt')
    await page.locator('.nav-sections a[href="#education"]').click()
    await page.waitForTimeout(1500)
    assert.equal(await page.locator('.nav-sections [aria-current]').getAttribute('href'), '#education')
    assert.equal(await page.locator('#about').count(), 1, 'About must stay until copy review')
    await page.locator('.nav-brand').click()
    await page.waitForFunction(() => window.scrollY < 2 && !document.querySelector('.nav-active-line'), undefined, { timeout: 5000 })
    assert.equal(await page.locator('.nav-active-line').count(), 0)
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) errors.push(`${width}: PT overflow`)
    reports.push({ width, height, status: errors.length === previousErrors ? 'passed' : 'failed' })
    await page.close()
  }

  if (!prBase) {
    const previewPage = await browser.newPage({ viewport: { width: 390, height: 844 }, locale: 'en-US' })
    assert.equal((await previewPage.goto(`${base}/pr/36/`))?.status(), 200, 'PR preview response')
    await previewPage.locator('.hero h1').waitFor()
    assert.equal(await previewPage.locator('html').getAttribute('data-preview'), 'liquid-glass', 'PR preview must render the final experience')
    await previewPage.close()
  }

  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const client = await page.context().newCDPSession(page)
  assert.equal((await page.goto(`${base}/`))?.status(), 200, 'reduced motion response')
  await page.locator('.now-card').waitFor()
  assert.equal(await page.locator('[data-empty-backdrop]').count(), 4)
  assert.ok(await page.locator('[data-empty-backdrop]').evaluateAll(panels =>
    panels.every(panel => getComputedStyle(panel.parentElement).filter === 'blur(0px)'),
  ), 'motion-only reduction must preserve every empty backdrop root, including offscreen panels')
  assert.equal(await page.locator('[data-opaque]').count(), 0, 'motion reduction must not disable transparency')
  await client.send('Emulation.setEmulatedMedia', { features: [
    { name: 'prefers-reduced-motion', value: 'reduce' },
    { name: 'prefers-reduced-transparency', value: 'reduce' },
  ] })
  assert.equal((await page.goto(`${base}/`))?.status(), 200, 'reduced transparency response')
  await page.locator('.now-card[data-opaque]').waitFor()
  assert.equal(await page.locator('.now-card').evaluate(el => getComputedStyle(el).backdropFilter), 'none')
  assert.ok(await page.locator('[data-empty-backdrop]').evaluateAll(panels =>
    panels.every(panel => getComputedStyle(panel).backdropFilter === 'none'),
  ), 'reduced transparency must disable all backdrop processing on isolated panels')
  const button = page.locator('#work button[aria-expanded]').first()
  await button.click()
  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }, { name: 'prefers-reduced-transparency', value: 'no-preference' }] })
  await page.waitForTimeout(500)
  assert.equal(await button.getAttribute('aria-expanded'), 'true', 'preference change must not remount content')
  if (!prBase) {
    for (const route of ['/v1', '/v2', '/v3']) {
      assert.equal((await page.goto(`${base}${route}`))?.status(), 200, `${route} response`)
      await page.locator('main h1').waitFor()
      assert.equal(await page.locator('.hero').count(), 0, `${route} must be removed`)
    }
  }
  assert.equal((await page.goto(`${base}/`))?.status(), 200, 'final root response')
  await page.locator('.hero h1').waitFor()
  assert.equal(await page.locator('html').getAttribute('data-preview'), 'liquid-glass')
  assert.equal(await page.locator('header .nav-sections').count(), 1, '/ must render the final navigation')
  assert.equal(await page.locator('header .nav-sections a').count(), 6, '/ must render all section links')
  assert.match(await page.locator('#work button[aria-expanded]').first().getAttribute('class'), /disclosure-toggle/, 'final disclosures must use the glass layout')
  await page.close()

  const hashPage = await browser.newPage({ viewport: { width: 390, height: 844 }, locale: 'en-US' })
  assert.equal((await hashPage.goto(`${base}/#education`))?.status(), 200, 'hash response')
  await hashPage.locator('#education').waitFor()
  await hashPage.waitForTimeout(250)
  assert.ok(await hashPage.evaluate(() => {
    const target = document.getElementById('education')
    const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 0
    return target && Math.abs(target.getBoundingClientRect().top - offset) < 8
  }), 'direct hash links must account for the fixed navigation')
  await hashPage.close()

  console.log(JSON.stringify({ reports, errors }, null, 2))
  assert.deepEqual(errors, [])
} finally {
  if (errors.length) console.error(JSON.stringify(errors, null, 2))
  await browser.close()
}

await import('./check-ui-fallbacks.mjs')
