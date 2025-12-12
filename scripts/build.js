#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const STATIC_DIRS = ['css', 'js', 'img'];

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function cleanDist() {
  await fs.rm(DIST_DIR, { recursive: true, force: true });
  await fs.mkdir(DIST_DIR, { recursive: true });
  console.log(`[build] Limpei pasta ${DIST_DIR}`);
}

async function findHtmlFiles() {
  const entries = await fs.readdir(ROOT_DIR, { withFileTypes: true });
  return entries.filter(ent => ent.isFile() && ent.name.endsWith('.html')).map(ent => ent.name);
}

async function copyFileRelative(relPath) {
  const src = path.join(ROOT_DIR, relPath);
  const dest = path.join(DIST_DIR, relPath);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
}

async function copyDirRelative(relDir) {
  const src = path.join(ROOT_DIR, relDir);
  if (!(await pathExists(src))) {
    console.warn(`[build] Pasta ${relDir} n\u00e3o encontrada, ignorando.`);
    return;
  }
  const dest = path.join(DIST_DIR, relDir);
  await fs.mkdir(dest, { recursive: true });
  await fs.cp(src, dest, { recursive: true });
}

async function maybeOverrideApiBase() {
  const apiBase = process.env.API_BASE ? String(process.env.API_BASE).trim() : '';
  if (!apiBase) return;

  const configPath = path.join(DIST_DIR, 'js', 'config.js');
  if (!(await pathExists(configPath))) {
    console.warn('[build] API_BASE definido mas dist/js/config.js n\u00e3o existe; ignorando override.');
    return;
  }

  const content = await fs.readFile(configPath, 'utf8');
  const pattern = /var PROD = '.*?';/;
  if (!pattern.test(content)) {
    console.warn('[build] N\u00e3o encontrei var PROD em config.js; mantendo arquivo original.');
    return;
  }

  const escaped = apiBase.replace(/'/g, "\\'");
  const updated = content.replace(pattern, `var PROD = '${escaped}';`);
  await fs.writeFile(configPath, updated, 'utf8');
  console.log(`[build] API_BASE sobrescrito para ${apiBase}`);
}

async function main() {
  await cleanDist();
  const htmlFiles = await findHtmlFiles();
  await Promise.all(htmlFiles.map(copyFileRelative));
  console.log(`[build] Copiados arquivos HTML: ${htmlFiles.join(', ') || 'nenhum'}`);

  for (const dir of STATIC_DIRS) {
    await copyDirRelative(dir);
  }
  console.log(`[build] Pastas est\u00e1ticas copiadas: ${STATIC_DIRS.join(', ')}`);

  await maybeOverrideApiBase();
  console.log('[build] Finalizado com sucesso.');
}

main().catch(err => {
  console.error('[build] Falhou:', err);
  process.exit(1);
});
