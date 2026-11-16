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
const { cleanSet, cleanProg, has } = cargar(['cleanSet', 'cleanProg', 'has'], ['js/datos.js']);
eq(cleanSet(null), { snd: 'piano', nivel: {}, tipo: {} }, 'ajustes por defecto');
eq(cleanSet({ snd: '<x>', nivel: { 1: 3, 2: 9, x: 1 }, tipo: { '1-teoria': 't1-construir', 'x': 'y', '2-oido': 5 } }), { snd: 'piano', nivel: { 1: 3, 2: 3 }, tipo: { '1-teoria': 't1-construir' } }, 'los ajustes extraños se descartan');
eq(cleanProg({ 't1-oido': { n: 5, ok: 9, racha: 2, mejor: 3 }, '__proto__': { n: 1 }, 'malo': { n: 1 }, 't2-tipo': 'x', 't3-tipo': { n: -1, ok: 'a' } }),
  { 't1-oido': { n: 5, ok: 5, racha: 2, mejor: 3 }, 't3-tipo': { n: 0, ok: 0, racha: 0, mejor: 0 } }, 'el progreso extraño se descarta y los aciertos no superan los intentos');

// niv: desglose por nivel; lo guardado antes no lo tiene y sigue valiendo
eq(cleanProg({ 't1-oido': { n: 5, ok: 3, racha: 0, mejor: 0, niv: { 1: { n: 2, ok: 2 }, 3: { n: 9, ok: 20 }, 4: { n: 1, ok: 1 }, 0: { n: 1, ok: 1 }, 2: 'x' } } }),
  { 't1-oido': { n: 5, ok: 3, racha: 0, mejor: 0, niv: { 1: { n: 2, ok: 2 }, 3: { n: 9, ok: 9 } } } }, 'solo niveles 1 a 3 y ok no supera n');
eq(cleanProg({ 't1-oido': { n: 1, ok: 1, niv: { 1: { n: -3, ok: 'a' }, 2: { n: 1.5, ok: 1 } } } }), { 't1-oido': { n: 1, ok: 1, racha: 0, mejor: 0, niv: { 1: { n: 0, ok: 0 }, 2: { n: 0, ok: 0 } } } }, 'enteros en rango');
eq(cleanProg({ 't1-oido': { n: 1, ok: 1, niv: [1, 2] } }), { 't1-oido': { n: 1, ok: 1, racha: 0, mejor: 0 } }, 'un niv que no es objeto se ignora');
eq(cleanProg({ 't1-oido': { n: 1, ok: 1, niv: {} } }), { 't1-oido': { n: 1, ok: 1, racha: 0, mejor: 0 } }, 'sin niveles no queda niv');
eq(cleanProg({ 't1-oido': { n: 4, ok: 1, racha: 0, mejor: 1 } })['t1-oido'].niv, undefined, 'lo antiguo, sin desglose, se conserva tal cual');

// visto: la bienvenida ya se vio; solo cuenta true estricto
eq(cleanSet({ visto: true }).visto, true, 'visto: true se conserva');
for (const v of [false, 'true', 1, null, {}, [true]]) eq(has(cleanSet({ visto: v }), 'visto'), false, `visto: ${JSON.stringify(v)} se descarta`);
eq(cleanSet({ snd: 'organ', visto: true }), { snd: 'organ', nivel: {}, tipo: {}, visto: true }, 'visto convive con los demás ajustes');

