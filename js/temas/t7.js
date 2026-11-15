// Dictado Armónico · Temas 7 y 8: acordes sobre los grados de la tonalidad mayor y de la menor. Una fábrica para los dos.
// Script clásico: comparte el ámbito global con los demás de js/.
'use strict';

/* ---------- Ayudas ---------- */
const escalasNivel=(modo,nv)=>modo==='M'?(nv<=1?['mayor']:['mayor','mayorArm']):(nv<=1?['menorArm']:nv===2?['menorArm','menorNat']:ESC_MODO.m);
const tonNivel=(R,nv,modo)=>{ const tope=nv<=1?1:ARM_MAX, arm=R.int(2*tope+1)-tope; return {tonica:tonicaDe(arm,modo),modo,arm}; };
const sufTxt=esc=>({mayor:'la escala mayor (sin indicación, es la de referencia)',mayorArm:'la escala mayor armónica (se indica con «Ma»)',menorArm:'la escala menor armónica (sin indicación, es la de referencia)',menorNat:'la escala menor natural (se indica con «nat»)',menorMel:'la escala menor melódica (se indica con «mel»)'}[esc]);
// cifra apilada junto al grado: V6/5 → V con 6 sobre 5
const gradoHTML=(etiq,fig)=>esc(etiq)+(fig?`<span class="bc in">${fig.split('/').map(x=>`<span>${esc(x)}</span>`).join('')}</span>`:'');
// acordes distintos disponibles para los ejercicios de oído, con su etiqueta de referencia
function gradosOido(tonica,modo,nv){
  const escs=nv>=3?ESC_MODO[modo]:[ESC_MODO[modo][0]], gs=nv<=1?[1,4,5,6]:[1,2,3,4,5,6,7], out=[];
  for(const e of escs) for(const g of gs){ const ac=acordeDeGrado(tonica,e,g,false); if(ac&&!out.some(x=>mismoAcorde(x.ac,ac))) out.push({ac,g,esc:e,etiq:etiqGrado(g,e)}); }
  return out;
}
const SEC_CAD=0.95;
const secCadencia=(tonica,modo)=>secProgresion(vocesProgresion(cadencia(tonica,modo)),SEC_CAD);
// referencias que el alumno puede oír aparte antes del ejercicio: el acorde de tónica solo y la cadencia
const secTonica=(tonica,modo)=>secProgresion([vozAcorde(cadencia(tonica,modo)[0])],2.2);
const refTonal=(tonica,modo)=>({tonica:secTonica(tonica,modo),cadencia:secCadencia(tonica,modo)});
const pentGrados=(lista_,arm)=>pent(lista_.map((x,i)=>({notas:disponer(x.ac,0),arriba:cifrado(x.ac),abajo:[x.etiq],barra:i>0})),{arm});

