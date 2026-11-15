// Cada generador, en los tres niveles y con muchas semillas: la solución está entre las opciones, se corrige bien,
// la explicación no queda vacía ni con datos rotos, la partitura se dibuja y el sonido es reproducible.
import { cargar, suite, ok, fin } from './lib.mjs';

const { EJ, crearRng, corregir, completo, solucionHTML, PROGRAMA } = cargar(['EJ', 'crearRng', 'corregir', 'completo', 'solucionHTML', 'PROGRAMA']);
const N = +(process.env.SEMILLAS || 300);
const roto = s => /undefined|NaN|\[object|null(?!\w)/.test(s);
const secOK = sec => Array.isArray(sec) && sec.length > 0 && sec.every(e => Number.isFinite(e.t) && e.t >= 0 && e.d > 0 && e.m.length > 0 && e.m.every(m => Number.isInteger(m) && m >= 30 && m <= 96));

suite('Catálogo');
for (const t of PROGRAMA) for (const modo of ['teoria', 'oido']) ok(EJ.some(e => e.tema === t.n && e.modo === modo), `el tema ${t.n} tiene ejercicios de ${modo}`);
ok(new Set(EJ.map(e => e.id)).size === EJ.length, 'los id de los generadores no se repiten');
ok(EJ.every(e => /^t[1-9]-[a-z0-9-]{1,30}$/.test(e.id)), 'los id tienen la forma que acepta el guardado del progreso');

for (const g of EJ) {
  suite(`${g.id} (${g.titulo})`);
  const vistos = new Set(); let errores = 0;
  const falla = (cond, msg) => { if (!cond && errores < 6) { errores++; ok(false, msg); } else if (cond) ok(true, msg); };
  for (let nv = 1; nv <= 3; nv++) for (let s = 0; s < N; s++) {
    let e; const donde = `nivel ${nv}, semilla ${s}`;
    try { e = g.gen(crearRng(s * 7919 + nv), nv); } catch (err) { falla(false, `${donde}: gen lanza ${err.message}`); continue; }
    vistos.add(e.enunciado + JSON.stringify(e.sol) + e.resumen);
    falla(typeof e.enunciado === 'string' && e.enunciado.length > 10 && !roto(e.enunciado), `${donde}: enunciado «${e.enunciado}»`);
    falla(typeof e.resumen === 'string' && e.resumen.length > 5 && !roto(e.resumen), `${donde}: resumen «${e.resumen}»`);
    falla(e.campos.length >= 1, `${donde}: tiene campos`);
    for (const c of e.campos) {
      const vs = c.opciones.map(o => o.v);
      falla(vs.length >= 2 && new Set(vs).size === vs.length, `${donde}: opciones distintas en «${c.etiqueta}» (${vs.join(' | ')})`);
      falla(c.opciones.every(o => o.t && !roto(o.t)), `${donde}: textos de las opciones de «${c.etiqueta}»`);
      const sol = e.sol[c.id];
      if (c.multi) falla(Array.isArray(sol) && sol.every(v => vs.includes(String(v))), `${donde}: la solución múltiple de «${c.etiqueta}» está entre las opciones`);
      else falla(vs.includes(String(sol)), `${donde}: la solución de «${c.etiqueta}» (${sol}) está entre las opciones (${vs.join(' | ')})`);
    }
    // la solución se da por buena; cambiar un campo por otra opción no aceptada, no
    const bien = {}; e.campos.forEach(c => { bien[c.id] = c.multi ? e.sol[c.id].map(String) : String(e.sol[c.id]); });
    falla(completo(e, bien) && corregir(e, bien).ok, `${donde}: la solución se corrige como correcta`);
    for (const c of e.campos) {
      const acepta = (e.acepta && e.acepta[c.id] || []).map(String), mal = { ...bien };
      if (c.multi) { const otra = c.opciones.find(o => !bien[c.id].includes(o.v)); mal[c.id] = otra ? bien[c.id].concat(otra.v) : bien[c.id].slice(1); }
      else { const otra = c.opciones.find(o => o.v !== bien[c.id] && !acepta.includes(o.v)); if (!otra) continue; mal[c.id] = otra.v; }
      falla(!corregir(e, mal).ok, `${donde}: una respuesta distinta en «${c.etiqueta}» se corrige como incorrecta`);
      let exp = ''; try { exp = e.explicar(mal); } catch (err) { exp = 'undefined ' + err.message; }
      falla(exp.length > 40 && !roto(exp), `${donde}: explicación con error en «${c.etiqueta}»: ${exp.slice(0, 300)}`);
      if (e.sonarResp) { let r; try { r = e.sonarResp(mal); } catch (err) { r = 'x'; } falla(r === null || secOK(r), `${donde}: sonarResp`); }
    }
    let exp = ''; try { exp = e.explicar(bien); } catch (err) { exp = 'undefined ' + err.message; }
    falla(exp.length > 40 && !roto(exp), `${donde}: explicación: ${exp.slice(0, 300)}`);
    falla(!roto(solucionHTML(e)), `${donde}: solución en palabras`);
    for (const v of [e.vista, e.vistaSol]) if (v) falla(v.startsWith('<svg') && !roto(v.replace(/aria-label="[^"]*"/, '')), `${donde}: partitura`);
    if (g.modo === 'oido') falla(secOK(e.sonar), `${donde}: el ejercicio de oído suena`); else if (e.sonar) falla(secOK(e.sonar), `${donde}: sonido`);
    if (g.modo === 'oido') falla(!e.vista, `${donde}: el ejercicio de oído no enseña la partitura antes de responder`);
  }
  ok(vistos.size >= 8, `genera ejercicios variados (${vistos.size} distintos)`);
}
suite('Dobles alteraciones');
// el nivel básico no muestra ninguna; en el avanzado aparecen en todos los temas donde tienen sentido
const textoDe = e => { const sol = {}; e.campos.forEach(c => { sol[c.id] = e.sol[c.id]; });
  return e.enunciado + e.resumen + e.explicar(sol) + JSON.stringify(e.campos.filter(c => c.id !== 'alt').map(c => c.opciones.map(o => o.t))); };
const dobles = (g, nv) => { let k = 0; for (let s = 0; s < 200; s++) if (/♯♯|♭♭/.test(textoDe(g.gen(crearRng(s * 31 + nv), nv)))) k++; return k / 200; };
for (const g of EJ.filter(e => e.modo === 'teoria')) {
  ok(dobles(g, 1) === 0, `${g.id}: sin dobles alteraciones en el nivel básico`);
  if (!/^t(4|6-armadura|6-campo)/.test(g.id)) ok(dobles(g, 3) >= 0.04, `${g.id}: hay dobles alteraciones en el nivel avanzado (${Math.round(dobles(g, 3) * 100)} %)`);
}
const conAlt = EJ.filter(g => g.modo === 'teoria').flatMap(g => [g.gen(crearRng(1), 3)]).flatMap(e => e.campos).filter(c => c.id === 'alt');
ok(conAlt.length > 0 && conAlt.every(c => ['-2', '2'].every(v => c.opciones.some(o => o.v === v))), 'en avanzado, los botones de alteración incluyen doble sostenido y doble bemol');
fin();
