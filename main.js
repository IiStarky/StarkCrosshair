const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')
const fs = require('fs')
const path = require('path')

app.commandLine.appendSwitch('disable-gpu-sandbox')
app.commandLine.appendSwitch('in-process-gpu')

const presetsPath = path.join(app.getPath('userData'), 'presets.json')

function loadPresets() {
  try {
    if (fs.existsSync(presetsPath)) return JSON.parse(fs.readFileSync(presetsPath, 'utf8'))
  } catch (e) {}
  return []
}

function savePresets(presets) {
  try { fs.writeFileSync(presetsPath, JSON.stringify(presets)) } catch (e) {}
}

let overlay, settingsWin

app.whenReady().then(() => {
  overlay = new BrowserWindow({
    fullscreen: true,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: false,
    type: 'toolbar',
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })

  overlay.loadFile('overlay.html')
  overlay.setIgnoreMouseEvents(true)
  overlay.setAlwaysOnTop(true, 'screen-saver')

 settingsWin = new BrowserWindow({
    icon: path.join(__dirname, 'icon.ico'),
    width: 400,
    height: 680,
    frame: false,
    resizable: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })

  settingsWin.loadFile('index.html')
  settingsWin.on('close', () => app.quit())
  let currentPresetIndex = -1

globalShortcut.register('F2', () => {
    const presets = loadPresets()
    if (!presets.length) return
    currentPresetIndex = (currentPresetIndex + 1) % presets.length
    const p = presets[currentPresetIndex]
    const preset = {
      name:      p.name,
      style:     p.style,
      color:     p.color,
      gap:       +p.gap,
      length:    +p.length,
      thickness: +p.thickness,
      opacity:   +p.opacity,
      visible:   p.visible
    }
    if (overlay) {
      overlay.webContents.send('settings-update', preset)
    }
    settingsWin.webContents.send('load-preset-from-hotkey', preset, currentPresetIndex)
  })
  globalShortcut.register('F3', () => {
    if (!overlay) return
    if (overlay.isVisible()) {
      overlay.hide()
      settingsWin.webContents.send('toggle-from-hotkey', false)
    } else {
      overlay.show()
      overlay.setAlwaysOnTop(true, 'screen-saver')
      settingsWin.webContents.send('toggle-from-hotkey', true)
    }
  })
  overlay.on('close', () => { overlay = null })
})
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
app.on('before-quit', () => {
  if (overlay) { overlay.destroy(); overlay = null }
  if (settingsWin) { settingsWin.destroy(); settingsWin = null }
})

ipcMain.on('settings-update', (event, data) => {
  if (!overlay) return
  if (data.visible === false) { overlay.hide() } else { overlay.show(); overlay.setAlwaysOnTop(true, 'screen-saver') }
  overlay.webContents.send('settings-update', data)
})

ipcMain.on('save-preset', (event, preset) => {
  const presets = loadPresets()
  presets.push({
    name:      preset.name,
    style:     preset.style,
    color:     preset.color,
    gap:       +preset.gap,
    length:    +preset.length,
    thickness: +preset.thickness,
    opacity:   +preset.opacity,
    visible:   preset.visible
  })
  savePresets(presets)
  event.reply('presets-updated', presets)
})

ipcMain.on('delete-preset', (event, index) => {
  const presets = loadPresets()
  presets.splice(index, 1)
  savePresets(presets)
  event.reply('presets-updated', presets)
})

ipcMain.on('get-presets', (event) => {
  event.reply('presets-updated', loadPresets())
})

ipcMain.on('close-app', () => app.quit())
ipcMain.on('minimize-app', () => settingsWin && settingsWin.minimize())