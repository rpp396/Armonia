// Dictado Armónico · Motor de ejercicios: registro de generadores, opciones de respuesta y corrección. No toca el DOM.
// Script clásico: comparte el ámbito global con los demás de js/.
'use strict';

/* ---------- Registro ---------- */
// Un generador: {id, tema, modo:'teoria'|'oido', titulo, gen(R, nivel)}. gen devuelve un ejercicio:
//   enunciado (html) · vista (html, la partitura; '' si no hay) · vistaSol (html que se revela al corregir)
//   sonar (secuencia de audio.js o null) · sonarResp(resp) → secuencia de lo que el alumno respondió (opcional)
//   ref: {tonica, cadencia} → secuencias de referencia que se oyen aparte, con su propio botón (opcional; ejercicios con cadencia)
//   campos: [{id, etiqueta, opciones:[{v, t, voz}], multi}] · sol: {campo: valor | [valores]} · acepta: {campo: [otros valores válidos]}
//   explicar(resp) → html con la explicación paso a paso · resumen: una línea con el porqué
const EJ=[];
function registrar(def){ EJ.push(def); }
const ejerciciosDe=(tema,modo)=>EJ.filter(e=>e.tema===tema&&e.modo===modo);
const generador=id=>EJ.find(e=>e.id===id);

/* ---------- Opciones ---------- */
const op=(v,t,voz)=>({v:String(v),t:t==null?esc(String(v)):t,voz:voz||null});
const campo=(id,etiqueta,opciones,multi)=>({id,etiqueta,opciones,multi:!!multi});
// elección múltiple: la correcta más n−1 distractores distintos, barajados
function eleccion(R,correcta,candidatas,n=4){
  const vistos=new Set([correcta.v]), otras=[];
  for(const c of R.shuffle(candidatas.filter(Boolean))){ if(vistos.has(c.v)) continue; vistos.add(c.v); otras.push(c); if(otras.length===n-1) break; }
  return R.shuffle([correcta,...otras]);
}
const campoNum=(desde=1,hasta=8)=>campo('num','Intervalo',Array.from({length:hasta-desde+1},(_,i)=>op(desde+i,I_NOM[desde+i][0].toUpperCase()+I_NOM[desde+i].slice(1))));
const campoCal=()=>campo('cal','Calidad',[op('-','Disminuido'),op('m','Menor'),op('j','Justo'),op('M','Mayor'),op('+','Aumentado')]);
const campoLetra=(id='letra',etiq='Nota')=>campo(id,etiq,LAT.map((x,i)=>op(i,x[0].toUpperCase()+x.slice(1))));
const campoAlt=(max=2,id='alt')=>campo(id,'Alteración',[-2,-1,0,1,2].filter(a=>Math.abs(a)<=max).map(a=>op(a,a?ALT[a]:'♮ natural',['doble bemol','bemol','natural','sostenido','doble sostenido'][a+2])));
const campoTipoTriada=(tipos=TRIADAS)=>campo('tipo','Tipo de tríada',tipos.map(t=>op(t,TIPOS[t].nom[0].toUpperCase()+TIPOS[t].nom.slice(1))));

/* ---------- Corrección ---------- */
const igualConj=(a,b)=>a.length===b.length&&a.every(x=>b.includes(x));
function campoBien(ej,c,r){ const s=ej.sol[c.id];
  if(c.multi) return igualConj((r||[]).map(String),s.map(String));
  return r!=null&&(String(r)===String(s)||!!(ej.acepta&&ej.acepta[c.id]&&ej.acepta[c.id].map(String).includes(String(r)))); }
