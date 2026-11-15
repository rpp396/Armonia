// Dictado Armónico · Temas 2 y 3: tríadas y tétradas. Una misma fábrica registra los ejercicios de los dos temas.
// Script clásico: comparte el ámbito global con los demás de js/.
'use strict';

/* ---------- Ayudas ---------- */
const TRI_NOM={M:'mayor',m:'menor',aug:'aumentada',dim:'disminuida'};
function elegirAcorde(R,nv,tipos){ return intentar(()=>{ const tipo=R.pick(tipos), ac=acorde(R.pick(fundamentales(nv)),tipo); if(!ac) return null;
  return maxAlt(ac.notas)<=topeAlt(nv)?ac:null; }); }
const notasTxt=notas=>lista(notas.map(nom));
// pasos comunes: ordenar por terceras y medir cada tercera (y la séptima)
function pasosTipo(ac,notas){
  const k=ac.notas, p=[], desordenado=notas.map(n=>n.l).join()!==k.map(n=>n.l).join();
  p.push(`${desordenado?`Las notas, de grave a aguda, son ${notasTxt(notas)}. `:''}Ordenadas por terceras: <b>${k.map(nom).join(' – ')}</b>. La fundamental es <b>${nom(k[0])}</b>.`);
  const t1=intervalo(k[0],encima(k[1],k[0])), t2=intervalo(k[1],encima(k[2],k[1])), q=TIPOS[ac.tipo].iv[1];
  p.push(`${nom(k[0])}–${nom(k[1])}: ${semTxt(t1.semis)} → ${iNom(3,t1.cal)}. ${nom(k[1])}–${nom(k[2])}: ${semTxt(t2.semis)} → ${iNom(3,t2.cal)}.`);
  const tri=TIPOS[ac.tipo].tri||ac.tipo;
  p.push(`${Cap(iNom(3,t1.cal))} + ${iNom(3,t2.cal)} = <b>tríada ${TRI_NOM[tri]}</b> (entre ${nom(k[0])} y ${nom(k[2])} hay una ${iNom(q[0],q[1])}).`);
  if(k.length===4){ const s=TIPOS[ac.tipo].iv[2]; p.push(`${nom(k[0])}–${nom(k[3])}: ${semTxt(semisDe(s[0],s[1]))} → <b>${iNom(s[0],s[1])}</b>. Es una ${TIPOS[ac.tipo].nom}.`); }
  return p;
}
const pasoEstado=(ac,notas,estado)=>`La nota más grave es <b>${nom(notas[0])}</b>, la ${COMPONENTE[estado]} del acorde → <b>${ESTADOS[estado]}</b>.`;
const bcHTML=c=>c.length?`<span class="bc">${c.map(x=>`<span>${esc(x)}</span>`).join('')}</span>`:'(sin cifra)';
const opBC=c=>op(bcTxt(c),bcHTML(c),c.length?c.join(' sobre '):'sin cifra');
const BC_FIJOS=[[],['6'],['6','4'],['7'],['6','5'],['4','3'],['2'],['♯'],['♭6'],['♯6','4'],['♯6'],['♭']];
// acorde y armadura para el bajo cifrado: diatónico, de la relativa menor armónica o libre, según el nivel
function acordeConArmadura(R,nv,cuatro){ return intentar(()=>{
  const arm=R.int(nv<=1?5:nv===2?9:13)-(nv<=1?2:nv===2?4:6), libre=nv>=3&&R.chance(0.5), menor=!libre&&nv>=2&&R.chance(0.5); let ac;
  if(libre) ac=elegirAcorde(R,nv,cuatro?TETRADAS:TRIADAS);
  else ac=acordeDeGrado(tonicaDe(arm,menor?'m':'M'),menor?'menorArm':'mayor',1+R.int(7),cuatro);
  return ac&&maxAlt(ac.notas)<=topeAlt(nv)?{ac,arm}:null; }); }

