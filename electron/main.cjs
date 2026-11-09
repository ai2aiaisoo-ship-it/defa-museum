// ─── یادواره شهدای دفاع مقدس — پوسته Electron برای نسخه ویندوز (exe) ───
// سرور مستقل Next.js (standalone) را با موتور Electron اجرا می‌کند و پنجره موزه را می‌گشاید.
const { app, BrowserWindow, shell } = require('electron')
const { spawn } = require('node:child_process')
const path = require('node:path')
const http = require('node:http')

const PORT = 34567
const BASE = `http://127.0.0.1:${PORT}`
let serverProc = null

function waitReady(retries = 120) {
  return new Promise((resolve, reject) => {
    const tick = (n) => {
      const req = http.get(BASE, (res) => { res.resume(); resolve() })
      req.on('error', () => {
        if (n <= 0) return reject(new Error('server did not start'))
        setTimeout(() => tick(n - 1), 500)
      })
    }
    tick(retries)
  })
}

function startServer() {
  const serverPath = path.join(process.resourcesPath, 'app-server', 'server.js')
  const dbPath = path.join(process.resourcesPath, 'app-server', 'db', 'custom.db')
  serverProc = spawn(process.execPath, [serverPath], {
    cwd: path.dirname(serverPath),
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      NODE_ENV: 'production',
      PORT: String(PORT),
      HOSTNAME: '127.0.0.1',
      DATABASE_URL: `file:${dbPath}`,
    },
    stdio: 'ignore',
    windowsHide: true,
  })
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    autoHideMenuBar: true,
    backgroundColor: '#0b1210',
    title: 'یادواره شهدای دفاع مقدس — موزه دیجیتال جنگ تحمیلی',
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  })
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
  win.loadURL(BASE)
}

app.whenReady().then(async () => {
  startServer()
  try { await waitReady() } catch { /* پنجره به هر حال باز می‌شود */ }
  createWindow()
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})

app.on('window-all-closed', () => {
  if (serverProc) { try { serverProc.kill() } catch { /* بی‌اهمیت */ } }
  app.quit()
})
