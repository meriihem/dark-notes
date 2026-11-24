import { mkdir, copyFile, readFile } from 'node:fs/promises';
import sharp from 'sharp';

const source = 'assets/dark-notes-icon.jpg';
const image = await readFile(source);
async function png(path, size) {
  await mkdir(path.slice(0, path.lastIndexOf('/')), { recursive: true });
  await sharp(image).resize(size, size, { fit: 'cover' }).png({ compressionLevel: 9 }).toFile(path);
}
await png('icons/icon-192.png', 192);
await png('icons/icon-512.png', 512);
await png('icons/icon-512-maskable.png', 512);
await png('icon-192.png', 192);
await png('icon-512.png', 512);
await png('icon-512-maskable.png', 512);

if (process.argv.includes('--android')) {
  const android = 'android/app/src/main/res';
  for (const [density, size] of Object.entries({mdpi:48,hdpi:72,xhdpi:96,xxhdpi:144,xxxhdpi:192})) {
    await png(`${android}/mipmap-${density}/ic_launcher.png`, size);
    await png(`${android}/mipmap-${density}/ic_launcher_round.png`, size);
  }
  await mkdir(`${android}/mipmap-anydpi-v26`, {recursive:true});
  await mkdir(`${android}/drawable`, {recursive:true});
  await sharp(image).resize(432,432,{fit:'cover'}).png().toFile(`${android}/drawable/ic_launcher_foreground.png`);
  const xml = `<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android"><background android:drawable="@color/ic_launcher_background"/><foreground android:drawable="@drawable/ic_launcher_foreground"/></adaptive-icon>`;
  await (await import('node:fs/promises')).writeFile(`${android}/mipmap-anydpi-v26/ic_launcher.xml`, xml);
  await (await import('node:fs/promises')).writeFile(`${android}/mipmap-anydpi-v26/ic_launcher_round.xml`, xml);
  await mkdir(`${android}/values`, {recursive:true});
  await (await import('node:fs/promises')).writeFile(`${android}/values/ic_launcher_background.xml`, `<resources><color name="ic_launcher_background">#101114</color></resources>`);
}
console.log('Generated original Dark Notes artwork icons' + (process.argv.includes('--android') ? ' and Android launcher resources.' : '.'));

// Icon source is the committed Dark Notes grimoire artwork in assets/dark-notes-icon.jpg.
