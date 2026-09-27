import { readdir, readFile, lstat } from 'node:fs/promises';
import { resolve, dirname, relative, isAbsolute, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));

export async function collectFiles(directory) {
  const files = [];
  async function visit(path) {
    const info = await lstat(path);
    if (info.isSymbolicLink()) throw new Error(`No se empaquetan enlaces simbólicos: ${path}`);
    if (info.isDirectory()) {
      for (const name of (await readdir(path)).sort()) await visit(resolve(path, name));
    } else if (info.isFile()) {
      files.push({ path, name: relative(directory, path).split('\\').join('/'), modified: info.mtime });
    }
  }
  await visit(directory);
  return files;
}

// Check the compiled artifact, including its lazy JS imports. Absolute paths
// break subfolder hosting, so this intentionally checks more than the HTML.
export async function validateSite(directory) {
  const files = await collectFiles(directory);
  const paths = new Set(files.map(file => file.path));
  for (const required of ['index.html', '.nojekyll']) {
    if (!paths.has(resolve(directory, required))) throw new Error(`Falta ${required} en la web compilada.`);
  }
  let references = 0;
  for (const file of files) {
    if (!['.html', '.js', '.css'].includes(extname(file.name))) continue;
    const source = await readFile(file.path, 'utf8');
    const patterns = extname(file.name) === '.html'
      ? [/\b(?:src|href)=["']([^"']+)["']/g]
      : extname(file.name) === '.css'
        ? [/url\(\s*["']?([^\s"')]+)["']?\s*\)/g]
        : [/\b(?:from\s*|import\s*\(\s*|import\s*)["']([^"']+)["']/g];
    for (const pattern of patterns) for (const match of source.matchAll(pattern)) {
      const url = match[1];
      if (/^(?:#|[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) continue;
      if (url.startsWith('/')) throw new Error(`Ruta no portable en ${file.name}: ${url}`);
      const target = resolve(dirname(file.path), decodeURIComponent(url.split(/[?#]/)[0]));
      const local = relative(directory, target);
      if (isAbsolute(local) || local.startsWith('..') || !paths.has(target)) {
        throw new Error(`Recurso ausente o fuera del paquete: ${file.name} → ${url}`);
      }
      references += 1;
    }
  }
  return { files, references };
}
