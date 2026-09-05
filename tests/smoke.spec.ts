import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { en } from '../src/content/en'
import { pt } from '../src/content/pt'

test('a pagina monta sem erros de consola', async ({ page }) => {
  const erros: string[] = []

  page.on('console', (msg) => {
    if (msg.type() === 'error') erros.push(msg.text())
  })
  page.on('pageerror', (erro) => {
    erros.push(erro.message)
  })

  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sérgio')
  expect(erros).toEqual([])
})

test('o toggle troca a lingua', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByText(en.hero.lede)).toBeVisible()

  await page
    .getByRole('radiogroup', { name: 'Language' })
    .getByRole('radio', { name: 'PT' })
    .click()

  await expect(page.locator('html')).toHaveAttribute('lang', 'pt')
  await expect(page.getByText(pt.hero.lede)).toBeVisible()
})

test('o cv esta servido e e mesmo um pdf', async ({ page, request }) => {
  await page.goto('/')

  const href = await page
    .getByRole('link', { name: en.hero.cvCta })
    .first()
    .getAttribute('href')

  expect(href).toBeTruthy()

  const resposta = await request.get(href as string)

  expect(resposta.status()).toBe(200)
  expect(resposta.headers()['content-type']).toContain('pdf')
})

test('sem violacoes graves de acessibilidade', async ({ page }) => {
  await page.goto('/')

  const { violations } = await new AxeBuilder({ page }).analyze()
  const graves = violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  )

  expect(graves.map((v) => `${v.id} (${v.nodes.length})`)).toEqual([])
})
