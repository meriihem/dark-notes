import { mkdir, copyFile } from 'node:fs/promises';

await mkdir('www', { recursive: true });
await copyFile('index.html', 'www/index.html');
for (const file of ['manifest.webmanifest', 'service-worker.js']) {
  try {
    await copyFile(file, `www/${file}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
console.log('Prepared Dark Notes web assets in ./www');
