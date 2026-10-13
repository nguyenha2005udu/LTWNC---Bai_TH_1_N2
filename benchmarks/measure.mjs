import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const outputDir = process.env.BENCH_OUTPUT_DIR ?? 'evidence'
await mkdir(outputDir, { recursive: true })
const modes = process.argv.slice(2)
if (modes.some(mode => !['baseline', 'optimized'].includes(mode))) throw new Error('Mode must be baseline or optimized')
const results = []
for (const mode of (modes.length ? modes : ['baseline', 'optimized'])) {
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } })
  page.setDefaultTimeout(120000)
  page.on('pageerror', error => console.log('PAGE ERROR', error.message))
  await page.goto(`http://127.0.0.1:5173/benchmarks/index.html?mode=${mode}`)
  await page.getByText('Bài tập mẫu 1', { exact: true }).waitFor()
  await page.waitForTimeout(500)
  const mounted = await page.locator('article').count()
  await page.evaluate(() => { globalThis.__cardRenderCount = 0; globalThis.__benchmark.commits = [] })
  await page.locator('input').pressSequentially('React', { delay: 100 })
  await page.waitForTimeout(500)
  const search = await page.evaluate(() => ({ renders: globalThis.__cardRenderCount, commits: globalThis.__benchmark.commits }))
  await page.evaluate(() => { globalThis.__cardRenderCount = 0; globalThis.__benchmark.commits = [] })
  await page.getByRole('button', { name: 'Chủ đề: Sáng' }).click()
  const theme = await page.evaluate(() => ({ renders: globalThis.__cardRenderCount, commits: globalThis.__benchmark.commits }))
  await page.screenshot({ path: `${outputDir}/${mode}-list.png` })
  results.push({ mode, mounted, search, theme })
  await page.close()
}
await writeFile(`${outputDir}/render-results.json`, JSON.stringify(results, null, 2))
console.log(JSON.stringify(results, null, 2))
await browser.close()
