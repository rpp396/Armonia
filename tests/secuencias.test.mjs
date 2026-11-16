// Funciones puras de secuencias.js: las ayudas de escucha «Lento» y «Solo el bajo» de los dictados.
import { cargar, suite, ok, eq, fin } from './lib.mjs';

const { ralentizar, soloBajo, secProgresion } = cargar(['ralentizar', 'soloBajo', 'secProgresion'], ['js/datos.js', 'js/teoria.js', 'js/secuencias.js']);
const prog = secProgresion([{ bajo: 36, voces: [60, 64, 67] }, { bajo: 43, voces: [59, 62, 67] }], 1.5);

suite('Solo el bajo');
const b = soloBajo(prog);
eq(b.length, 2, 'un evento de bajo por acorde');
ok(b.every(e => e.r === 'bass'), 'solo quedan eventos con r:bass');
eq(b.map(e => e.m[0]), [36, 43], 'son las notas del bajo, en orden');
eq(prog.length, 4, 'la secuencia original no se modifica');
eq(soloBajo([{ t: 0, m: [60], d: 1 }]), [], 'sin bajo no queda nada');

suite('Lento');
const l = ralentizar(prog), l2 = ralentizar(prog, 2);
eq(l.map(e => e.t), prog.map(e => e.t * 1.5), 'el momento de cada evento se multiplica por 1,5');
eq(l.map(e => e.d), prog.map(e => e.d * 1.5), 'la duración se multiplica por 1,5');
eq(l2.map(e => e.t), prog.map(e => e.t * 2), 'admite otro factor');
eq(l.map(e => e.m), prog.map(e => e.m), 'las notas no cambian');
eq(l.map(e => e.r), prog.map(e => e.r), 'el papel no cambia');
eq(prog[1].t, 0, 'la secuencia original no se modifica');
eq(ralentizar(soloBajo(prog)).length, 2, 'se pueden combinar');
fin();
