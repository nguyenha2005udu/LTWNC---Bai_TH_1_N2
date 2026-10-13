import { chromium } from 'playwright'
import { writeFile } from 'node:fs/promises'
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: false, devtools: true, args: ['--remote-debugging-port=9223', '--auto-open-devtools-for-tabs'] })
const page = await browser.newPage()
const logs = []
page.on('console', message => logs.push({ type: message.type(), text: message.text() }))
await page.route('http://localhost:3001/assignments', async route => {
  const data = route.request().postDataJSON()
  await route.fulfill({ json: route.request().method() === 'POST' ? data : [] })
})
await page.goto('http://127.0.0.1:5173')
await page.getByLabel('Môn học').fill('React')
await page.getByLabel('Tên bài tập').fill('Console logger evidence')
await page.getByLabel('Hạn nộp').fill('2026-12-31')
await page.getByRole('button', { name: 'Thêm bài tập', exact: true }).click()
await page.getByRole('button', { name: 'Hoàn thành', exact: true }).click()
await page.getByRole('button', { name: 'Xóa', exact: true }).click()
await writeFile('evidence/redux-console.json', JSON.stringify(logs, null, 2))
const targets = await (await fetch('http://127.0.0.1:9223/json')).json()
console.log(targets.map(t => ({ type: t.type, url: t.url })))
const devtools = targets.find(t => t.url.startsWith('devtools://'))
if (devtools) {
  const ws = new WebSocket(devtools.webSocketDebuggerUrl)
  await new Promise(r => ws.addEventListener('open', r, { once: true }))
  let id = 0
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const current = ++id
    const listener = e => { const data = JSON.parse(e.data); if (data.id === current) { ws.removeEventListener('message', listener); if (data.error) reject(data.error); else resolve(data.result) } }
    ws.addEventListener('message', listener); ws.send(JSON.stringify({ id: current, method, params }))
  })
  await call('Page.bringToFront')
  const clickConsole = `(() => {
    function nodes(root) { return [...root.querySelectorAll('*')].flatMap(node => [node, ...(node.shadowRoot ? nodes(node.shadowRoot) : [])]) }
    const tab = nodes(document).find(node => node.getAttribute('role') === 'tab' && node.textContent.trim() === 'Console')
    const rect = tab?.getBoundingClientRect()
    return { x: rect?.x + rect?.width / 2, y: rect?.y + rect?.height / 2 }
  })()`
  const coordinates = (await call('Runtime.evaluate', { expression: clickConsole, returnByValue: true })).result.value
  await call('Input.dispatchMouseEvent', { type: 'mousePressed', ...coordinates, button: 'left', clickCount: 1 })
  await call('Input.dispatchMouseEvent', { type: 'mouseReleased', ...coordinates, button: 'left', clickCount: 1 })
  await new Promise(r => setTimeout(r, 1500))
  const screenshot = await call('Page.captureScreenshot', { format: 'png' })
  await writeFile('evidence/redux-console.png', Buffer.from(screenshot.data, 'base64'))
  ws.close()
}
await browser.close()
