// Motor de teoría contra los ejemplos de los apuntes del curso (Temas/A1 - tema N.pdf).
import { cargar, suite, ok, eq, fin } from './lib.mjs';

const T = cargar(['nota', 'nom', 'cif', 'intervalo', 'sumar', 'invertir', 'iTxt', 'iNom', 'tonosTxt', 'explicaIntervalo', 'acorde', 'cifrado', 'disponer',
  'clasificar', 'bajoCifrado', 'cifradoEstructura', 'notasEstructura', 'armaduraDe', 'tonicaDe', 'campoDiatonico', 'tritonoDe', 'semitonoMayor',
  'semitonoMenor', 'escala', 'patron', 'acordeDeGrado', 'gradosDe', 'tensDisp', 'TENS', 'TENS_DISP', 'ESC_KEYS', 'TIPOS', 'gradoAcademico',
  'gradoPopular', 'funcionesDe', 'midi', 'paso', 'pcDe', 'vozEstructura', 'cumpleLIL', 'BASES'], ['js/datos.js', 'js/teoria.js']);
const { nota } = T;
const iv = (a, b) => { const x = T.intervalo(nota(a), nota(b)); return T.iTxt(x.num, x.cal); };
const par = s => { const [a, b] = s.split('-'); return [a, b]; };
// en los apuntes los ejemplos son ascendentes: la segunda nota se sube hasta quedar por encima de la primera
const asc = (a, b) => { const x = nota(a); let y = nota(b); if (T.paso(y) < T.paso(x) || (T.paso(y) === T.paso(x) && T.midi(y) < T.midi(x))) y = { ...y, o: y.o + 1 }; const r = T.intervalo(x, y); return T.iTxt(r.num, r.cal); };

suite('Tema 1 · intervalos de los apuntes');
const casos = {
  '5j': 're-la mib-sib fa#-do# sib-fa si-fa#', '4j': 'la-re sib-mib do#-fa# fa-sib fa#-si',
  '2M': 'mi-fa# sib-do la-si', '2m': 'mi-fa sib-dob la-sib', '3M': 'fa#-la# sol-si lab-do', '3m': 'fa#-la sol-sib lab-dob',
  '6M': 'si-sol# la-fa# reb-sib', '6m': 'si-sol la-fa reb-sibb', '7M': 're-do# lab-sol fa#-mi#', '7m': 're-do lab-solb fa#-mi',
  '5-': 'mi-sib re#-la si-fa', '4-': 're-solb fa-sibb la#-re', '2-': 're-mibb fa#-solb si-dob', '3-': 'fa-labb mi-solb do#-mib',
  '6-': 'sol-mibb re#-sib mi-dob', '7-': 'sol#-fa do#-sib re-dob', '5+': 're-la# sib-fa# lab-mi', '4+': 'fa-si sol-do# mib-la',
  '2+': 're-mi# sib-do# fa-sol#', '3+': 'fa-la# reb-fa# lab-do#', '6+': 'lab-fa# sib-sol# mib-do#', '7+': 'reb-do# sib-la# fa-mi#',
};
for (const [esp, lista] of Object.entries(casos)) for (const p of lista.split(' ')) eq(asc(...par(p)), esp, p);
eq(iv('re4', 'reb5'), '8-', 'octava disminuida re-reb'); eq(iv('mi4', 'mi#5'), '8+', 'octava aumentada'); eq(iv('re4', 're#4'), '1+', 'unísono aumentado');
eq(iv('do4', 'reb5'), '9m', 'novena menor'); eq(iv('do4', 'fa#5'), '11+', 'oncena aumentada'); eq(iv('do4', 'lab5'), '13m', 'trecena menor');
eq(T.tonosTxt(9), '4½ T', 'tonos'); eq(T.tonosTxt(1), '½ T', 'semitono'); eq(T.tonosTxt(12), '6 T', 'octava');
eq(T.invertir(3, 'M'), { num: 6, cal: 'm' }, 'inversión de 3M'); eq(T.invertir(5, '-'), { num: 4, cal: '+' }, 'inversión de 5-'); eq(T.invertir(4, 'j'), { num: 5, cal: 'j' }, 'inversión de 4j');
eq(T.nom(T.sumar(nota('la'), 6, 'M')), 'fa♯', 'la + 6M'); eq(T.nom(T.sumar(nota('do'), 3, 'm', -1)), 'la', 'do − 3m'); eq(T.nom(T.sumar(nota('reb'), 6, 'm')), 'si♭♭', 'reb + 6m');
{ const e = T.explicaIntervalo(nota('la4'), nota('fa#5')); ok(e.pasos.join(' ').includes('seis') || e.pasos.join(' ').includes('6 notas'), 'la explicación cuenta las notas'); ok(e.pasos.join(' ').includes('9 semitonos'), 'la explicación da 9 semitonos'); ok(e.pasos.join(' ').includes('sexta mayor'), 'la explicación concluye sexta mayor'); }
// toda combinación de nota e intervalo se explica y coincide
for (const l of ['do', 're', 'mi', 'fa', 'sol', 'la', 'si']) for (const a of ['b', '', '#']) for (let num = 1; num <= 13; num++) for (const c of ['j', 'M', 'm', '+', '-']) {
  const x = nota(l + a), y = T.sumar(x, num, c); if (!y) continue; const r = T.intervalo(x, y);
  if (r.lo !== x) continue; // 1- no existe hacia arriba
  eq(T.iTxt(r.num, r.cal), num + c, `${l}${a} + ${num}${c}`); ok(T.explicaIntervalo(x, y).pasos.at(-1).includes(T.iNom(num, c)), `explica ${l}${a} ${num}${c}`);
}

