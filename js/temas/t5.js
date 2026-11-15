// Dictado Armónico · Tema 5: tensiones, sexta en lugar de séptima, add y sus.
// Script clásico: comparte el ámbito global con los demás de js/.
'use strict';

/* ---------- Ayudas ---------- */
// tensiones que se combinan con cada estructura en los ejercicios (las habituales)
const TENS_DE={maj7:['9','#11','13'],'7':['9','b9','#9','#11','13','b13'],m7:['9','11'],mmaj7:['9','11'],m7b5:['9','11','b13'],'6':['9','#11'],m6:['9','11'],M:['9'],m:['9']};
function estructura(R,nv){ return intentar(()=>{
  const fund=R.pick(fundamentales(nv)), clase=R.pick(nv<=1?['tens']:nv===2?['tens','tens','seis','add','sus']:['tens','varias','varias','seis','add','sus','sus7']); let e;
  if(clase==='tens'||clase==='varias'){ const base=R.pick(nv<=1?['maj7','7','m7']:['maj7','7','m7','mmaj7','m7b5']), k=clase==='tens'?1:2+R.int(2); e={fund,base,sus:0,tens:R.shuffle(TENS_DE[base]).slice(0,k)}; }
  else if(clase==='seis'){ const base=R.pick(['6','m6']); e={fund,base,sus:0,tens:nv>=3&&R.chance(0.5)?[R.pick(TENS_DE[base])]:[]}; }
  else if(clase==='add') e={fund,base:R.pick(['M','m']),sus:0,tens:['9']};
  else if(clase==='sus') e={fund,base:'M',sus:R.pick([2,4]),tens:[]};
  else e={fund,base:R.pick(['7','maj7','6']),sus:R.pick([2,4]),tens:R.chance(0.5)?['9']:[]};
  if(e.sus===2&&e.tens.includes('9')) return null; // la novena sería la misma nota que la segunda
  if(e.tens.includes('9')&&(e.tens.includes('b9')||e.tens.includes('#9'))) return null;
  if(e.tens.includes('13')&&e.tens.includes('b13')) return null;
  if(e.tens.includes('#9')&&BASES[e.base].iv[0][1]==='m') return null;
  const notas=notasEstructura(e); return notas&&maxAlt(notas)<=topeAlt(nv)?e:null; }); }
