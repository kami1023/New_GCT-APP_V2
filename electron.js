const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let serverProcess;

app.whenReady().then(() => {
  // Start the backend server
  serverProcess = spawn('node', ['node_modules/.bin/tsx', 'server.ts'], {
    cwd: __dirname,
    shell: true
  });

  serverProcess.stdout.on('data', (data) => console.log(`Server: ${data}`));
  serverProcess.stderr.on('data', (data) => console.error(`Server Error: ${data}`));

  // Wait for server to start then open window
  setTimeout(() => {
    const win = new BrowserWindow({
      width: 1400,
      height: 900,
      icon: path.join(__dirname, 'assets/icon.ico'),
      webPreferences: { nodeIntegration: false }
    });
    win.loadURL('http://localhost:3000');
    win.setTitle('GCT App');
  }, 3000);
});

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  app.quit();
});
