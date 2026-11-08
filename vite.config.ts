import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

const root = process.cwd();

if (fs.existsSync(path.join(root, 'index.html'))) {
  let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  html = html.replace('/src/main.tsx', '/main.tsx').replace('/src/index.tsx', '/main.tsx').replace('/src/index.css', '/index.css');
  fs.writeFileSync(path.join(root, 'index.html'), html);
}

const publicDir = path.join(root, 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
const mediaExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.mp3', '.wav', '.ogg', '.ttf', '.otf', '.woff', '.woff2'];
for (const file of fs.readdirSync(root)) {
  if (mediaExts.some(ext => file.toLowerCase().endsWith(ext))) {
    fs.copyFileSync(path.join(root, file), path.join(publicDir, file));
  }
}

export default defineConfig({
  plugins: [
    {
      name: 'flat-resolver',
      resolveId(source) {
        if (source.startsWith('.') || source.startsWith('/src/') || source.startsWith('@/')) {
          const clean = source.split('?')[0];
          const base = path.basename(clean);
          for (const ext of ['', '.tsx', '.ts', '.jsx', '.js', '.css', '.json']) {
            const p = path.join(root, base + ext);
            if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
          }
        }
        return null;
      }
    },
    react(),
    tailwindcss(),
  ],
});