suite('Temas 2 y 3 · acordes y cifrados');
const ac = (f, t) => T.acorde(nota(f), t), notas = a => a.notas.map(T.nom).join(' ');
eq(notas(ac('do', 'M')), 'do mi sol', 'C'); eq(notas(ac('do', 'm')), 'do mi♭ sol', 'Cm'); eq(notas(ac('do', 'aug')), 'do mi sol♯', 'Caug'); eq(notas(ac('do', 'dim')), 'do mi♭ sol♭', 'Cº');
eq(notas(ac('do', 'dim7')), 'do mi♭ sol♭ si♭♭', 'Cº7'); eq(notas(ac('do', 'm7b5')), 'do mi♭ sol♭ si♭', 'Cm7(b5)'); eq(notas(ac('do', 'augmaj7')), 'do mi sol♯ si', 'Caugmaj7');
eq(T.cifrado(ac('do', 'm'), 1), 'Cm/E♭', 'Cm/Eb'); eq(T.cifrado(ac('si', 'aug7'), 1), 'Baug7/D♯', 'Baug7/D#'); eq(T.cifrado(ac('mi#', 'dim7'), 2), 'E♯º7/B', 'E#º7/B');
eq(T.cifrado(ac('fa', 'm7b5'), 2), 'Fm7(♭5)/C♭', 'Fm7(b5)/Cb'); eq(T.cifrado(ac('re', 'maj7'), 3), 'Dmaj7/C♯', 'Dmaj7/C#');
eq(T.disponer(ac('do', 'M'), 1).map(T.nom).join(' '), 'mi sol do', 'primera inversión'); eq(T.disponer(ac('do', 'M'), 0, 1).map(T.nom).join(' '), 'do sol mi', 'posición de tercera');
eq(T.disponer(ac('do', 'M'), 0, 0).map(T.nom).join(' '), 'do mi sol do', 'posición de octava');
for (const t of Object.keys(T.TIPOS)) eq(T.clasificar(ac('re', t).notas), t, 'clasificar ' + t);
// bajo cifrado: ejemplos de los apuntes (armadura, acorde, estado → cifras)
const bc = (f, t, est, arm) => T.bajoCifrado(T.disponer(ac(f, t), est), arm).cifras.join('/');
eq(bc('si', 'm', 1, 2), '6', 'Bm/D en Re'); eq(bc('sol', 'M', 0, 2), '', 'G en Re'); eq(bc('fa#', 'm', 2, 2), '6/4', 'F#m/C#'); eq(bc('re', 'M', 2, 2), '6/4', 'D/A');
eq(bc('si', 'M', 2, 1), '♯6/4', 'B/F# en Sol'); eq(bc('mi', 'M', 0, 1), '♯', 'E en Sol'); eq(bc('la', 'aug', 0, 1), '♯5/♯', 'Aaug en Sol'); eq(bc('sol', 'm', 2, 1), '♭6/4', 'Gm/D en Sol');
eq(bc('si#', 'dim', 2, 1), '♯6/♯4', 'B#º/F#'); eq(bc('do#', 'm', 0, 1), '♯5', 'C#m en Sol'); eq(bc('mi', 'M', 2, 1), '♯6/4', 'E/B en Sol');
eq(bc('la', '7', 2, -1), '♯6/4/3', 'A7/E en Fa'); eq(bc('sol', 'mmaj7', 0, -1), '♯7', 'Gmmaj7 en Fa'); eq(bc('sib', 'm7', 2, -1), '♭6/4/♭3', 'Bbm7/F en Fa');
eq(bc('re', 'mmaj7', 1, 3), '6/5', 'Dmmaj7/F'); eq(bc('si', '7', 3, 3), '♯4/2', 'B7/A en La'); eq(bc('fa', 'maj7', 0, 3), '7/♮5', 'Fmaj7 en La');
eq(bc('do#', 'm7b5', 1, 3), '6/5/♮', 'C#m7(b5)/E en La'); eq(bc('lab', 'maj7', 2, 3), '♮6/♭4/♮3', 'Abmaj7/Eb en La');