function corregir(ej,resp){ const campos={}; let ok=true; for(const c of ej.campos){ campos[c.id]=campoBien(ej,c,resp[c.id]); ok=ok&&campos[c.id]; } return {ok,campos}; }
const completo=(ej,resp)=>ej.campos.every(c=>c.multi||resp[c.id]!=null);
const textoOp=(c,v)=>{ const o=c.opciones.find(x=>x.v===String(v)); return o?o.t:esc(String(v)); };
// la solución en palabras, campo por campo
function solucionHTML(ej){ return ej.campos.map(c=>{ const s=ej.sol[c.id]; const t=c.multi?(s.length?s.map(v=>textoOp(c,v)).join(', '):'ninguna'):textoOp(c,s); return `<span class="solc"><span class="soll">${esc(c.etiqueta)}:</span> <b>${t}</b></span>`; }).join(' '); }

/* ---------- Ayudas comunes de los generadores ---------- */
// fundamentales según el nivel: naturales; más las alteradas habituales; más el resto
function fundamentales(nv){ const nat=[0,1,2,3,4,5,6].map(l=>N(l,0)); if(nv<=1) return nat;
  const b=['sib','mib','lab','fa#','do#'].map(nota); return nv===2?nat.concat(b):nat.concat(b,['reb','solb','sol#','re#','la#','dob'].map(nota)); }
// alteración más grande que puede aparecer en las notas de un ejercicio de teoría: básico, simples; intermedio y avanzado, también
// dobles (doble sostenido y doble bemol). Los de oído se quedan en simples: la ortografía no se oye.
const topeAlt=nv=>nv<=1?1:2;
// En avanzado, una parte de los ejercicios exige una doble alteración: si no, en los temas 6 a 9 casi no saldrían (solo aparecen
// en tonalidades de cinco o más alteraciones). Se decide una vez por ejercicio, fuera de intentar(), para que el sesgo no se diluya.
const pideDoble=(R,nv)=>nv>=3&&R.chance(0.35);
const hayDoble=notas=>notas.some(n=>Math.abs(n.a)===2);
// quita los distractores con dobles alteraciones en el nivel básico
const sinDobles=(nv,lista)=>nv<=1?lista.filter(c=>!/♯♯|♭♭/.test(typeof c==='string'?c:c.t)):lista;
const Cap=s=>s[0].toUpperCase()+s.slice(1);
const pent=(ev,opt)=>pentagrama(ev,opt);
const par=(...xs)=>xs.map(x=>`<p>${x}</p>`).join('');
const lista=arr=>arr.length>1?arr.slice(0,-1).join(', ')+' y '+arr[arr.length-1]:arr.join('');
// hasta dar con un resultado válido (los generadores descartan combinaciones imposibles)
function intentar(f,max=400){ for(let i=0;i<max;i++){ const x=f(); if(x) return x; } throw new Error('generador sin salida'); }
// acorde para sonar con buena conducción de voces: bajo en la octava grave y voces cerradas cerca de las anteriores
function vozAcorde(ac,prev){
  const pcs=ac.notas.map(pcDe); let bajo=36+pcs[0]; if(bajo<40) bajo+=12; let mejor=null;
  for(let i=0;i<pcs.length;i++){ const v=[]; let m=55; while(m%12!==pcs[i]) m++; v.push(m);
    for(let k=1;k<pcs.length;k++){ let x=v[v.length-1]+1; while(x%12!==pcs[(i+k)%pcs.length]) x++; v.push(x); }
    const med=v.reduce((a,b)=>a+b,0)/v.length, pm=prev?prev.voces.reduce((a,b)=>a+b,0)/prev.voces.length:63, c=Math.abs(med-pm);
    if(!mejor||c<mejor.c) mejor={c,v}; }
  return {bajo,voces:mejor.v};
}
function vocesProgresion(acordes){ const out=[]; acordes.forEach((a,i)=>out.push(vozAcorde(a,out[i-1]))); return out; }
// cadencia que fija la tonalidad: I–IV–V–I (en menor, con la escala armónica)
function cadencia(tonica,modo){ const esc=modo==='m'?'menorArm':'mayor'; return [1,4,5,1].map(g=>acordeDeGrado(tonica,esc,g,false)); }
