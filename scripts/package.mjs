import { mkdir, readFile, writeFile, lstat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { projectRoot, collectFiles, validateSite } from './site-files.mjs';
import { createZip } from './zip.mjs';

const output = resolve(projectRoot, 'release');
const { files: built } = await validateSite(resolve(projectRoot, 'dist'));
await mkdir(output, { recursive: true });
const readEntry = async file => ({ ...file, data: await readFile(file.path) });

// A deliberate allowlist keeps local dependencies, Git history, credentials
// and previously generated archives out of the editable handoff.
const sourceRoots = [
  '.github', '.gitignore', '.nvmrc', 'README.md', 'PUBLICAR.md',
  'index.html', 'package.json', 'package-lock.json', 'vite.config.js',
  'src', 'public', 'scripts', 'tests', 'content', 'assets', 'docs',
];
const sourceFiles = [];
for (const name of sourceRoots) {
  const path = resolve(projectRoot, name), info = await lstat(path);
  const entries = info.isDirectory() ? await collectFiles(path) : [{ path, name: '', modified: info.mtime }];
  for (const file of entries) {
    const archiveName = file.name ? `${name}/${file.name}` : name;
    sourceFiles.push({ ...file, name: `neurovista-proyecto/${archiveName}` });
  }
}
const archives = [
  { name: 'neurovista-web.zip', files: built },
  { name: 'neurovista-proyecto.zip', files: sourceFiles },
];
const checksums = [];
for (const archive of archives) {
  const data = createZip(await Promise.all(archive.files.map(readEntry)));
  await writeFile(resolve(output, archive.name), data);
  checksums.push(`${createHash('sha256').update(data).digest('hex')}  ${archive.name}`);
  console.log(`${archive.name}: ${archive.files.length} archivos, ${(data.length / 1024).toFixed(0)} KiB`);
}
await writeFile(resolve(output, 'SHA256SUMS.txt'), `${checksums.join('\n')}\n`);
await writeFile(resolve(output, 'LEEME.txt'), `NEURO·VISTA — ARCHIVOS PARA COMPARTIR Y PUBLICAR

neurovista-web.zip
  Web ya compilada. Extrae el ZIP y sube TODO su contenido al directorio
  público del hosting. index.html y la carpeta assets deben quedar juntos.
  También puedes subir el ZIP al gestor de archivos del hosting y extraerlo allí.
  El hosting no necesita Node.js, npm, base de datos ni claves API.
  Abre la URL de la página mediante HTTP/HTTPS; no con doble clic sobre el HTML.

neurovista-proyecto.zip
  Proyecto editable para entregar a otra persona o continuar el desarrollo.
  Incluye código, contenido, pruebas y workflow de GitHub Pages.
  Con Node.js 22.12+ instalado: npm ci, después npm run dev.
  npm run package vuelve a generar estos archivos tras cualquier cambio.
  PUBLICAR.md contiene las instrucciones de hosting y GitHub Pages.

SHA256SUMS.txt permite comprobar la integridad de los ZIP después de copiarlos.
`);
console.log('Paquetes creados en release/. Instrucciones: release/LEEME.txt');
