// Tiny dev server: serves the game and saves play logs to ./logs/
// Usage: node server.js   then open http://localhost:8787
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const LOGS = path.join(ROOT, 'logs');
const PORT = process.env.PORT || 8787;
fs.mkdirSync(LOGS, { recursive: true });

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png' };

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'POST' && url.pathname === '/log') {
    const id = url.searchParams.get('id') || '';
    if (!/^[\w-]{1,64}$/.test(id)) { res.writeHead(400); return res.end('bad id'); }
    let body = '', size = 0;
    req.on('data', c => { size += c.length; if (size > 50e6) req.destroy(); else body += c; });
    req.on('end', () => {
      try { JSON.parse(body); } catch { res.writeHead(400); return res.end('bad json'); }
      fs.writeFile(path.join(LOGS, `session-${id}.json`), body, err => { res.writeHead(err ? 500 : 204); res.end(); });
    });
    return;
  }

  if (req.method === 'GET') {
    const rel = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname).replace(/^\/+/, '');
    const file = path.resolve(ROOT, rel);
    if (!file.startsWith(ROOT + path.sep) || file.startsWith(LOGS)) { res.writeHead(403); return res.end(); }
    return fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); return res.end('not found'); }
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(data);
    });
  }
  res.writeHead(405); res.end();
}).listen(PORT, '127.0.0.1', () => console.log(`Orbital Courier → http://localhost:${PORT}  (logs → ${LOGS})`));