suite('Tema 5 · tensiones');
const est = (f, base, tens, sus = 0) => ({ fund: nota(f), base, tens, sus });
eq(T.cifradoEstructura(est('do', '7', ['9'])).txt, 'C7 9', 'C7 9'); eq(T.cifradoEstructura(est('do', '7', ['b9'])).txt, 'C7 (♭9)', 'C7(b9)');
eq(T.cifradoEstructura(est('do', 'maj7', ['13', '9', '#11'])).txt, 'Cmaj7 (9 ♯11 13)', 'Cmaj7(9 #11 13)'); eq(T.cifradoEstructura(est('do', '6', [])).txt, 'C6', 'C6');
eq(T.cifradoEstructura(est('do', 'M', ['9'])).txt, 'Cadd9', 'Cadd9'); eq(T.cifradoEstructura(est('do', '7', ['9'], 4)).txt, 'C7sus4 9', 'C7sus4 9'); eq(T.cifradoEstructura(est('do', 'maj7', [], 2)).txt, 'Cmaj7sus2', 'Cmaj7sus2');
eq(T.notasEstructura(est('do', 'maj7', ['9', '#11', '13'])).map(T.nom).join(' '), 'do mi sol si re fa♯ la', 'notas de Cmaj7(9 #11 13)');
eq(T.notasEstructura(est('do', '7', [], 4)).map(T.nom).join(' '), 'do fa sol si♭', 'C7sus4'); eq(T.notasEstructura(est('do', '6', ['9', '#11'])).map(T.nom).join(' '), 'do mi sol la re fa♯', 'C6(9 #11)');

