// Dictado Armónico · Tema 4: notas con función melódica. Genera fragmentos melódicos cortos sobre uno o dos acordes
// con una figura (nota de paso, bordadura, suspensión…) y pide reconocerla, vista u oída.
// Script clásico: comparte el ámbito global con los demás de js/.
'use strict';

/* ---------- Material: tríadas de Do mayor (luego se transporta) ---------- */
const NFM_AC=[{cif:'C',l:[0,2,4],tipo:'M'},{cif:'Dm',l:[1,3,5],tipo:'m'},{cif:'Em',l:[2,4,6],tipo:'m'},{cif:'F',l:[3,5,0],tipo:'M'},{cif:'G',l:[4,6,1],tipo:'M'},{cif:'Am',l:[5,0,2],tipo:'m'}];
const NFM={
  paso:{nom:'Nota de paso',def:'Une dos notas del acorde por grado conjunto.'},
  pasoAc:{nom:'Nota de paso acentuada',def:'Es una nota de paso que cae en el momento fuerte: suena cuando se articula el acorde, y la nota del acorde llega después.'},
  pasoCrom:{nom:'Nota de paso cromática',def:'Une por semitonos dos notas acórdicas que están a un tono de distancia.'},
  grupo:{nom:'Grupo de notas de paso',def:'Dos notas de paso seguidas unen por grado conjunto dos notas del acorde que están a una cuarta.'},
  bord:{nom:'Bordadura',def:'Decora por grado conjunto una nota del acorde: sale de ella y vuelve a ella.'},
  bordCrom:{nom:'Bordadura cromática',def:'Es una bordadura a distancia de semitono cromático: la nota vecina lleva una alteración ajena a la escala.'},
  dbl:{nom:'Doble bordadura',def:'La nota del acorde se decora con sus dos vecinas, la superior y la inferior, antes de volver a ella.'},
  dblInc:{nom:'Doble bordadura incompleta',def:'Es una doble bordadura cuya primera nota (la nota del acorde de la que parte) está omitida.'},
  susp:{nom:'Suspensión',def:'Forma parte del acorde anterior y, cuando se articula el acorde nuevo, permanece en la misma voz aunque no le pertenece. Resuelve por grado conjunto descendente.'},
  apoy:{nom:'Apoyatura',def:'Se aborda por salto ascendente y resuelve descendiendo por grado conjunto a una nota del acorde.'},
  esc:{nom:'Escapada',def:'Se aborda por grado conjunto ascendente y resuelve por salto descendente en una nota del acorde.'},
  camb:{nom:'Cambiata',def:'Una nota no acórdica abordada por grado conjunto salta una tercera en la misma dirección hacia una nota del acorde, y luego la melodía vuelve en sentido contrario por grado conjunto.'},
  ant:{nom:'Anticipación',def:'Pertenece al acorde siguiente y se ataca antes de que ese acorde aparezca.'},
};
const NFM_NIVEL=[['paso','bord','susp','apoy','ant'],['paso','pasoAc','pasoCrom','bord','bordCrom','dbl','susp','apoy','esc','ant'],Object.keys(NFM)];
const NFM_TONOS=[[[1,'j',1]],[[1,'j',1],[4,'j',1],[4,'j',-1]],[[1,'j',1],[4,'j',1],[4,'j',-1],[2,'M',1],[2,'M',-1]]];
const enAc=(st,ac)=>NFM_AC[ac].l.includes(((st%7)+7)%7);
const tonoNat=(a,b)=>Math.abs((12*Math.floor(b/7)+PC[((b%7)+7)%7])-(12*Math.floor(a/7)+PC[((a%7)+7)%7]));

