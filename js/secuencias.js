// Dictado Armónico · Secuencias de sonido: listas [{t, m:[midi…], d, r, v}] que audio.js reproduce. No toca el DOM ni el audio
// (las pruebas las cargan en Node). Script clásico: comparte el ámbito global con los demás de js/.
'use strict';

/* ---------- Secuencias ---------- */
const desplazar=(sec,dt)=>sec.map(e=>({...e,t:e.t+dt}));
const durSec=sec=>sec.reduce((x,e)=>Math.max(x,e.t+e.d),0);
const unir=(...partes)=>{ let t=0, out=[]; for(const p of partes){ if(typeof p==='number'){ t+=p; continue; } out=out.concat(desplazar(p,t)); t+=durSec(p); } return out; };
// intervalo: modo 'asc', 'desc' (melódico) o 'arm' (armónico); «ambos» añade el armónico tras el melódico
function secIntervalo(a,b,modo,ambos){
  const lo=midi(a)<=midi(b)?a:b, hi=lo===a?b:a, x=midi(lo), y=midi(hi);
  if(modo==='arm') return [{t:0,m:[x,y],d:1.9,v:0.75}];
  const p=modo==='desc'?[y,x]:[x,y], s=[{t:0,m:[p[0]],d:0.85},{t:0.85,m:[p[1]],d:1.15}];
  return ambos?unir(s,0.25,[{t:0,m:[x,y],d:1.8,v:0.75}]):s;
}
// acorde: plaqué, arpegiado hacia arriba y plaqué otra vez
function secAcorde(notas,arp=true){
  const ms=notas.map(midi).sort((a,b)=>a-b), pl=[{t:0,m:ms,d:1.7,r:'mel',v:0.55}];
  if(!arp) return pl;
  return unir(pl,0.2,ms.map((m,i)=>({t:i*0.42,m:[m],d:0.5})),0.25,pl);
}
function secEscala(notas){ return notas.map((n,i)=>({t:i*0.4,m:[midi(n)],d:i===notas.length-1?1.1:0.44})); }
// progresión: cada acorde es {bajo: midi, voces: [midi…]}
function secProgresion(acordes,dur=1.35){ return acordes.flatMap((a,i)=>[{t:i*dur,m:[a.bajo],d:dur*0.96,r:'bass',v:0.8},{t:i*dur,m:a.voces,d:dur*0.96,r:'chord'}]); }
