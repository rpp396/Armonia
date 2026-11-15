// Dictado Armónico · Tema 9: funciones armónicas (tónica, subdominante, dominante) y resolución del tritono.
// Script clásico: comparte el ámbito global con los demás de js/.
'use strict';

/* ---------- Ayudas ---------- */
const OP_FUNC=()=>[op('T','Tónica'),op('S','Subdominante'),op('D','Dominante')];
// datos del acorde que explican su función: notas en común con la tónica, sensible, IV y VI grados
function rasgos(tonica,esc,ac){
  const sc=escala(tonica,esc), tri=ac.notas.slice(0,3), I=acordeDeGrado(tonica,esc,1,false), en=n=>tri.some(x=>mismaNota(x,n));
  const sens=sumar(N(tonica.l,tonica.a,4),2,'m',-1), haySens=mismaNota(sc[6],sens);
  return {sc,I,comunes:I.notas.filter(en),sens:haySens&&en(sc[6])?sc[6]:null,escSens:haySens,iv:en(sc[3])?sc[3]:null,vi:en(sc[5])?sc[5]:null};
}
function pasosFuncion(tonica,modo,esc,ac,etiq){
  const r=rasgos(tonica,esc,ac), fs=funcionesDe(modo,etiq), p=[];
  p.push(`${cifrado(ac)} (${lista(ac.notas.slice(0,3).map(nom))}) es el <b>${etiq}</b> de ${nomTonalidad(tonica,modo)}. Tríada de tónica: ${cifrado(r.I)} (${lista(r.I.notas.map(nom))}).`);
  p.push(`Notas en común con la tríada de tónica: ${r.comunes.length?lista(r.comunes.map(nom)):'ninguna'} (${r.comunes.length}). Para representar la tónica sin ser el I hacen falta dos; es condición necesaria pero no suficiente.`);
  p.push(r.escSens?`Sensible (${nom(r.sc[6])}, un semitono bajo la tónica): ${r.sens?'<b>está</b> en la tríada, rasgo de la función de dominante':'no está en la tríada'}.`:`La ${ESCALAS[esc].nom} no tiene sensible (su VII grado, ${nom(r.sc[6])}, está a dos semitonos de la tónica).`);
  p.push(`IV y VI grados (${nom(r.sc[3])} y ${nom(r.sc[5])}): ${r.iv||r.vi?`contiene ${lista([r.iv,r.vi].filter(Boolean).map(nom))}`:'no contiene ninguno'}. La subdominante contiene el IV y/o el VI y no contiene la sensible.`);
  p.push(`Según el curso, el ${etiq} representa: ${lista(fs.map(f=>`<b>${FUNC_NOM[f.f]}</b> (${CERT_NOM[f.cert]})`))}.`);
  return p;
}

/* ---------- Teoría ---------- */
registrar({id:'t9-funcion',tema:9,modo:'teoria',titulo:'Función de un grado',gen(R,nv){
  const pide=pideDoble(R,nv);
  return intentar(()=>{ const modo=nv<=1?'M':R.pick(['M','m']), T=tonNivel(R,nv,modo), esc=R.pick(escalasNivel(modo,nv)), g=1+R.int(7), ac=acordeDeGrado(T.tonica,esc,g,false); if(!ac||maxAlt(ac.notas)>topeAlt(nv)||(pide&&!hayDoble(ac.notas))) return null;
    const etiq=etiqGrado(g,esc), fs=funcionesDe(modo,etiq);
    return { enunciado:`En <b>${nomTonalidad(T.tonica,modo)}</b>, ¿qué función o funciones puede representar el <b>${etiq}</b> (${cifrado(ac)})? Marca todas las que correspondan.`, vista:pent([{notas:disponer(ac,0),arriba:cifrado(ac),abajo:[etiq]}],{arm:T.arm}), sonar:secAcorde(disponer(ac,0)),
      campos:[campo('func','Función',OP_FUNC(),true)], sol:{func:fs.map(f=>f.f)}, resumen:`${etiq} en modo ${modo==='M'?'mayor':'menor'}: ${lista(fs.map(f=>`${FUNC_NOM[f.f]} (${CERT_NOM[f.cert]})`))}.`,
      explicar:()=>listaPasos(pasosFuncion(T.tonica,modo,esc,ac,etiq)) }; });
}});