// Cada patrón devuelve eventos {st, a, fig, ac, m, liga, r} en Do mayor (st = posición en el pentagrama), o null si no cuadra.
const PATRONES={
  paso(R){ const ac=R.int(6), d=R.pick([1,-1]), a=29+R.int(9); if(!enAc(a,ac)||!enAc(a+2*d,ac)) return null;
    return [{st:a,fig:'q',ac},{st:a+d,fig:'q',m:1},{st:a+2*d,fig:'h'}]; },
  pasoAc(R){ const c1=R.int(6), c2=R.int(6), d=R.pick([1,-1]), a=29+R.int(9); if(c1===c2||!enAc(a,c1)||enAc(a+d,c2)||!enAc(a+2*d,c2)) return null;
    return [{st:a,fig:'h',ac:c1},{st:a+d,fig:'q',ac:c2,m:1},{st:a+2*d,fig:'q'}]; },
  pasoCrom(R){ const c1=R.int(6), c2=R.int(6), d=R.pick([1,-1]), a=29+R.int(9); if(c1===c2||!enAc(a,c1)||!enAc(a+d,c2)||enAc(a+d,c1)||tonoNat(a,a+d)!==2) return null;
    return [{st:a,fig:'q',ac:c1},{st:a,a:d,fig:'q',m:1},{st:a+d,fig:'h',ac:c2}]; },
  grupo(R){ const ac=R.int(6), d=R.pick([1,-1]), a=29+R.int(8); if(!enAc(a,ac)||!enAc(a+3*d,ac)||a+3*d<28||a+3*d>40) return null;
    return [{st:a,fig:'q',ac},{st:a+d,fig:'q',m:1},{st:a+2*d,fig:'q',m:1},{st:a+3*d,fig:'q'}]; },
  bord(R){ const ac=R.int(6), d=R.pick([1,-1]), a=29+R.int(9); if(!enAc(a,ac)) return null;
    return [{st:a,fig:'q',ac},{st:a+d,fig:'q',m:1},{st:a,fig:'h'}]; },
  bordCrom(R){ const ac=R.int(6), d=R.pick([1,-1]), a=29+R.int(9); if(!enAc(a,ac)||tonoNat(a,a+d)!==2) return null;
    return [{st:a,fig:'q',ac},{st:a+d,a:-d,fig:'q',m:1},{st:a,fig:'h'}]; },
  dbl(R){ const ac=R.int(6), d=R.pick([1,-1]), a=30+R.int(8); if(!enAc(a,ac)) return null;
    return [{st:a,fig:'q',ac},{st:a+d,fig:'q',m:1},{st:a-d,fig:'q',m:1},{st:a,fig:'q'}]; },
  dblInc(R){ const ac=R.int(6), d=R.pick([1,-1]), a=30+R.int(8); if(!enAc(a,ac)) return null;
    return [{r:1,ac},{st:a+d,fig:'q',m:1},{st:a-d,fig:'q',m:1},{st:a,fig:'q'}]; },
  susp(R){ const c1=R.int(6), c2=R.int(6), a=30+R.int(9); if(c1===c2||!enAc(a,c1)||enAc(a,c2)||!enAc(a-1,c2)) return null;
    return [{st:a,fig:'h',ac:c1},{st:a,fig:'q',ac:c2,m:1,liga:1},{st:a-1,fig:'q'}]; },
  apoy(R){ const ac=R.int(6), n=31+R.int(8), salto=2+R.int(3); if(enAc(n,ac)||!enAc(n-1,ac)||!enAc(n-salto,ac)) return null;
    return [{st:n-salto,fig:'h',ac},{st:n,fig:'q',m:1},{st:n-1,fig:'q'}]; },
  esc(R){ const c1=R.int(6), c2=R.int(6), a=30+R.int(9), salto=2+R.int(2); if(c1===c2||!enAc(a,c1)||enAc(a+1,c2)||!enAc(a+1-salto,c2)) return null;
    return [{st:a,fig:'q',ac:c1},{st:a+1,fig:'q',m:1},{st:a+1-salto,fig:'h',ac:c2}]; },
  camb(R){ const c1=R.int(6), c2=R.int(6), d=R.pick([1,-1]), a=31+R.int(7); if(c1===c2||!enAc(a,c1)||!enAc(a+3*d,c1)||!enAc(a+2*d,c2)) return null;
    return [{st:a,fig:'q',ac:c1},{st:a+d,fig:'q',m:1},{st:a+3*d,fig:'q'},{st:a+2*d,fig:'q',ac:c2}]; },
  ant(R){ const c1=R.int(6), c2=R.int(6), d=R.pick([1,-1]), a=29+R.int(10); if(c1===c2||!enAc(a,c1)||enAc(a+d,c1)||!enAc(a+d,c2)) return null;
    return [{st:a,fig:'h',ac:c1},{st:a+d,fig:'q',m:1},{st:a+d,fig:'h',ac:c2}]; },
};

