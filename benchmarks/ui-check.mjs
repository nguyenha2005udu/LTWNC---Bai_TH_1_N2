import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
await mkdir('evidence/ui', { recursive: true })
const items = [
 { id: 'ui-1', subject: 'React nâng cao', title: 'Xây dựng ứng dụng quản lý bài tập', deadline: '2026-10-18', priority: 'high', completed: false },
 { id: 'ui-2', subject: 'Cơ sở dữ liệu', title: 'Thiết kế cơ sở dữ liệu thư viện', deadline: '2026-10-20', priority: 'medium', completed: false },
 { id: 'ui-3', subject: 'Lập trình Web', title: 'Hoàn thiện giao diện responsive', deadline: '2026-10-12', priority: 'high', completed: false },
 { id: 'ui-4', subject: 'Tiếng Anh', title: 'Bài thuyết trình giữa kỳ', deadline: '2026-10-16', priority: 'low', completed: true },
]
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } })
const errors = []
page.on('pageerror', error => errors.push(error.message))
await page.route('http://localhost:3001/assignments', route => route.fulfill({ json: items }))
await page.goto('http://127.0.0.1:5173')
await page.getByText(items[0].title, { exact: true }).waitFor()
await page.screenshot({ path: 'evidence/ui/desktop-light.png', fullPage: true })
await page.getByRole('button', { name: 'Chủ đề: Sáng' }).click()
await page.screenshot({ path: 'evidence/ui/desktop-dark.png', fullPage: true })
for (const width of [390, 320, 768]) {
  await page.setViewportSize({ width, height: 844 })
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Overflow at ${width}px`)
  for (const card of await page.locator('article').all()) {
    assert.ok(await card.evaluate(el => el.scrollHeight <= el.clientHeight + 1), `Card overflow at ${width}px`)
  }
  await page.screenshot({ path: `evidence/ui/mobile-${width}-dark.png`, fullPage: true })
}
await page.getByRole('button', { name: 'Chủ đề: Tối' }).click()
await page.setViewportSize({ width: 390, height: 844 })
await page.screenshot({ path: 'evidence/ui/mobile-light.png', fullPage: true })
await page.getByRole('button', { name: 'Thống kê', exact: true }).click()
await page.getByRole('heading', { name: 'Thống kê', exact: true }).waitFor()
await page.screenshot({ path: 'evidence/ui/statistics-mobile.png', fullPage: true })
assert.deepEqual(errors, [])
console.log('UI check passed: desktop, dark/light, 320/390/768px with no horizontal or card overflow.')
await browser.close()