suite('Tema 6 · campo diatónico y escalas');
eq(T.campoDiatonico(0).map(T.nom).join(' '), 'fa do sol re la mi si', 'campo sin alteraciones');
eq(T.tritonoDe(0).map(T.nom).join('-'), 'fa-si', 'tritono'); eq(T.semitonoMayor(0).map(T.nom).join('-'), 'si-do', 'semitono del modo mayor'); eq(T.semitonoMenor(0).map(T.nom).join('-'), 'fa-mi', 'semitono del modo menor');
eq(T.armaduraDe(nota('re'), 'M'), 2, 'Re mayor'); eq(T.armaduraDe(nota('do'), 'm'), -3, 'do menor'); eq(T.armaduraDe(nota('fa#'), 'm'), 3, 'fa# menor'); eq(T.armaduraDe(nota('solb'), 'M'), -6, 'Solb mayor');
for (let n = -7; n <= 7; n++) for (const m of ['M', 'm']) eq(T.armaduraDe(T.tonicaDe(n, m), m), n, `tónica de ${n} ${m}`);
eq(T.escala(nota('do'), 'mayorArm').map(T.nom).join(' '), 'do re mi fa sol la♭ si', 'Do mayor armónica'); eq(T.escala(nota('do'), 'menorArm').map(T.nom).join(' '), 'do re mi♭ fa sol la♭ si', 'do menor armónica');
eq(T.escala(nota('do'), 'menorMel').map(T.nom).join(' '), 'do re mi♭ fa sol la si', 'do menor melódica'); eq(T.escala(nota('la'), 'menorNat').map(T.nom).join(' '), 'la si do re mi fa sol', 'la menor natural');
eq(T.patron('mayor'), [2, 2, 1, 2, 2, 2, 1], 'patrón mayor'); eq(T.patron('menorArm'), [2, 1, 2, 2, 1, 3, 1], 'patrón menor armónica');

suite('Temas 7 y 8 · acordes sobre los grados (tablas de los apuntes, en Do mayor y do menor)');
const tabla = (esc, cuatro) => [1, 2, 3, 4, 5, 6, 7].map(g => T.cifrado(T.acordeDeGrado(nota('do'), esc, g, cuatro))).join(' ');
eq(tabla('mayor', false), 'C Dm Em F G Am Bº', 'tríadas mayor'); eq(tabla('mayorArm', false), 'C Dº Em Fm G A♭aug Bº', 'tríadas mayor armónica');
eq(tabla('mayor', true), 'Cmaj7 Dm7 Em7 Fmaj7 G7 Am7 Bm7(♭5)', 'tétradas mayor'); eq(tabla('mayorArm', true), 'Cmaj7 Dm7(♭5) Em7 Fmmaj7 G7 A♭augmaj7 Bº7', 'tétradas mayor armónica');
eq(tabla('menorNat', false), 'Cm Dº E♭ Fm Gm A♭ B♭', 'tríadas menor natural'); eq(tabla('menorArm', false), 'Cm Dº E♭aug Fm G A♭ Bº', 'tríadas menor armónica'); eq(tabla('menorMel', false), 'Cm Dm E♭aug F G Aº Bº', 'tríadas menor melódica');
eq(tabla('menorNat', true), 'Cm7 Dm7(♭5) E♭maj7 Fm7 Gm7 A♭maj7 B♭7', 'tétradas menor natural'); eq(tabla('menorArm', true), 'Cmmaj7 Dm7(♭5) E♭augmaj7 Fm7 G7 A♭maj7 Bº7', 'tétradas menor armónica');
eq(tabla('menorMel', true), 'Cmmaj7 Dm7 E♭augmaj7 F7 G7 Am7(♭5) Bm7(♭5)', 'tétradas menor melódica');
// toda tensión disponible de la tabla es una nota de la escala a ese intervalo de la fundamental
for (const esc of T.ESC_KEYS) for (let g = 1; g <= 7; g++) { const sc = T.escala(nota('do'), esc), a = T.acordeDeGrado(nota('do'), esc, g, true), d = T.tensDisp(esc, g);
  for (const t of d.t) { const x = T.sumar(a.fund, ...T.TENS[t]); ok(x && sc.some(n => T.pcDe(n) === T.pcDe(x)), `${esc} ${g}: ${t} está en la escala`); }
  if (d.seis) { const x = T.sumar(a.fund, 6, 'M'); ok(sc.some(n => T.pcDe(n) === T.pcDe(x)), `${esc} ${g}: la sexta mayor está en la escala`); } }