function fragmento(R,nv){
  const tipo=R.pick(NFM_NIVEL[nv-1]), ev=intentar(()=>PATRONES[tipo](R)), [num,cal,dir]=R.pick(NFM_TONOS[nv-1]);
  const tr=n=>sumar(n,num,cal,dir), cruda=ev.map(e=>e.r?null:tr(N(((e.st%7)+7)%7,e.a||0,Math.floor(e.st/7))));
  // se mantiene en el pentagrama: si al transportar queda muy alto o muy bajo, se cambia de octava
  const ps=cruda.filter(Boolean).map(paso), sube=Math.min(...ps)<28?1:Math.max(...ps)>40?-1:0, notas=cruda.map(n=>n&&N(n.l,n.a,n.o+sube));
  const acordes=NFM_AC.map(c=>{ const f=tr(N(c.l[0],0,4)); return acorde(f,c.tipo); });
  const eventos=ev.map((e,i)=>({fig:e.r?'r':e.fig,notas:e.r?[]:[notas[i]],marca:e.m?true:undefined,liga:!!e.liga,arriba:e.ac!=null?cifrado(acordes[e.ac]):undefined}));
  // sonido: negra = 0,62 s; el acorde suena desde que aparece hasta el siguiente
  const B=0.62, sec=[]; let t=0; const ini=[]; ev.forEach((e,i)=>{ ini.push(t); t+=B*(e.fig==='h'?2:1); });
  ev.forEach((e,i)=>{ if(e.ac!=null){ let j=i+1; while(j<ev.length&&ev[j].ac==null) j++; const fin=j<ev.length?ini[j]:t, v=acordes[e.ac].notas.map(pcDe), bajo=36+v[0]+(36+v[0]<40?12:0);
      sec.push({t:ini[i],m:[bajo],d:fin-ini[i],r:'bass',v:0.7},{t:ini[i],m:v.map(p=>48+p),d:fin-ini[i],r:'chord',v:0.85}); } });
  ev.forEach((e,i)=>{ if(e.r||e.liga) return; const larga=ev[i+1]&&ev[i+1].liga?B:0; sec.push({t:ini[i],m:[midi(notas[i])],d:B*(e.fig==='h'?2:1)+larga-0.04,r:'mel'}); });
  return {tipo,ev,notas,acordes,eventos,sec};
}
// explicación: qué pasa nota por nota
function explicaNFM(f){
  const {tipo,ev,notas,acordes}=f, marc=ev.map((e,i)=>e.m?i:-1).filter(i=>i>=0), n=i=>nom(notas[i]); let acAct=null; const acDe=ev.map(e=>{ if(e.ac!=null) acAct=e.ac; return acAct; });
  const cifDe=i=>cifrado(acordes[acDe[i]]), notasAc=i=>lista(acordes[acDe[i]].notas.map(nom)), p=[];
  const acs=[...new Set(ev.filter(e=>e.ac!=null).map(e=>e.ac))];
  p.push(`${acs.length>1?'Los acordes son':'El acorde es'} ${lista(acs.map(a=>`<b>${cifrado(acordes[a])}</b> (${lista(acordes[a].notas.map(nom))})`))}.`);
  p.push(`${marc.length>1?'Las notas marcadas':'La nota marcada'}, <b>${lista(marc.map(n))}</b>, no pertenece${marc.length>1?'n':''} al acorde que suena en ese momento (${cifDe(marc[0])}: ${notasAc(marc[0])}).`);
  const i=marc[0], u=marc[marc.length-1], antes=ev[i-1]&&!ev[i-1].r?i-1:null, desp=u+1<ev.length?u+1:null;
  const mov=(a,b)=>{ const d=paso(notas[b])-paso(notas[a]); return d===0?'se repite':Math.abs(d)===1?`grado conjunto ${d>0?'ascendente':'descendente'}`:`salto ${d>0?'ascendente':'descendente'} de ${I_NOM[Math.abs(d)+1]}`; };
  if(tipo==='susp') p.push(`${Cap(n(i))} ya sonaba como nota de ${cifDe(i-1)} y se mantiene ligada cuando llega ${cifDe(i)}, donde es ajena. Después resuelve por ${mov(i,desp)} en ${n(desp)}, nota de ${cifDe(desp)}.`);
  else if(tipo==='ant') p.push(`${Cap(n(i))} llega por ${mov(antes,i)} mientras todavía suena ${cifDe(i)}; es nota del acorde siguiente, ${cifDe(desp)}, y ${mov(i,desp)} cuando ese acorde aparece.`);
  else if(tipo==='dblInc') p.push(`La melodía empieza directamente en ${n(i)}, pasa a ${n(u)} (las dos vecinas de ${n(desp)}) y llega a ${n(desp)}, nota de ${cifDe(desp)}. Falta la nota del acorde de la que partiría una doble bordadura completa.`);
  else p.push(`Se llega a ${n(i)} desde ${n(antes)} por ${mov(antes,i)}${marc.length>1?`, sigue ${n(u)}`:''} y se sale hacia ${n(desp)} por ${mov(u,desp)}${tipo==='pasoAc'?`. ${Cap(n(i))} suena justo cuando se articula ${cifDe(i)}`:''}.`);
  p.push(`<b>${NFM[tipo].nom}.</b> ${NFM[tipo].def}`);
  return p;
}
function ejercicioNFM(R,nv,oido){
  const f=fragmento(R,nv), tipos=NFM_NIVEL[nv-1], sinMarca=f.eventos.map(e=>({...e,marca:undefined}));
  return { enunciado:oido?'Escucha el fragmento: la melodía tiene una figura que no pertenece al acorde. ¿Qué tipo de nota con función melódica es?':`¿Qué tipo de nota con función melódica ${f.ev.filter(e=>e.m).length>1?'son las notas marcadas':'es la nota marcada'}?`,
    vista:oido?'':pent(f.eventos,{sp:15}), vistaSol:oido?pent(f.eventos,{sp:15}):'', sonar:f.sec,
    campos:[campo('tipo','Tipo',tipos.map(t=>op(t,NFM[t].nom)))], sol:{tipo:f.tipo}, resumen:`${NFM[f.tipo].nom}: ${NFM[f.tipo].def}`, _f:f, _sin:sinMarca,
    explicar:r=>listaPasos(explicaNFM(f))+(r.tipo&&r.tipo!==f.tipo?`<p class="tu">Respondiste «${NFM[r.tipo].nom.toLowerCase()}». ${NFM[r.tipo].def} Aquí no ocurre eso.</p>`:'') };
}
registrar({id:'t4-identificar',tema:4,modo:'teoria',titulo:'Reconocer la nota',gen:(R,nv)=>ejercicioNFM(R,nv,false)});
registrar({id:'t4-oido',tema:4,modo:'oido',titulo:'Reconocer la nota',gen:(R,nv)=>ejercicioNFM(R,nv,true)});
