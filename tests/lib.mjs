// Dictado Armónico · Utilidades de las pruebas, sin dependencias. Los scripts de js/ son clásicos (comparten el ámbito global),
// así que se cargan juntos en un contexto de `vm` con un DOM mínimo de mentira: basta para la teoría y los generadores.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// orden de carga de index.html
export function scripts() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  return [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
}

// Carga los scripts indicados (por defecto, los que no necesitan navegador) y devuelve los nombres pedidos.
export function cargar(nombres, archivos) {
  const lista = archivos || scripts().filter(f => !/glifos|instrumentos|audio|interfaz|bienvenida|inicio/.test(f));
  const nodo = () => ({ textContent: '', innerHTML: '', setAttribute() {}, appendChild() {}, prepend() {}, addEventListener() {}, classList: { add() {}, remove() {}, toggle() {} } });
  const ctx = vm.createContext({
    console, setTimeout, clearTimeout, Math, JSON,
    document: { querySelector: () => null, querySelectorAll: () => [], createElement: nodo, createElementNS: nodo, body: nodo(), addEventListener() {} },
    localStorage: { getItem: () => null, setItem() {} }, matchMedia: () => ({ matches: false, addEventListener() {} }),
  });
  const code = lista.map(f => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/^'use strict';/m, '')).join('\n;\n');
  return vm.runInContext(`'use strict';\n${code}\n;({${nombres.join(',')}})`, ctx, { filename: 'app.js' });
}

/* ---------- Mini arnés ---------- */
let fallos = 0, total = 0;
export function suite(nombre) { console.log(`\n${nombre}`); }
export function ok(cond, msg) { total++; if (!cond) { fallos++; console.log(`  ✗ ${msg}`); } }
export function eq(a, b, msg) { total++; const x = JSON.stringify(a), y = JSON.stringify(b); if (x !== y) { fallos++; console.log(`  ✗ ${msg}: esperaba ${y}, salió ${x}`); } }
export function fin() { console.log(fallos ? `  ${fallos} de ${total} comprobaciones fallan` : `  ✓ ${total} comprobaciones`); process.exit(fallos ? 1 : 0); }
