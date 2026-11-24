import { mkdir, writeFile } from 'node:fs/promises';

const backgrounds = {
  'library.jpg': 'https://pikaso.cdnpk.net/private/production/6149582931/3918751012.jpg?token=exp=1795737600~hmac=bcc34ec8567ad82b8bb7f7a0750610cc0da4b0a30049292bad43384675aa24b2',
  'grimoire.jpg': 'https://pikaso.cdnpk.net/private/production/6149583830/3918751443.jpg?token=exp=1795737600~hmac=274fa461733b6ada30256bc11705a48c395021fc4c6d3f9eeee8f50d7c3977bd',
  'cathedral.jpg': 'https://pikaso.cdnpk.net/private/production/6149584391/3918751694.jpg?token=exp=1795737600~hmac=360ef9a5c377b360e47e312c5a0c6fd8db6f5e483818d21a34066ce78ce38d4c',
  'forest.jpg': 'https://pikaso.cdnpk.net/private/production/6149584940/3918751943.jpg?token=exp=1795737600~hmac=075280e3d8ea858b9a946c709e921fd35abb6a760537afda405ce6a556f6b695',
  'alchemy.jpg': 'https://pikaso.cdnpk.net/private/production/6149585458/3918752136.jpg?token=exp=1795737600~hmac=8e3f02febd3546815eff1155ba4b10c166988ef959596eb2fcd07a2e77381f45',
  'astral.jpg': 'https://pikaso.cdnpk.net/private/production/6149585860/3918752327.jpg?token=exp=1795737600~hmac=53743e7f29e1bc7d677bf0625617d3fb760b0982ead44477d36838e5ec2ebb99',
  'cemetery.jpg': 'https://pikaso.cdnpk.net/private/production/6149586226/3918752481.jpg?token=exp=1795737600~hmac=f39735ebec1d87f84e7f94c85d6e1dfa2f4ad13782ab3c9da4ceaac406007f89',
  'ritual.jpg': 'https://pikaso.cdnpk.net/private/production/6149586724/3918752668.jpg?token=exp=1795737600~hmac=e658981c197f74b184dfb420b70fc41f518c57134a33598f96ac2d5c74be83da',
  'castle.jpg': 'https://pikaso.cdnpk.net/private/production/6149587203/3918752867.jpg?token=exp=1795737600~hmac=ab34aa10ca212f79ce22e6786dd0d3f6c4c8a3553026e96d2f01bdea898f0f4a',
  'raven.jpg': 'https://pikaso.cdnpk.net/private/production/6149587694/3918753067.jpg?token=exp=1795737600~hmac=ccba3f071d467c223599b2db9744b53e93246a3c070a9000d3c6c2660d29f636'
};

const dir = 'assets/note-backgrounds';
await mkdir(dir, { recursive: true });
for (const [filename, url] of Object.entries(backgrounds)) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Could not download ' + filename + ': HTTP ' + response.status);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 5000) throw new Error('Downloaded file is unexpectedly small: ' + filename);
  await writeFile(dir + '/' + filename, bytes);
  console.log('Downloaded ' + filename + ' (' + bytes.length + ' bytes)');
}