function registrarAcordes(tema){
  const cuatro=tema===3, K=cuatro?TETRADAS:TRIADAS, nEst=cuatro?4:3, pref='t'+tema, acNom=cuatro?'tétrada':'tríada';
  const tiposNivel=nv=>cuatro?(nv<=1?['maj7','7','m7','m7b5']:nv===2?['maj7','7','m7','m7b5','mmaj7','dim7']:TETRADAS):(nv<=1?['M','m']:TRIADAS);
  const camposTipo=()=>cuatro?[campo('tri','Tríada',TRIADAS.map(t=>op(t,Cap(TRI_NOM[t])))),campo('sep','Séptima',[op('M','Mayor'),op('m','Menor'),op('-','Disminuida')])]:[campoTipoTriada()];
  const solTipo=ac=>cuatro?{tri:TIPOS[ac.tipo].tri,sep:TIPOS[ac.tipo].iv[2][1]}:{tipo:ac.tipo};
  const tipoResp=(ac,r)=>cuatro?K.find(t=>TIPOS[t].tri===r.tri&&TIPOS[t].iv[2][1]===r.sep):r.tipo;

  /* ----- Teoría ----- */
  registrar({id:pref+'-tipo',tema,modo:'teoria',titulo:`Tipo de ${acNom}`,gen(R,nv){
    const ac=elegirAcorde(R,nv,tiposNivel(Math.max(nv,2))), estado=nv<=1?0:R.int(nEst), notas=disponer(ac,estado);
    return { enunciado:`¿Qué tipo de ${acNom} forman <b>${notasTxt(notas)}</b>?`, vista:pent([{notas}]), sonar:secAcorde(notas), campos:camposTipo(), sol:solTipo(ac),
      resumen:`${notasTxt(ac.notas)}: ${cuatro?TIPOS[ac.tipo].nom:'tríada '+TRI_NOM[ac.tipo]} (${cifrado(ac)}).`,
      explicar:r=>{ const t=tipoResp(ac,r), otro=t&&t!==ac.tipo?acorde(ac.fund,t):null;
        return listaPasos(pasosTipo(ac,notas))+(otro?`<p class="tu">Respondiste ${cuatro?TIPOS[t].nom:'tríada '+TRI_NOM[t]}: sobre ${nom(ac.fund)} sería ${otro.notas.map(nom).join(' – ')}.</p>`:(cuatro&&r.tri&&r.sep&&!t?`<p class="tu">La combinación que respondiste (tríada ${TRI_NOM[r.tri]} con séptima ${CAL_NOM[r.sep][1]}) no es de las habituales del curso.</p>`:'')); } };
  }});

  registrar({id:pref+'-estado',tema,modo:'teoria',titulo:cuatro?'Estado':'Estado y posición',gen(R,nv){
    const ac=elegirAcorde(R,nv,tiposNivel(nv)), estado=R.int(nEst), pos=cuatro?null:R.int(3), notas=disponer(ac,estado,pos);
    const campos=[campo('estado','Estado',ESTADOS.slice(0,nEst).map((e,i)=>op(i,Cap(e))))], sol={estado};
    if(!cuatro){ campos.push(campo('pos','Posición',[op(0,'De octava'),op(1,'De tercera'),op(2,'De quinta')])); sol.pos=pos; }
    const top=notas[notas.length-1];
    return { enunciado:`${cuatro?'¿En qué estado está':'¿En qué estado y en qué posición está'} este acorde de <b>${cifrado(ac)}</b>?`, vista:pent([{notas}]), sonar:secAcorde(notas), campos, sol,
      resumen:`${cifrado(ac,estado)}: ${ESTADOS[estado]}${cuatro?'':`, posición de ${['octava','tercera','quinta'][pos]}`}.`,
      explicar:()=>listaPasos([`El acorde ${cifrado(ac)} tiene las notas ${ac.notas.map((n,i)=>`${nom(n)} (${COMPONENTE[i]})`).join(', ')}.`,
        `<b>Estado:</b> lo decide la nota del bajo. `+pasoEstado(ac,notas,estado)].concat(cuatro?[]:[`<b>Posición:</b> la decide la voz superior. La nota más aguda es <b>${nom(top)}</b>, la ${COMPONENTE[pos]} → <b>posición de ${['octava','tercera','quinta'][pos]}</b>${pos===0?' (la fundamental arriba)':''}.`])) };
  }});

  registrar({id:pref+'-cifrado',tema,modo:'teoria',titulo:'Cifrado popular',gen(R,nv){
    const ac=elegirAcorde(R,nv,tiposNivel(nv===1?2:nv)), estado=nv<=1&&R.chance(0.5)?0:R.int(nEst), notas=disponer(ac,estado), bien=cifrado(ac,estado), cand=[];
    for(const t of K) if(t!==ac.tipo){ const x=acorde(ac.fund,t); if(x) cand.push(cifrado(x,estado)); }
    for(let e=0;e<nEst;e++) if(e!==estado) cand.push(cifrado(ac,e));
    if(estado){ const x=acorde(ac.notas[estado],ac.tipo); if(x) cand.push(cifrado(x)); for(const t of K){ const y=acorde(ac.notas[estado],t); if(y) cand.push(cifrado(y)); } }
    const t=TIPOS[ac.tipo];
    return { enunciado:`¿Cuál es el cifrado popular de este acorde?`, vista:pent([{notas}]), sonar:secAcorde(notas),
      campos:[campo('cif','Cifrado',eleccion(R,op(bien),sinDobles(nv,cand).map(c=>op(c))))], sol:{cif:bien}, resumen:`${notasTxt(notas)}: ${bien}.`,
      explicar:()=>listaPasos(pasosTipo(ac,notas).concat([
        `Fundamental ${nom(ac.fund)} → <b>${cif(ac.fund)}</b>. ${Cap(cuatro?t.nom:'tríada '+TRI_NOM[ac.tipo])} → ${t.cif?`se añade «<b>${t.cif}</b>»`:'no se añade nada (la letra sola indica tríada mayor)'}.`,
        estado?pasoEstado(ac,notas,estado)+` Se añade una barra y la nota del bajo: <b>/${cif(notas[0])}</b>.`:pasoEstado(ac,notas,estado)+' No lleva barra.',
        `Cifrado: <b>${bien}</b>.`])) };
  }});

  registrar({id:pref+'-bajocifrado',tema,modo:'teoria',titulo:'Bajo cifrado',gen(R,nv){
    const {ac,arm}=acordeConArmadura(R,nv,cuatro), estado=R.int(nEst), notas=disponer(ac,estado), bc=bajoCifrado(notas,arm), bajo=notas[0], leer=R.chance(0.4);
    const detalle=bc.completo.map(num=>{ const n=notas.find(x=>x.l===(bajo.l+num-1)%7), alt=n.a!==altArmadura(n.l,arm); return {num,n,alt}; });
    const pasos=[`El bajo es <b>${nom(bajo)}</b>. Sobre él se forman: ${detalle.map(d=>`${I_NOM[d.num]} (${nom(d.n)})`).join(', ')}. Cifrado completo: ${bc.completo.join('/')} → ${ESTADOS[estado]}.`,
      `Versión abreviada de ${ESTADOS[estado]}: <b>${bcTxt((cuatro?FIG_TETRADA:FIG_TRIADA)[estado]?(cuatro?FIG_TETRADA:FIG_TRIADA)[estado].split('/'):[])}</b>.`,
      detalle.some(d=>d.alt)?`La armadura ${armFrase(arm)}. ${lista(detalle.filter(d=>d.alt).map(d=>`${nom(d.n)} (la ${I_NOM[d.num]})`))} no coincide${detalle.filter(d=>d.alt).length>1?'n':''} con la armadura: su alteración se escribe junto a la cifra (si es la tercera y no está en la cifra, el signo solo).`:`La armadura ${armFrase(arm)} y todas las notas del acorde coinciden con ella: no hay alteraciones que añadir.`,
      `Bajo cifrado: <b>${bcTxt(bc.cifras)}</b>. En cifrado popular es ${cifrado(ac,estado)}.`];
    if(leer){ const bien=cifrado(ac,estado), cand=[];
      for(const t of K){ const x=acorde(ac.fund,t), y=acorde(bajo,t); if(x&&t!==ac.tipo) cand.push(cifrado(x,estado)); if(y&&estado) cand.push(cifrado(y)); }
      for(let e=0;e<nEst;e++) if(e!==estado){ // el mismo bajo leído como otro estado
        for(const t of K) for(const f of fundamentales(3)){ const x=acorde(f,t); if(x&&mismaNota(x.notas[e],bajo)&&maxAlt(x.notas)<=topeAlt(nv)&&R.chance(0.5)) cand.push(cifrado(x,e)); } }
      return { enunciado:`¿Qué acorde representa este bajo cifrado? La armadura ${armFrase(arm)}.`, vista:pent([{notas:[bajo],abajo:bc.cifras}],{arm}), vistaSol:pent([{notas:[bajo],abajo:bc.cifras},{notas,barra:true,arriba:bien}],{arm}),
        sonar:secAcorde(notas), sonarTras:true, campos:[campo('cif','Acorde',eleccion(R,op(bien),sinDobles(nv,cand).map(c=>op(c))))], sol:{cif:bien}, resumen:`${nom(bajo)} con ${bcTxt(bc.cifras)} y ${armTxt(arm)}: ${bien}.`,
        explicar:()=>listaPasos([`La cifra ${bcTxt(bc.cifras)} indica ${ESTADOS[estado]}: sobre el bajo ${nom(bajo)} van ${detalle.map(d=>`una ${I_NOM[d.num]}`).join(', ')}.`,
          `Con la armadura (${armTxt(arm)}) y las alteraciones de la cifra, las notas son ${detalle.map(d=>nom(d.n)).reverse().join(', ')}.`,
          `Ordenadas por terceras: ${ac.notas.map(nom).join(' – ')} → ${cuatro?TIPOS[ac.tipo].nom:'tríada '+TRI_NOM[ac.tipo]} sobre ${nom(ac.fund)}: <b>${bien}</b>.`]) }; }
    const cand=[]; for(let e=0;e<nEst;e++) if(e!==estado){ const x=bajoCifrado(disponer(ac,e),arm); if(x) cand.push(x.cifras); }
    for(const a of [0,arm+1,arm-1,arm+2,arm-2,-arm]){ const x=bajoCifrado(notas,a); if(x) cand.push(x.cifras); }
    return { enunciado:`¿Cuál es el bajo cifrado (versión abreviada) de este acorde? La armadura ${armFrase(arm)}.`, vista:pent([{notas}],{arm}), vistaSol:pent([{notas,abajo:bc.cifras,arriba:cifrado(ac,estado)}],{arm}), sonar:secAcorde(notas),
      campos:[campo('bc','Bajo cifrado',eleccion(R,opBC(bc.cifras),cand.concat(BC_FIJOS).map(opBC)))], sol:{bc:bcTxt(bc.cifras)}, resumen:`${cifrado(ac,estado)} ${armCon(arm)}: ${bcTxt(bc.cifras)}.`,
      explicar:()=>listaPasos(pasos) };
  }});

  /* ----- Oído ----- */
  registrar({id:pref+'-oido-tipo',tema,modo:'oido',titulo:`Tipo de ${acNom}`,gen(R,nv){
    const tipos=cuatro?tiposNivel(nv):TRIADAS.slice(0,nv<=1?2:4), ac=elegirAcorde(R,Math.max(nv,2),tipos), notas=disponer(ac,0);
    const desc={M:'tercera mayor + tercera menor; quinta justa',m:'tercera menor + tercera mayor; quinta justa',aug:'dos terceras mayores; quinta aumentada',dim:'dos terceras menores; quinta disminuida'};
    return { enunciado:`Escucha ${cuatro?'la tétrada':'la tríada'} (en estado fundamental). ¿De qué tipo es?`, vista:'', vistaSol:pent([{notas,arriba:cifrado(ac)}]), sonar:secAcorde(notas),
      sonarResp:r=>{ const x=r.tipo&&acorde(ac.fund,r.tipo); return x?secAcorde(disponer(x,0)):null; },
      campos:[campo('tipo','Tipo',tipos.map(t=>op(t,cuatro?`${esc(TIPOS[t].cif)} · ${esc(TIPOS[t].nom)}`:Cap(TRI_NOM[t]))))], sol:{tipo:ac.tipo}, resumen:`Sonó ${cifrado(ac)} (${notasTxt(ac.notas)}): ${cuatro?TIPOS[ac.tipo].nom:'tríada '+TRI_NOM[ac.tipo]}.`,
      explicar:r=>par(`Sonó <b>${cifrado(ac)}</b>: ${notasTxt(ac.notas)}. Es una <b>${cuatro?TIPOS[ac.tipo].nom:'tríada '+TRI_NOM[ac.tipo]}</b>${cuatro?'':` (${desc[ac.tipo]})`}.`)+
        (r.tipo&&r.tipo!==ac.tipo&&acorde(ac.fund,r.tipo)?`<p class="tu">Respondiste ${cuatro?TIPOS[r.tipo].nom:'tríada '+TRI_NOM[r.tipo]}, que sobre ${nom(ac.fund)} sería ${notasTxt(acorde(ac.fund,r.tipo).notas)}. Compara las dos con los botones de abajo y fíjate en ${difAcordes(ac,acorde(ac.fund,r.tipo))}.</p>`:'')+listaPasos(pasosTipo(ac,notas)) };
  }});

  registrar({id:pref+'-oido-estado',tema,modo:'oido',titulo:'Estado',gen(R,nv){
    const tipos=cuatro?(nv<=1?['7']:nv===2?['7','maj7','m7']:['7','maj7','m7','m7b5']):(nv<=1?['M']:nv===2?['M','m']:TRIADAS), ac=elegirAcorde(R,2,tipos), estado=R.int(nEst), notas=disponer(ac,estado);
    return { enunciado:`Escucha el acorde (${esc(cuatro?TIPOS[ac.tipo].nom:'tríada '+TRI_NOM[ac.tipo])}). ¿En qué estado está?`, vista:'', vistaSol:pent([{notas,arriba:cifrado(ac,estado)}]), sonar:secAcorde(notas),
      sonarResp:r=>r.estado!=null?secAcorde(disponer(ac,+r.estado)):null,
      campos:[campo('estado','Estado',ESTADOS.slice(0,nEst).map((e,i)=>op(i,Cap(e))))], sol:{estado}, resumen:`Sonó ${cifrado(ac,estado)}: ${ESTADOS[estado]}.`,
      explicar:r=>par(`Sonó <b>${cifrado(ac,estado)}</b>, de grave a aguda: ${notasTxt(notas)}. `+pasoEstado(ac,notas,estado),
        `Para oírlo, canta la nota más grave y compárala con la fundamental (${nom(ac.fund)}): en estado fundamental coinciden; en primera inversión el bajo es la tercera; en segunda, la quinta${cuatro?'; en tercera, la séptima':''}.`)+
        (r.estado!=null&&+r.estado!==estado?`<p class="tu">Respondiste ${ESTADOS[+r.estado]}, que tendría ${nom(ac.notas[+r.estado])} en el bajo. Compara las dos con los botones de abajo.</p>`:'') };
  }});
}
// en qué nota se diferencian dos acordes de la misma fundamental
function difAcordes(a,b){ const d=a.notas.map((n,i)=>b.notas[i]&&!mismaNota(n,b.notas[i])?`la ${COMPONENTE[i]} (${nom(n)} en lugar de ${nom(b.notas[i])})`:null).filter(Boolean); return d.length?lista(d):'el color general'; }
registrarAcordes(2);
