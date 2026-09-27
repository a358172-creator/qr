import { resolve } from 'node:path';
import { projectRoot, validateSite } from './site-files.mjs';

const { files, references } = await validateSite(resolve(projectRoot, 'dist'));
console.log(`Web lista: ${files.length} archivos; ${references} referencias locales comprobadas.`);
