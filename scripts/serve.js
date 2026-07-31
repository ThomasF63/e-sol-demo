// Serveur statique minimal pour la démo e-Sol (aucune dépendance).
// Sert dist/ en HTTP et ouvre le navigateur par défaut.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const distDir = path.join(__dirname, '..', 'dist');
const START_PORT = Number(process.env.PORT) || 3000;
const MAX_PORT_TRIES = 20;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  if (urlPath.endsWith('/')) urlPath += 'index.html';

  // Empêche de sortir de dist/
  const filePath = path.join(distDir, path.normalize(urlPath));
  if (!filePath.startsWith(distDir)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404</h1><p>Page introuvable : ' + urlPath + '</p>');
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  });
});

function listen(port, triesLeft) {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && triesLeft > 0) {
      listen(port + 1, triesLeft - 1);
    } else {
      console.error('Impossible de démarrer le serveur :', err.message);
      process.exit(1);
    }
  });
  server.listen(port, '127.0.0.1', () => {
    const url = `http://localhost:${port}/index.html`;
    console.log('');
    console.log('  Démo e-Sol en ligne  →  ' + url);
    console.log('');
    console.log('  Laissez cette fenêtre ouverte pendant la consultation.');
    console.log('  Fermez-la (ou Ctrl+C) pour arrêter la démo.');
    console.log('');
    // Ouvre le navigateur par défaut de Windows (ESOL_NO_OPEN=1 pour désactiver)
    if (!process.env.ESOL_NO_OPEN) {
      spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
    }
  });
}

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('dist/index.html est introuvable — lancez d’abord : node build.js');
  process.exit(1);
}

listen(START_PORT, MAX_PORT_TRIES);
