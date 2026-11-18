// Las reglas de versión de las releases (.github/semver.mjs): Semantic Versioning 2.0.0 con prefijo «v».
import assert from 'node:assert/strict';
import { parse, compare, validar } from '../.github/semver.mjs';

let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };

// válidas e inválidas (ejemplos de la especificación y casos frontera)
for (const v of ['v0.0.0', 'v1.0.0', 'v1.2.3', 'v10.20.30', 'v1.0.0-alpha', 'v1.0.0-alpha.1', 'v1.0.0-0.3.7', 'v1.0.0-x.7.z.92',
  'v1.0.0-x-y-z.--', 'v1.0.0-alpha+001', 'v1.0.0+20130313144700', 'v1.0.0-beta+exp.sha.5114f85', 'v1.0.0+21AF26D3----117B344092BD'])
  ok(parse(v), `${v} es válida`);
for (const v of ['1.2.3', 'V1.2.3', 'v1', 'v1.2', 'v1.2.3.4', 'v01.2.3', 'v1.02.3', 'v1.2.03', 'v1.2.3-', 'v1.2.3-01', 'v1.2.3-alpha..1',
  'v1.2.3+', 'v1.2.3+a+b', 'v1.2.3-alpha_beta', 'v-1.2.3', 'v1.2.3 ', 'vx.y.z', '', undefined])
  ok(!parse(v), `${v} no es válida`);

// precedencia: el ejemplo del §11 de la especificación, en orden
const orden = ['v1.0.0-alpha', 'v1.0.0-alpha.1', 'v1.0.0-alpha.beta', 'v1.0.0-beta', 'v1.0.0-beta.2', 'v1.0.0-beta.11', 'v1.0.0-rc.1',
  'v1.0.0', 'v1.0.1', 'v1.1.0', 'v1.9.0', 'v1.10.0', 'v1.11.0', 'v2.0.0'];
for (let i = 0; i < orden.length; i++) for (let j = 0; j < orden.length; j++)
  ok(Math.sign(compare(parse(orden[i]), parse(orden[j]))) === Math.sign(i - j), `${orden[i]} frente a ${orden[j]}`);
ok(compare(parse('v1.0.0+a'), parse('v1.0.0+b')) === 0, 'los metadatos de compilación no cuentan');

// validar: la etiqueta nueva tiene que ser válida y mayor que todas las existentes
ok(validar('v1.0.0').ok && validar('v1.0.0').prerelease === false, 'primera versión');
ok(validar('v1.1.0-beta.1', ['v1.0.0']).prerelease === true, 'preliminar');
ok(validar('v1.0.0+build-1', ['v0.9.0']).prerelease === false, 'un guion en los metadatos no la hace preliminar');
ok(validar('v1.0.1', ['v1.0.0', 'v1.0.1']).ok, 'la propia etiqueta no cuenta');
ok(validar('v1.0.0', ['v1.0.0-rc.1']).ok, 'la versión normal va después de su preliminar');
ok(!validar('v1.0.0-rc.1', ['v1.0.0']).ok, 'no se publica una preliminar de una versión que ya salió');
ok(!validar('v1.0.0', ['v1.1.0']).ok, 'no se vuelve atrás');
ok(!validar('v1.0.0+b2', ['v1.0.0+b1']).ok, 'misma precedencia: no es una versión nueva');
ok(validar('v1.2.0', ['borrador', 'v1.1.9']).ok, 'las etiquetas que no son versiones se ignoran');
ok(!validar('v1.2').ok && /Semantic Versioning/.test(validar('v1.2').error), 'mensaje claro si no es válida');

console.log(`semver: ${n} comprobaciones correctas`);
