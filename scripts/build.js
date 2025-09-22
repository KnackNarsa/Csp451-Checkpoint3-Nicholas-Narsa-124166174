import { mkdirSync, copyFileSync, cpSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');

mkdirSync(dist, { recursive: true });

// Copy static files
cpSync(resolve(root, 'src'), dist, { recursive: true });

console.log('Build completed. Output in dist/');
