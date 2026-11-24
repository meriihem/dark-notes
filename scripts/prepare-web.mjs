import { mkdir, copyFile } from 'node:fs/promises';

await mkdir('www', { recursive: true });
await (await import('node:child_process')).execSync('node scripts/generate-icons.mjs --web');
await copyFile('index.html', 'www/index.html');
for (const file of ['manifest.webmanifest', 'service-worker.js']) {
  try {
    await copyFile(file, `www/${file}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
await mkdir('www/icons', { recursive: true });
for (const file of ['icon-192.png','icon-512.png','icon-512-maskable.png']) await copyFile(`icons/${file}`, `www/icons/${file}`);
console.log('Prepared Dark Notes web assets and icons in ./www');