eq(T.gradosDe(ac('sol', '7'), nota('do'), 'M').map(x => x.etiq), ['V', 'VMa'], 'G7 en Do mayor'); eq(T.gradosDe(ac('fa', '7'), nota('do'), 'm').map(x => x.etiq), ['IVmel'], 'F7 en do menor');
eq(T.gradoAcademico(5, 'mayor', 1, true), 'V6/5', 'V6/5'); eq(T.gradoAcademico(3, 'menorNat', 2, false), 'IIInat6/4', 'IIInat6/4'); eq(T.gradoPopular(1, 'mayor', 1), 'I/3ª', 'I/3ª'); eq(T.gradoPopular(6, 'mayor', 3), 'VI/7ª', 'VI/7ª');

suite('Tema 9 · funciones');
eq(T.funcionesDe('M', 'VI'), [{ f: 'T', cert: 'u' }, { f: 'S', cert: 'c' }], 'VI en mayor'); eq(T.funcionesDe('M', 'III'), [{ f: 'T', cert: 'c' }, { f: 'D', cert: 'c' }], 'III en mayor');
eq(T.funcionesDe('m', 'IIInat'), [{ f: 'T', cert: 'u' }], 'IIInat'); eq(T.funcionesDe('m', 'VIInat'), [{ f: 'D', cert: 'u' }], 'VIInat'); eq(T.funcionesDe('M', 'VIMa'), [{ f: 'S', cert: 's' }], 'VIMa');
for (const m of ['M', 'm']) for (const esc of (m === 'M' ? ['mayor', 'mayorArm'] : ['menorArm', 'menorNat', 'menorMel'])) for (let g = 1; g <= 7; g++) {
  const e = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][g - 1] + { mayor: '', mayorArm: 'Ma', menorArm: '', menorNat: 'nat', menorMel: 'mel' }[esc]; ok(T.funcionesDe(m, e).length >= 1, `${e} (${m}) tiene función`); }
suite('Disposición de las estructuras (tema 5)');
{ const voz = (f, base, sus, tens, opt) => T.vozEstructura({ fund: nota(f), base, sus, tens }, opt);
  const v = voz('do', '7', 0, ['b13']);
  eq(v.notas.map(n => T.nom(n)).sort(), ['do', 'la♭', 'mi', 'si♭'], 'C7(♭13): la ♭13 sustituye a la quinta');
  ok(!voz('do', '7', 0, ['13']).notas.some(n => T.nom(n) === 'sol'), 'C7 13: sin quinta');
  ok(voz('si', 'm7b5', 0, ['b13']).notas.some(n => T.nom(n) === 'fa'), 'Bm7(♭5)(♭13): la quinta disminuida se conserva');
  eq(voz('mi', '7', 0, ['b9'], { cascara: true }).rol.slice().sort(), ['3', '7', 'f', 't'], 'cáscara: fundamental, tercera, séptima y tensión');
  // todas las estructuras: fundamental sola en el bajo (mi2–re♯3), las demás en el registro central y dentro de los LIL
  let malas = [];
  for (const f of ['do', 'do#', 'reb', 're', 'mib', 'mi', 'fa', 'fa#', 'solb', 'sol', 'lab', 'la', 'sib', 'si'])
    for (const base of Object.keys(T.BASES)) for (const sus of [0, 2, 4]) for (const tens of [[], ['9'], ['b9'], ['#11'], ['13'], ['b13'], ['9', '13'], ['9', '#11', '13'], ['9', '11']]) {
      if (sus === 2 && tens.includes('9')) continue;
      const x = voz(f, base, sus, tens); if (!x) continue; const ms = x.notas.map(T.midi);
      if (!(ms[0] >= 40 && ms[0] <= 51 && ms.slice(1).every(m => m >= 53 && m <= 84 && m > ms[0]) && T.cumpleLIL(ms) && x.rol[0] === 'f')) malas.push(f + base + sus + tens.join(','));
    }
  ok(malas.length === 0, `registro y LIL en todas las estructuras (${malas.slice(0, 5).join(' | ')})`);
}
fin();
