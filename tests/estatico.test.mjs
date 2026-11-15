// Comprobaciones sobre los archivos: todo es local (ninguna petición a otros sitios), la CSP está puesta,
// no hay estilos ni scripts en línea, y lo que se guarda en el navegador se valida al cargarlo.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, scripts, cargar, suite, ok, eq, fin } from './lib.mjs';

const lee = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const html = lee('index.html'), css = lee('styles.css'), js = scripts();

suite('Archivos');
ok(js.length >= 15 && js.every(f => fs.existsSync(path.join(ROOT, f))), 'todos los scripts de index.html existen');
eq(js[js.length - 1], 'js/inicio.js', 'inicio.js es el último script');
ok(/Content-Security-Policy[^>]*default-src 'none'[^>]*script-src 'self'[^>]*style-src 'self'/.test(html), 'la CSP solo admite scripts y estilos propios');
ok(!/<script(?![^>]*\bsrc=)/.test(html) && !/\son[a-z]+\s*=/.test(html) && !/\sstyle\s*=/.test(html), 'index.html no tiene scripts, manejadores ni estilos en línea');
for (const f of [...js, 'styles.css', 'index.html']) { const t = lee(f).replace(/http:\/\/www\.w3\.org\/[^'"\s]*/g, '');
  ok(!/https?:\/\/|\/\/[a-z0-9-]+\.[a-z]{2,}\//i.test(t), `${f} no nombra ninguna dirección externa`);
  ok(!/\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket|\beval\(|new Function/.test(t), `${f} no hace peticiones ni evalúa código`); }
for (const f of js.filter(x => !/glifos/.test(x))) ok(!/style="/.test(lee(f)), `${f} no genera estilos en línea (la CSP los bloquearía)`);
for (const m of css.matchAll(/url\(([^)]+)\)/g)) ok(fs.existsSync(path.join(ROOT, m[1])), `existe ${m[1]}`);

suite('Datos guardados');
const { cleanSet, cleanProg } = cargar(['cleanSet', 'cleanProg'], ['js/datos.js']);
eq(cleanSet(null), { snd: 'piano', nivel: {}, tipo: {} }, 'ajustes por defecto');
eq(cleanSet({ snd: '<x>', nivel: { 1: 3, 2: 9, x: 1 }, tipo: { '1-teoria': 't1-construir', 'x': 'y', '2-oido': 5 } }), { snd: 'piano', nivel: { 1: 3, 2: 3 }, tipo: { '1-teoria': 't1-construir' } }, 'los ajustes extraños se descartan');
eq(cleanProg({ 't1-oido': { n: 5, ok: 9, racha: 2, mejor: 3 }, '__proto__': { n: 1 }, 'malo': { n: 1 }, 't2-tipo': 'x', 't3-tipo': { n: -1, ok: 'a' } }),
  { 't1-oido': { n: 5, ok: 5, racha: 2, mejor: 3 }, 't3-tipo': { n: 0, ok: 0, racha: 0, mejor: 0 } }, 'el progreso extraño se descarta y los aciertos no superan los intentos');
fin();