suite('Bienvenida');
const { debeMostrarBienvenida: dmb } = cargar(['debeMostrarBienvenida'], ['js/datos.js']);
const vacio = { set: cleanSet(null), prog: {} };
eq(dmb(vacio, ''), true, 'primera visita: sale');
eq(dmb({ set: cleanSet({ visto: true }), prog: {} }, ''), false, 'con la marca no sale');
eq(dmb({ set: cleanSet(null), prog: { 't1-oido': { n: 1, ok: 1, racha: 1, mejor: 1 } } }, ''), false, 'con progreso previo y sin marca no sale');
eq(dmb(vacio, '?semilla=1'), false, 'con ?semilla= no sale');
eq(dmb(vacio, '?x=2&semilla=12'), false, 'con &semilla= tampoco');
eq(dmb(vacio, '?semilla=abc'), true, 'una semilla no numérica no cuenta (como semillaURL)');
eq(dmb({ set: { visto: 'true' }, prog: {} }, ''), true, 'solo visto === true cuenta');
const bv = lee('js/bienvenida.js');
ok(js.indexOf('js/bienvenida.js') === js.length - 2, 'bienvenida.js se carga justo antes de inicio.js');
ok(/<dialog[^>]*id="bienv"[^>]*aria-labelledby="bvT1"/.test(html) && [1, 2, 3, 4].every(i => new RegExp(`id="bvT${i}" tabindex="-1"`).test(html)), 'el diálogo tiene título por paso, enfocable');
ok(/id="bAyuda"/.test(html) && /abrirBienvenida/.test(bv) && /debeMostrarBienvenida\(store,location\.search\)/.test(lee('js/inicio.js')), 'se reabre desde el pie y sale sola según debeMostrarBienvenida');
ok(/\$\('dialog\[open\]'\)/.test(lee('js/interfaz.js')), 'los atajos globales no actúan con el diálogo abierto');
ok(!/\.style\./.test(bv), 'bienvenida.js no toca estilos en línea');

suite('Sin conexión e instalable');
const sw = lee('sw.js'), lista = [...sw.match(/const ARCHIVOS=\[([^\]]*)\]/)[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
const ls = d => fs.readdirSync(path.join(ROOT, d)).filter(f => fs.statSync(path.join(ROOT, d, f)).isFile()).map(f => d + '/' + f);
const reales = ['./', 'index.html', 'styles.css', 'manifest.webmanifest', ...ls('iconos'), ...ls('fonts').filter(f => /\.woff2?$/.test(f)), ...ls('js').filter(f => f.endsWith('.js')), ...ls('js/temas').filter(f => f.endsWith('.js'))];
eq([...lista].sort(), [...reales].sort(), 'la lista de archivos del service worker coincide con los archivos de la app (si falla, actualiza ARCHIVOS y sube VERSION)');
ok(js.every(f => lista.includes(f)), 'todos los scripts de index.html están en la caché');
ok(/const VERSION='dictado-armonico-v\d+'/.test(sw), 'la caché tiene nombre versionado');
const man = JSON.parse(lee('manifest.webmanifest'));
ok(man.display === 'standalone' && !/^(\/|[a-z]+:)/.test(man.start_url) && !/^(\/|[a-z]+:)/.test(man.scope), 'manifiesto: standalone, start_url y scope relativos');
ok(man.icons.every(i => fs.existsSync(path.join(ROOT, i.src))) && man.icons.some(i => i.sizes === '192x192') && man.icons.some(i => i.sizes === '512x512'), 'manifiesto: los iconos existen (192 y 512 px)');
ok(/rel = 'manifest'|l\.rel='manifest'/.test(lee('js/inicio.js')) && !/rel="manifest"/.test(html), 'el enlace al manifiesto se añade desde inicio.js solo con http(s) (con file:// daría un error de consola)');
ok(/name="theme-color"/.test(html) && /rel="apple-touch-icon"/.test(html), 'index.html tiene el color del tema y el icono de iOS');
ok(/manifest-src 'self'/.test(html) && /worker-src 'self'/.test(html) && !/unsafe-|\*/.test(html.match(/Content-Security-Policy"? content="[^"]*"/)[0]), 'la CSP admite el manifiesto y el worker propios y nada más');
ok(/'serviceWorker' in navigator/.test(lee('js/inicio.js')) && /\^https\?:\$/.test(lee('js/inicio.js')), 'inicio.js solo registra el worker con http(s)');
fin();