registrar({id:'t9-tritono',tema:9,modo:'teoria',titulo:'Resolución del tritono',gen(R,nv){
  const pide=pideDoble(R,nv);
  return intentar(()=>{ const modo=pide?'m':nv<=1?'M':R.pick(['M','m']), T=tonNivel(R,nv,modo), sc=escala(T.tonica,modo==='M'?'mayor':'menorArm'), quinta5=R.chance(0.5); if(maxAlt(sc)>topeAlt(nv)||(pide&&!hayDoble([sc[6],sc[3]]))) return null;
    const S=sc[6], F=sc[3], To=sc[0], Te=sc[2];
    // 5-: la sensible abajo y el IV arriba, resuelve cerrándose; 4+: el IV abajo y la sensible arriba, resuelve abriéndose
    const grave=N((quinta5?S:F).l,(quinta5?S:F).a,4), aguda=encima(quinta5?F:S,grave), rS=quinta5?encima(To,grave):encima(To,aguda), rF0=quinta5?aguda:grave, rF=N(Te.l,Te.a,Te.l<F.l?rF0.o:rF0.o-1);
    const res=(a,b)=>`${nom(S)} → ${nom(a)}, ${nom(F)} → ${nom(b)}`, bien=op(res(To,Te)), otraTe=sumar(N(To.l,To.a,4),3,modo==='M'?'m':'M');
    const cand=[op(res(To,sc[4])),op(res(sc[5],Te)),op(res(To,otraTe)),op(res(sc[4],sc[4])),op(res(sc[5],sc[4]))];
    const ev=[{notas:[grave,aguda]},{notas:[rS,rF],barra:true}];
    return { enunciado:`En <b>${nomTonalidad(T.tonica,modo)}</b>, este es el tritono del acorde de dominante. ¿Cómo está dispuesto, cómo resuelve y hacia qué notas?`, vista:pent([{notas:[grave,aguda]}]), vistaSol:pent(ev),
      sonar:[{t:0,m:[midi(grave),midi(aguda)],d:1.7,v:0.7}], sonarResp:null,
      campos:[campo('disp','Disposición',[op('5','Quinta disminuida'),op('4','Cuarta aumentada')]),campo('mov','Resuelve',[op('c','Cerrándose'),op('a','Abriéndose')]),campo('res','Hacia',eleccion(R,bien,cand))],
      sol:{disp:quinta5?'5':'4',mov:quinta5?'c':'a',res:bien.v}, resumen:`${nom(grave)}–${nom(aguda)} es una ${quinta5?'quinta disminuida: se cierra':'cuarta aumentada: se abre'} (${res(To,Te)}).`,
      _res:[{t:0,m:[midi(grave),midi(aguda)],d:1.5,v:0.7},{t:1.6,m:[midi(rS),midi(rF)],d:2,v:0.7}],
      explicar:()=>listaPasos([`El tritono se forma entre la <b>sensible</b> (${nom(S)}, VII grado, a un semitono bajo la tónica) y el <b>IV grado</b> (${nom(F)}).`,
        `Aquí la nota grave es ${nom(grave)} y la aguda ${nom(aguda)}: ${listaLetras(grave,aguda)} → es una <b>${quinta5?'quinta disminuida':'cuarta aumentada'}</b> (6 semitonos).`,
        `Si el tritono está dispuesto como quinta disminuida resuelve cerrándose; como cuarta aumentada, abriéndose. Este <b>${quinta5?'se cierra':'se abre'}</b>.`,
        `La sensible resuelve en la tónica (${nom(S)} → ${nom(To)}), que es el movimiento característico de la relación dominante–tónica, y el IV grado desciende al III (${nom(F)} → ${nom(Te)}): <b>${res(To,Te)}</b>.`]) }; });
}});
function listaLetras(a,b){ const k=paso(b)-paso(a)+1, l=[]; for(let i=0;i<k;i++) l.push(LAT[(a.l+i)%7]); return `${l.join(', ')} son ${k} notas`; }