// variantes verosímiles pero distintas (otra alteración de una tensión, otra séptima, otra tercera, 6 por 7…)
function variantes(e){
  const out=[], con=(cambio)=>{ const x={...e,tens:e.tens.slice(),...cambio}; if(notasEstructura(x)) out.push(x); };
  const par={'9':['b9','#9'],'b9':['9','#9'],'#9':['9','b9'],'11':['#11'],'#11':['11'],'13':['b13'],'b13':['13']};
  e.tens.forEach((t,i)=>par[t].forEach(o=>{ const ts=e.tens.slice(); ts[i]=o; if(!ts.includes('9')||(!ts.includes('b9')&&!ts.includes('#9'))) con({tens:ts}); }));
  const otra={maj7:['7','6'],'7':['maj7','6'],m7:['mmaj7','m6','7'],mmaj7:['m7','maj7'],m7b5:['m7'],'6':['maj7','m6','7'],m6:['m7','6'],M:['m','7','6','maj7'],m:['M','m7','m6']};
  if(!e.sus) otra[e.base].forEach(b=>con({base:b})); else { con({sus:e.sus===2?4:2}); con({sus:0}); ['7','maj7','6','M'].filter(b=>b!==e.base).forEach(b=>con({base:b})); }
  if(!e.tens.length){ con({tens:['9']}); if(!e.sus) con({sus:4}); } else if(e.tens.length>1) con({tens:e.tens.slice(0,-1)});
  if(e.base==='M'||e.base==='m') con({base:e.base==='M'?'7':'m7'});
  return out;
}
const opEst=e=>{ const c=cifradoEstructura(e); return op(c.txt,c.html,c.txt); };
// de dónde sale cada parte del cifrado
function pasosEstructura(e,notas){
  const iv=ivEstructura(e), f=notas[0], p=[], sin5=sinQuinta(e), desc=iv.map((x,i)=>sin5&&x[0]===5?`<s>${nom(notas[i+1])}</s> (${iNom(5,'j')}, se omite)`:`${nom(notas[i+1])} (${iNom(x[0],x[1])})`);
  p.push(`Desde la fundamental <b>${nom(f)}</b>: ${desc.join(', ')}.`);
  const triada=e.base==='M'||e.base==='m', b=BASES[e.base];
  if(e.sus) p.push(`No hay tercera: la sustituye una ${e.sus===2?'segunda mayor':'cuarta justa'} → <b>sus${e.sus}</b>, que se escribe después de la estructura (${cif(e.fund)}${b.cif}sus${e.sus}).`);
  else p.push(`Tercera ${b.iv[0][1]==='M'?'mayor':'menor'} y quinta ${CAL_NOM[b.iv[1][1]][1]}: tríada ${b.iv[0][1]==='M'?'mayor':(b.iv[1][1]==='-'?'disminuida':'menor')}.`);
  if(e.base==='6'||e.base==='m6') p.push('En lugar de la séptima hay una <b>sexta mayor</b>: se cifra con un <b>6</b>.');
  else if(!triada) p.push(`La séptima es ${CAL_NOM[b.iv[2][1]][1]} → <b>${b.cif}</b>.`);
  if(e.tens.length){ const t=ordenTens(e.tens);
    p.push(`Por encima de la octava: ${lista(t.map(x=>`${TENS_NOM[x]} = <b>${tensTxt(x)}</b>`))}. El número solo indica intervalo mayor o justo; ♯ y ♭ indican un semitono más o menos.`);
    if(sin5){ const t13=t.find(x=>TENS[x][0]===13); p.push(`La <b>${tensTxt(t13)}</b> ocupa el lugar de la quinta justa (${nom(sumar(f,5,'j'))}): suena una u otra, no las dos. Por eso en el acorde no está la quinta.`); }
    if(triada) p.push('No hay séptima ni sexta: la tensión se cifra con <b>add</b>.');
    else p.push(t.some(x=>/[b#]/.test(x))?'Como al menos una tensión no es mayor ni justa, las tensiones van <b>entre paréntesis</b>.':'Todas las tensiones son mayores o justas: van en superíndice, sin paréntesis.'); }
  p.push(`Cifrado: <b>${cifradoEstructura(e).html}</b>.`);
  return p;
}

/* ---------- Teoría ---------- */
registrar({id:'t5-cifrar',tema:5,modo:'teoria',titulo:'Cifrar el acorde',gen(R,nv){
  const e=estructura(R,nv), notas=notasEstructura(e), v=vozEstructura(e), bien=opEst(e);
  return { enunciado:'¿Cuál es el cifrado de este acorde?', vista:pent([{notas:v.notas}],{gran:true}), sonar:secAcorde(v.notas), campos:[campo('cif','Cifrado',eleccion(R,bien,variantes(e).map(opEst)))], sol:{cif:bien.v},
    resumen:`${lista(v.notas.map(nom))}: ${bien.t}.`, explicar:()=>listaPasos(pasosEstructura(e,notas)) };
}});

registrar({id:'t5-nota',tema:5,modo:'teoria',titulo:'Nota de la tensión',gen(R,nv){
  const pide=pideDoble(R,nv);
  return intentar(()=>{ const fund=R.pick(fundamentales(nv)), base=R.pick(nv<=1?['maj7','7','m7']:['maj7','7','m7','mmaj7','m7b5']), t=R.pick(nv<=1?TENS_DE[base].filter(x=>!/[b#]/.test(x)||base==='7'):TENS_DE[base]);
    const e={fund,base,sus:0,tens:[t]}, v=vozEstructura(e); if(!v||maxAlt(v.notas)>topeAlt(nv)) return null;
    const it=v.rol.indexOf('t'), x=v.notas[it]; if(pide&&!hayDoble([x])) return null;
    const [num,cal]=TENS[t], c=cifradoEstructura(e), simple=num-7, ref=sumar(N(fund.l,fund.a,4),num,num===11?'j':'M');
    return { enunciado:`En <b>${c.html}</b>, ¿qué nota es la ${tensTxt(t)}?`, vista:'', vistaSol:pent([{notas:v.notas,marca:[it],arriba:c.arr}],{gran:true}), sonar:secAcorde(v.notas), sonarTras:true,
      campos:[campoLetra(),campoAlt(topeAlt(nv))], sol:{letra:x.l,alt:x.a}, resumen:`La ${tensTxt(t)} de ${cif(fund)} es ${nom(x)}.`,
      explicar:()=>listaPasos([`Todo número mayor que la octava es una tensión: la ${I_NOM[num]} es una ${I_NOM[simple]} más una octava.`,
        `El número solo indica intervalo ${num===11?'justo':'mayor'}: la ${I_NOM[simple]} ${num===11?'justa':'mayor'} de ${nom(fund)} es <b>${nom(ref)}</b> (${semTxt(semisDe(simple,num===11?'j':'M'))}).`,
        /[b#]/.test(t)?`El ${t.includes('b')?'bemol baja':'sostenido sube'} un semitono ese intervalo: ${TENS_NOM[t]} → <b>${nom(x)}</b>.`:`No lleva alteración: la ${tensTxt(t)} es <b>${nom(x)}</b>.`]) }; });
}});

/* ---------- Oído ---------- */
// primero la cáscara (fundamental, tercera y séptima) y después la misma cáscara con la tensión encima
registrar({id:'t5-oido-tension',tema:5,modo:'oido',titulo:'Qué tensión suena',gen(R,nv){
  return intentar(()=>{ const fund=R.pick(fundamentales(2)), base=nv<=1?'7':R.pick(nv===2?['7','maj7']:['7','maj7','m7']), pool=nv<=1?['9','b9','13']:TENS_DE[base], t=R.pick(pool);
    const e={fund,base,sus:0,tens:[t]}, cas=vozEstructura({...e,tens:[]},{cascara:true}).notas, top=Math.max(...cas.map(midi));
    const conT=x=>{ const n=sumar(N(fund.l,fund.a,4),...TENS[x]); let m=midi(n); while(m<=top) m+=12; while(m-12>top) m-=12; return cas.concat([enOctava(n,m)]); };
    const notas=conT(t), x=notas[notas.length-1]; if(maxAlt(notas)>1||pool.length<2) return null;
    const c=cifradoEstructura(e), c0=cif(fund)+BASES[base].cif, sec=n=>unir([{t:0,m:cas.map(midi),d:1.6,v:0.55}],0.25,[{t:0,m:n.map(midi),d:2.2,v:0.5}],0.2,[{t:0,m:[midi(n[n.length-1])],d:1.1}]);
    return { enunciado:`Escucha: primero suena <b>${esc(c0)}</b> solo con fundamental, tercera y séptima; luego el mismo acorde con una tensión, que al final suena sola. ¿Qué tensión es?`, vista:'',
      vistaSol:pent([{notas:cas,arriba:c0},{notas,marca:[notas.length-1],arriba:c.arr,barra:true}],{gran:true}), sonar:sec(notas),
      sonarResp:r=>r.tens?sec(conT(r.tens)):null,
      campos:[campo('tens','Tensión',pool.map(x=>op(x,`${tensTxt(x)} · ${TENS_NOM[x]}`)))], sol:{tens:t}, resumen:`Sonó ${c.txt}: la tensión es ${nom(x)}, ${TENS_NOM[t]}.`,
      explicar:r=>par(`Sonó <b>${c.html}</b>: ${lista(cas.map(nom))} y, encima, <b>${nom(x)}</b>, a una ${TENS_NOM[t]} de la fundamental ${nom(fund)}: la tensión <b>${tensTxt(t)}</b>.`)+
        (r.tens&&r.tens!==t?`<p class="tu">Respondiste ${tensTxt(r.tens)} (${TENS_NOM[r.tens]}), que sería ${nom(sumar(N(fund.l,fund.a,4),...TENS[r.tens]))}. Compara las dos con los botones de abajo.</p>`:'') }; });
}});

// estructuras para reconocer de oído: [clave, botón, estructura, por qué]
const EST_OIDO=[
  ['M','Tríada mayor',{base:'M',sus:0,tens:[]},'fundamental, tercera mayor y quinta justa'],
  ['m','Tríada menor',{base:'m',sus:0,tens:[]},'fundamental, tercera menor y quinta justa'],
  ['sus4','sus4',{base:'M',sus:4,tens:[]},'la tercera se sustituye por la cuarta justa'],
  ['sus2','sus2',{base:'M',sus:2,tens:[]},'la tercera se sustituye por la segunda mayor'],
  ['6','6',{base:'6',sus:0,tens:[]},'tríada mayor con sexta mayor en lugar de séptima'],
  ['m6','m6',{base:'m6',sus:0,tens:[]},'tríada menor con sexta mayor en lugar de séptima'],
  ['maj7','maj7',{base:'maj7',sus:0,tens:[]},'tríada mayor con séptima mayor'],
  ['7','7',{base:'7',sus:0,tens:[]},'tríada mayor con séptima menor'],
  ['m7','m7',{base:'m7',sus:0,tens:[]},'tríada menor con séptima menor'],
  ['add9','add9',{base:'M',sus:0,tens:['9']},'tríada mayor con la novena agregada, sin séptima ni sexta'],
  ['7sus4','7sus4',{base:'7',sus:4,tens:[]},'cuarta justa en lugar de la tercera, con séptima menor'],
  ['6sus4','6sus4',{base:'6',sus:4,tens:[]},'cuarta justa en lugar de la tercera, con sexta mayor'],
  ['6sus2','6sus2',{base:'6',sus:2,tens:[]},'segunda mayor en lugar de la tercera, con sexta mayor'],
];
const EST_NIVEL={1:['M','m','sus4','sus2'],2:['M','m','sus4','sus2','6','maj7','7','m7'],3:EST_OIDO.map(q=>q[0])};
registrar({id:'t5-oido-estructura',tema:5,modo:'oido',titulo:'Sus, add, sexta o séptima',gen(R,nv){
  const fund=R.pick(fundamentales(nv<=1?1:2)), pool=EST_OIDO.filter(q=>EST_NIVEL[Math.min(nv,3)].includes(q[0])), k=R.pick(pool), de=q=>EST_OIDO.find(x=>x[0]===q);
  const e={fund,...k[2]}, notas=notasEstructura(e), v=vozEstructura(e), c=cifradoEstructura(e);
  return { enunciado:'Escucha el acorde. ¿Qué estructura tiene?', vista:'', vistaSol:pent([{notas:v.notas,arriba:c.arr}],{gran:true}), sonar:secAcorde(v.notas),
    sonarResp:r=>{ const x=de(r.est); return x?secAcorde(vozEstructura({fund,...x[2]}).notas):null; },
    campos:[campo('est','Estructura',pool.map(q=>op(q[0],q[1])))], sol:{est:k[0]}, resumen:`Sonó ${c.txt} (${lista(notas.map(nom))}): ${k[3]}.`,
    explicar:r=>par(`Sonó <b>${c.html}</b>: ${lista(notas.map(nom))}. Es decir, ${k[3]}.`)+listaPasos(pasosEstructura(e,notas))+
      (r.est&&r.est!==k[0]?`<p class="tu">Respondiste «${esc(de(r.est)[1])}»: ${de(r.est)[3]}. Compara los dos con los botones de abajo.</p>`:'') };
}});
