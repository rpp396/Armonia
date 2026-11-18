// Versiones según Semantic Versioning 2.0.0 (https://semver.org/lang/es/). Sin dependencias.
// Las etiquetas del repositorio son «v» + la versión: v1.2.3, v1.3.0-beta.1, v2.0.0+20261118.
//
// Uso desde el flujo de publicación:
//   node .github/semver.mjs <etiqueta nueva> [etiquetas existentes…]
// Falla si la etiqueta nueva no es «v» + una versión SemVer válida, o si no es mayor (por precedencia, §11)
// que todas las versiones ya publicadas. Si vale, escribe «prerelease=true|false» para $GITHUB_OUTPUT.

// La expresión regular oficial de semver.org (gramática BNF de la especificación)
export const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

// «v1.2.3-beta.1+abc» → {major, minor, patch, pre: ['beta', '1'], build: ['abc']}, o null si no es válida
export function parse(etiqueta) {
  if (typeof etiqueta !== 'string' || !etiqueta.startsWith('v')) return null;
  const m = SEMVER.exec(etiqueta.slice(1));
  if (!m) return null;
  return { major: BigInt(m[1]), minor: BigInt(m[2]), patch: BigInt(m[3]),
    pre: m[4] ? m[4].split('.') : [], build: m[5] ? m[5].split('.') : [] };
}

const esNum = s => /^\d+$/.test(s);
const cmpBig = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

// Precedencia (§11): −1, 0 o 1. Los metadatos de compilación no cuentan.
export function compare(a, b) {
  for (const k of ['major', 'minor', 'patch']) { const c = cmpBig(a[k], b[k]); if (c) return c; }
  // una versión preliminar va antes que la versión normal
  if (!a.pre.length || !b.pre.length) return a.pre.length ? -1 : b.pre.length ? 1 : 0;
  for (let i = 0; i < Math.min(a.pre.length, b.pre.length); i++) {
    const x = a.pre[i], y = b.pre[i];
    if (x === y) continue;
    if (esNum(x) && esNum(y)) return cmpBig(BigInt(x), BigInt(y));
    if (esNum(x) !== esNum(y)) return esNum(x) ? -1 : 1; // los numéricos van antes que los alfanuméricos
    return x < y ? -1 : 1;                              // orden ASCII
  }
  return cmpBig(BigInt(a.pre.length), BigInt(b.pre.length));
}

// Comprueba la etiqueta nueva frente a las existentes. Devuelve {ok, error?, prerelease?}.
export function validar(nueva, existentes = []) {
  const v = parse(nueva);
  if (!v) return { ok: false, error: `«${nueva}» no es una versión válida: tiene que ser «v» + MAYOR.MENOR.PARCHE según Semantic Versioning 2.0.0 (por ejemplo v1.2.3 o v1.3.0-beta.1), sin ceros a la izquierda.` };
  for (const e of existentes) {
    if (e === nueva) continue;
    const p = parse(e);
    if (p && compare(v, p) <= 0) return { ok: false, error: `«${nueva}» no es mayor que «${e}», que ya existe. Una versión nueva tiene que tener más precedencia que todas las anteriores.` };
  }
  return { ok: true, prerelease: v.pre.length > 0 };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [nueva, ...existentes] = process.argv.slice(2);
  const r = validar(nueva, existentes);
  if (!r.ok) { console.error(`::error::${r.error}`); process.exit(1); }
  console.log(`prerelease=${r.prerelease}`);
}