/* ---------- Oído ---------- */
registrar({id:'t9-oido',tema:9,modo:'oido',titulo:'Función de cada acorde',gen(R,nv){
  const modo=nv<=1?'M':R.pick(['M','m']), T=tonNivel(R,Math.min(nv,2),modo), esc=modo==='M'?'mayor':'menorArm';
  const gs=modo==='M'?(nv<=1?[1,4,5]:nv===2?[1,2,4,5,6]:[1,2,4,5,6,7]):(nv<=2?[1,2,4,5,6]:[1,2,4,5,6,7]);
  const set=gs.map(g=>{ const ac=acordeDeGrado(T.tonica,esc,g,false), etiq=etiqGrado(g,esc), fs=funcionesDe(modo,etiq); return {g,ac,etiq,f:fs[0].f,otras:fs.slice(1).map(x=>x.f)}; });
  const prog=[set[0]]; while(prog.length<4){ const c=R.pick(set); if(c!==prog[prog.length-1]) prog.push(c); }
  const campos=[1,2,3].map(i=>campo('f'+i,`Acorde ${i+1}`,OP_FUNC())), sol={}, acepta={}; [1,2,3].forEach(i=>{ sol['f'+i]=prog[i].f; if(prog[i].otras.length) acepta['f'+i]=prog[i].otras; });
  return { enunciado:`Suena la cadencia de <b>${nomTonalidad(T.tonica,modo)}</b> y, tras una pausa, cuatro acordes; el primero es la tónica. ¿Qué función cumple cada uno de los otros tres?`, vista:'', vistaSol:pentGrados(prog,T.arm),
    sonar:unir(secCadencia(T.tonica,modo),0.7,secProgresion(vocesProgresion(prog.map(c=>c.ac)),1.6)), ref:refTonal(T.tonica,modo), campos, sol, acepta,
    resumen:`${prog.map(c=>c.etiq).join(' – ')}: ${prog.map(c=>FUNC_NOM[c.f]).join(' – ')}.`,
    explicar:r=>par(`La progresión era <b>${prog.map(c=>c.etiq).join(' – ')}</b> (${prog.map(c=>cifrado(c.ac)).join(' – ')}).`)+
      '<ol class="pasos">'+prog.map((c,i)=>{ const x=rasgos(T.tonica,esc,c.ac), fs=funcionesDe(modo,c.etiq);
        const porque=c.f==='T'?(c.g===1?'es el acorde de tónica: reposo, punto de partida y de llegada':`comparte ${lista(x.comunes.map(nom))} con la tríada de tónica`):c.f==='D'?`contiene la sensible (${nom(x.sc[6])}), que pide resolver en la tónica`:`contiene ${lista([x.iv,x.vi].filter(Boolean).map(nom))} (IV y/o VI grado) y no contiene la sensible: se aleja de la tónica`;
        return `<li>${c.etiq} (${cifrado(c.ac)}): <b>${FUNC_NOM[c.f]}</b> (${CERT_NOM[fs[0].cert]}) — ${porque}${fs[1]?`. También puede ser ${FUNC_NOM[fs[1].f]} (${CERT_NOM[fs[1].cert]})`:''}.${i>0&&r['f'+i]&&r['f'+i]!==c.f&&!c.otras.includes(r['f'+i])?` <span class="tu">Respondiste ${FUNC_NOM[r['f'+i]]}.</span>`:''}</li>`; }).join('')+'</ol>' };
}});