function registrarGrados(tema,modo){
  const pref='t'+tema, ref=ESC_MODO[modo][0];
  const elegir=(R,nv,cuatro)=>{ const pide=pideDoble(R,nv); return intentar(()=>{ const T=tonNivel(R,nv,modo), e=R.pick(escalasNivel(modo,nv)), g=1+R.int(7), ac=acordeDeGrado(T.tonica,e,g,cuatro); return ac&&maxAlt(ac.notas)<=topeAlt(nv)&&(!pide||hayDoble(ac.notas))?{...T,esc:e,g,ac,etiq:etiqGrado(g,e)}:null; }); };
  const pasosGrado=(x,cuatro)=>{ const sc=escala(x.tonica,x.esc);
    return [`${Cap(escNom(x.tonica,x.esc))}: ${sc.map((n,i)=>`${nom(n)}<sub>${ROM[i]}</sub>`).join(' ')}.`,
      `Sobre el ${ROM[x.g-1]} grado (${nom(sc[x.g-1])}) se apilan terceras con las notas de la escala: <b>${x.ac.notas.map(nom).join(' – ')}</b>.`,
      `Es una ${cuatro?TIPOS[x.ac.tipo].nom:'tríada '+TRI_NOM[x.ac.tipo]}: <b>${cifrado(x.ac)}</b> (tipo genérico ${TIPOS[x.ac.tipo].gen}).`]; };

  /* ----- Teoría ----- */
  registrar({id:pref+'-acorde',tema,modo:'teoria',titulo:'Del grado al acorde',gen(R,nv){
    const cuatro=nv>1&&R.chance(0.6), x=elegir(R,nv,cuatro), bien=cifrado(x.ac), cand=[];
    for(const t of (cuatro?TETRADAS:TRIADAS)){ const y=acorde(x.ac.fund,t); if(y) cand.push(cifrado(y)); }
    for(const e of ESC_MODO[modo]){ const y=acordeDeGrado(x.tonica,e,x.g,cuatro); if(y) cand.push(cifrado(y)); }
    for(const d of [1,-1,2]){ const y=acordeDeGrado(x.tonica,x.esc,((x.g-1+d+7)%7)+1,cuatro); if(y) cand.push(cifrado(y)); }
    return { enunciado:`En <b>${nomTonalidad(x.tonica,modo)}</b>, ¿qué ${cuatro?'tétrada':'tríada'} se forma sobre el <b>${x.etiq}</b>?`, vista:'', vistaSol:pentGrados([x],x.arm), sonar:secAcorde(disponer(x.ac,0)), sonarTras:true,
      campos:[campo('cif','Acorde',eleccion(R,op(bien),cand.map(c=>op(c))))], sol:{cif:bien}, resumen:`${x.etiq} de ${nomTonalidad(x.tonica,modo)}: ${bien}.`,
      explicar:()=>listaPasos([`«${x.etiq}» es el ${ORD_GRADO[x.g-1]} grado de ${sufTxt(x.esc)}.`].concat(pasosGrado(x,cuatro))) };
  }});

  registrar({id:pref+'-grado',tema,modo:'teoria',titulo:'Del acorde al grado',gen(R,nv){
    const cuatro=nv>1&&R.chance(0.6), x=elegir(R,nv,cuatro), validos=gradosDe(x.ac,x.tonica,modo), bien=validos[0].etiq, cand=[];
    for(const e of ESC_MODO[modo]) for(const d of [0,1,-1,2,-2]) cand.push(etiqGrado(((x.g-1+d+7)%7)+1,e));
    const otros=cand.filter(c=>!validos.some(v=>v.etiq===c)), cuadro=ESC_MODO[modo].map(e=>{ const y=acordeDeGrado(x.tonica,e,validos[0].g,cuatro); return `${ESCALAS[e].nom}: ${y?cifrado(y):'—'}`; }).join(' · ');
    return { enunciado:`En <b>${nomTonalidad(x.tonica,modo)}</b>, ¿qué grado es <b>${cifrado(x.ac)}</b>?`, vista:pent([{notas:disponer(x.ac,0),arriba:cifrado(x.ac)}],{arm:x.arm}), sonar:secAcorde(disponer(x.ac,0)),
      campos:[campo('grado','Grado',eleccion(R,op(bien),otros.map(c=>op(c))))], sol:{grado:bien}, resumen:`${cifrado(x.ac)} en ${nomTonalidad(x.tonica,modo)}: ${bien}.`,
      explicar:()=>listaPasos([`La fundamental, ${nom(x.ac.fund)}, es el ${ORD_GRADO[validos[0].g-1]} grado de ${nomTonalidad(x.tonica,modo)} → <b>${ROM[validos[0].g-1]}</b>.`,
        `El acorde de ese grado cambia según la escala — ${cuadro}.`,
        validos.length>1?`${cifrado(x.ac)} coincide en ${lista(validos.map(v=>'la '+ESCALAS[v.esc].nom))}: se indica con la escala de referencia → <b>${bien}</b>.`:`${cifrado(x.ac)} solo aparece en ${sufTxt(validos[0].esc)} → <b>${bien}</b>.`]) };
  }});

  registrar({id:pref+'-tensiones',tema,modo:'teoria',titulo:'Tensiones disponibles',gen(R,nv){
    const x=elegir(R,Math.max(nv,1),true), d=tensDisp(x.esc,x.g), sc=escala(x.tonica,x.esc), f=N(x.ac.fund.l,x.ac.fund.a,4);
    const filas=[[9,1],[11,3],[13,5]].map(([num,k])=>{ const n=sc[(x.g-1+k)%7], cal=CALS.find(c=>semisDe(num,c)%12===((pcDe(n)-pcDe(f)+12)%12)), key=Object.keys(TENS).find(t=>TENS[t][0]===num&&TENS[t][1]===cal);
      return `${nom(n)}: ${cal?iNom(num,cal):I_NOM[num]}${key?` (${tensTxt(key)})`:''} → ${key&&d.t.includes(key)?'<b>disponible</b>':'no disponible'}`; });
    const notas=notasEstructura({fund:x.ac.fund,base:{maj7:'maj7','7':'7',m7:'m7',mmaj7:'mmaj7',m7b5:'m7b5'}[x.ac.tipo]||'7',sus:0,tens:d.t}), conT=['maj7','7','m7','mmaj7','m7b5'].includes(x.ac.tipo)&&notas;
    return { enunciado:`En <b>${nomTonalidad(x.tonica,modo)}</b>, ¿qué tensiones están disponibles sobre el <b>${x.etiq}</b> (${cifrado(x.ac)})? Marca todas las que correspondan.`, vista:pent([{notas:disponer(x.ac,0),arriba:cifrado(x.ac)}],{arm:x.arm}),
      vistaSol:conT&&d.t.length?pent([{notas:conT,arriba:cifrado(x.ac)+' '+d.t.map(tensTxt).join(' ')}]):'', sonar:secAcorde(conT||disponer(x.ac,0)), sonarTras:true,
      campos:[campo('tens','Tensiones',TENS_ORD.map(t=>op(t,tensTxt(t),TENS_NOM[t])),true)], sol:{tens:d.t},
      resumen:`${x.etiq} (${cifrado(x.ac)}): ${d.t.length?d.t.map(tensTxt).join(', '):'ninguna tensión disponible'}${d.seis?'; admite la sexta en lugar de la séptima':''}.`,
      explicar:()=>listaPasos([`Las tensiones se toman de las notas de ${escNom(x.tonica,x.esc)} que no forman parte de la tétrada (${x.ac.notas.map(nom).join(', ')}).`,
        `Novena, oncena y trecena sobre ${nom(f)}: ${filas.join('; ')}.`,
        `Según el esquema del curso, sobre el ${x.etiq} están disponibles: <b>${d.t.length?d.t.map(tensTxt).join(', '):'ninguna'}</b>${d.seis?'. Además se puede sustituir la séptima por la sexta mayor (6)':''}.`,
        'Las notas no disponibles son las que desdibujan la identidad del acorde; la clasificación sistematiza la práctica, sobre todo la de influencia jazzística.']) };
  }});

  registrar({id:pref+'-nomenclatura',tema,modo:'teoria',titulo:'Nomenclatura de grados',gen(R,nv){
    const cuatro=nv>1&&R.chance(0.5), x=elegir(R,nv,cuatro), estado=R.int(cuatro?4:3), acad=R.chance(0.5), notas=disponer(x.ac,estado), validos=gradosDe(x.ac,x.tonica,modo);
    const etq=(g,e,est,c4)=>acad?gradoAcademico(g,e,est,c4):gradoPopular(g,e,est), html=(g,e,est,c4)=>acad?gradoHTML(etiqGrado(g,e),(c4?FIG_TETRADA:FIG_TRIADA)[est]):esc(gradoPopular(g,e,est));
    const o=(g,e,est,c4)=>op(etq(g,e,est,c4),html(g,e,est,c4)), bien=o(validos[0].g,validos[0].esc,estado,cuatro), prohibidas=new Set(validos.map(v=>etq(v.g,v.esc,estado,cuatro))), cand=[];
    for(let est=0;est<(cuatro?4:3);est++) if(est!==estado) cand.push(o(validos[0].g,validos[0].esc,est,cuatro));
    for(const d of [1,-1,3]) cand.push(o(((x.g-1+d+7)%7)+1,validos[0].esc,estado,cuatro));
    if(acad) for(let est=0;est<3;est++) cand.push(o(validos[0].g,validos[0].esc,est,!cuatro)); else cand.push(op(etiqGrado(validos[0].g,validos[0].esc)+'/'+cif(notas[0])));
    const fig=(cuatro?FIG_TETRADA:FIG_TRIADA)[estado];
    return { enunciado:`En <b>${nomTonalidad(x.tonica,modo)}</b>, ¿cómo se indica este acorde (${cifrado(x.ac,estado)}) en la nomenclatura ${acad?'<b>académica</b>':'de <b>músicas populares</b>'}?`, vista:pent([{notas,arriba:cifrado(x.ac,estado)}],{arm:x.arm}), sonar:secAcorde(notas),
      campos:[campo('nom','Indicación',eleccion(R,bien,cand.filter(c=>!prohibidas.has(c.v))))], sol:{nom:bien.v}, resumen:`${cifrado(x.ac,estado)} en ${nomTonalidad(x.tonica,modo)}: ${bien.v}.`,
      explicar:()=>listaPasos([`${cifrado(x.ac)} (${x.ac.notas.map(nom).join(', ')}) es el ${ORD_GRADO[validos[0].g-1]} grado de ${sufTxt(validos[0].esc)} → <b>${validos[0].etiq}</b>.`,
        pasoEstado(x.ac,notas,estado),
        acad?`En la nomenclatura académica el grado se combina con el bajo cifrado abreviado del estado: ${cuatro?'7 · 6/5 · 4/3 · 2 para las tétradas':'(nada) · 6 · 6/4 para las tríadas'} → <b>${bien.t}</b>.`
            :`En músicas populares el grado se escribe con números romanos y, si el acorde está invertido, una barra y el componente del acorde que está en el bajo${estado?` (la ${COMPONENTE[estado]})`:' (aquí no hay inversión)'} → <b>${bien.t}</b>.`]) };
  }});

  /* ----- Oído ----- */
  registrar({id:pref+'-oido-grado',tema,modo:'oido',titulo:'Reconocer el grado',gen(R,nv){
    const T=tonNivel(R,Math.min(nv,2),modo), set=gradosOido(T.tonica,modo,nv), x=R.pick(set), cad=secCadencia(T.tonica,modo), sec=a=>unir(cad,0.55,[{t:0,m:[vozAcorde(a).bajo],d:2.3,r:'bass',v:0.8},{t:0,m:vozAcorde(a).voces,d:2.3,r:'chord'}]);
    return { enunciado:`Primero suena la cadencia I–IV–V–I de <b>${nomTonalidad(T.tonica,modo)}</b> y, tras una pausa, un acorde. ¿Qué grado es?`, vista:'', vistaSol:pentGrados([x],T.arm), sonar:sec(x.ac), ref:refTonal(T.tonica,modo),
      sonarResp:r=>{ const y=set.find(s=>s.etiq===r.grado); return y?sec(y.ac):null; },
      campos:[campo('grado','Grado',set.map(s=>op(s.etiq,`${esc(s.etiq)} · ${esc(TIPOS[s.ac.tipo].gen)}`)))], sol:{grado:x.etiq}, resumen:`Sonó ${cifrado(x.ac)}: el ${x.etiq} de ${nomTonalidad(T.tonica,modo)}.`,
      explicar:r=>{ const y=set.find(s=>s.etiq===r.grado);
        return par(`Sonó <b>${cifrado(x.ac)}</b> (${lista(x.ac.notas.map(nom))}), el <b>${x.etiq}</b> de ${nomTonalidad(T.tonica,modo)}: una tríada ${TRI_NOM[x.ac.tipo]} sobre el ${ORD_GRADO[x.g-1]} grado.`,
          'Para reconocerlo: canta el bajo del acorde y ubícalo en la escala contando desde la tónica; después fíjate en el tipo de tríada.')+
          (y&&y.etiq!==x.etiq?`<p class="tu">Respondiste ${y.etiq} (${cifrado(y.ac)}: ${lista(y.ac.notas.map(nom))}). Compara los dos con los botones de abajo.</p>`:''); } };
  }});

  registrar({id:pref+'-oido-progresion',tema,modo:'oido',titulo:'Dictado de progresión',gen(R,nv){
    const T=tonNivel(R,Math.min(nv,2),modo), set=gradosOido(T.tonica,modo,nv), prog=[set[0]];
    while(prog.length<4){ const c=R.pick(set); if(c!==prog[prog.length-1]) prog.push(c); }
    const sec=p=>unir(secCadencia(T.tonica,modo),0.7,secProgresion(vocesProgresion(p.map(c=>c.ac)),1.5));
    const campos=[1,2,3].map(i=>campo('g'+i,`Acorde ${i+1}`,set.map(s=>op(s.etiq)))), sol={}; [1,2,3].forEach(i=>{ sol['g'+i]=prog[i].etiq; });
    return { enunciado:`Suena la cadencia de <b>${nomTonalidad(T.tonica,modo)}</b> y, tras una pausa, una progresión de cuatro acordes que empieza en el <b>I</b>. ¿Qué grados son los otros tres?`, vista:'', vistaSol:pentGrados(prog,T.arm), sonar:sec(prog), ref:refTonal(T.tonica,modo),
      sonarResp:r=>{ const p=[prog[0]].concat([1,2,3].map(i=>set.find(s=>s.etiq===r['g'+i]))); return p.every(Boolean)?sec(p):null; },
      campos, sol, resumen:`La progresión era ${prog.map(c=>c.etiq).join(' – ')} (${prog.map(c=>cifrado(c.ac)).join(' – ')}).`,
      explicar:r=>par(`La progresión era <b>${prog.map(c=>c.etiq).join(' – ')}</b>: ${prog.map(c=>cifrado(c.ac)).join(' – ')}.`,
        `El bajo hizo ${prog.map(c=>nom(c.ac.fund)).join(' – ')}: seguir el bajo y ubicar cada nota en la escala es el camino más seguro; el tipo de tríada (${prog.map(c=>TRI_NOM[c.ac.tipo]).join(', ')}) lo confirma.`)+
        [1,2,3].filter(i=>r['g'+i]&&r['g'+i]!==prog[i].etiq).map(i=>{ const y=set.find(s=>s.etiq===r['g'+i]); return `<p class="tu">Acorde ${i+1}: respondiste ${y.etiq} (${cifrado(y.ac)}) y era ${prog[i].etiq} (${cifrado(prog[i].ac)}).</p>`; }).join('') };
  }});
}
registrarGrados(7,'M');
