import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const mediaExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.mp3', '.wav', '.ogg', '.ttf', '.otf', '.woff', '.woff2'];
const codeExts = ['.tsx', '.ts', '.jsx', '.js', '.css', '.html'];

const allFiles = fs.readdirSync(root);
const mediaFiles = allFiles.filter(f => mediaExts.some(ext => f.toLowerCase().endsWith(ext)));

for (const file of allFiles) {
  if (codeExts.some(ext => file.toLowerCase().endsWith(ext)) && file !== 'vite.config.ts') {
    const filePath = path.join(root, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace('/src/main.tsx', '/main.tsx').replace('/src/index.tsx', '/main.tsx').replace('/src/index.css', '/index.css');
    for (const media of mediaFiles) {
      const escaped = media.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:\\.?\\.?\\/|\\/)(?:[a-zA-Z0-9_-]+\\/)+${escaped}`, 'g');
      content = content.replace(regex, `/${media}`);
    }
    fs.writeFileSync(filePath, content);
  }
}

if (fs.existsSync(path.join(root, 'index.css'))) {
  let css = fs.readFileSync(path.join(root, 'index.css'), 'utf8');
  css += '\n[style*="border-image"], [style*="borderImage"] { border-color: transparent !important; }\n';
  fs.writeFileSync(path.join(root, 'index.css'), css);
}

const subDirs = ['', 'src', 'assets', 'src/assets', 'public', 'fonts', 'images', 'components', 'src/components'];
for (const sub of subDirs) {
  const targetDir = path.join(root, 'public', sub);
  fs.mkdirSync(targetDir, { recursive: true });
  for (const media of mediaFiles) {
    fs.copyFileSync(path.join(root, media), path.join(targetDir, media));
  }
}

export default defineConfig({
  plugins: [
    {
      name: 'flat-resolver',
      resolveId(source) {
        if (source.includes('node_modules')) return null;
        const clean = source.split('?')[0];
        const base = path.basename(clean);
        for (const ext of ['', '.tsx', '.ts', '.jsx', '.js', '.css', '.json']) {
          const p = path.join(root, base + ext);
          if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
        }
        return null;
      },
      closeBundle() {
        const distDir = path.join(root, 'dist');
        if (!fs.existsSync(distDir)) return;
        for (const sub of subDirs) {
          const targetDir = path.join(distDir, sub);
          fs.mkdirSync(targetDir, { recursive: true });
          for (const media of mediaFiles) {
            fs.copyFileSync(path.join(root, media), path.join(targetDir, media));
          }
        }
      }
    },
    react(),
    tailwindcss(),
  ],
});
