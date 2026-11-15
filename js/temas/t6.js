// Dictado Armónico · Tema 6: campo diatónico y escalas del sistema tonal.
// Script clásico: comparte el ámbito global con los demás de js/.
'use strict';

/* ---------- Ayudas ---------- */
const topeArm=nv=>nv<=1?3:nv===2?5:7;
const armAzar=(R,nv)=>R.int(2*topeArm(nv)+1)-topeArm(nv);
// tonalidad al azar con armadura dentro del nivel
function tonalidadAzar(R,nv,modo){ const m=modo||R.pick(['M','m']), n=armAzar(R,nv); return {tonica:tonicaDe(n,m),modo:m,arm:n}; }
const escNom=(tonica,tipo)=>`${ESCALAS[tipo].modo==='M'?Nom(tonica):nom(tonica)} ${ESCALAS[tipo].nom}`;
// la escala escrita de tónica a tónica, sin salirse mucho del pentagrama
function escalaEscrita(tonica,tipo){ const sc=escala(tonica,tipo), baja=tonica.l>4?-1:0, n=sc.map(x=>N(x.l,x.a,x.o+baja)); return n.concat([N(n[0].l,n[0].a,n[0].o+1)]); }
const ESC_RASGO={
  mayor:'tercera mayor, sexta mayor y séptima mayor: es la escala que surge del campo diatónico natural',
  mayorArm:'tercera mayor y séptima mayor, pero sexta menor: el campo diatónico se deforma para obtener el semitono característico del modo menor (VI–V)',
  menorNat:'tercera menor, sexta menor y séptima menor: es la que surge del campo diatónico sin deformar',
  menorArm:'tercera menor, sexta menor y séptima mayor: el campo diatónico se deforma para obtener el semitono característico del modo mayor (la sensible, VII–I)',
  menorMel:'tercera menor, sexta mayor y séptima mayor: sube el VI además del VII para evitar la segunda aumentada entre ambos',
};
function pasosEscala(tonica,tipo){
  const sc=escala(tonica,tipo), g=i=>ESCALAS[tipo].iv[i-1], q=i=>`${ROM[i-1]} = ${nom(sc[i-1])} (${iNom(+g(i)[0],g(i)[1])})`, pt=patron(tipo).join(' – ');
  return [`Se miran los grados que distinguen a las escalas, medidos desde la tónica <b>${nom(tonica)}</b>: ${q(3)}, ${q(6)} y ${q(7)}.`,
    `La tercera ${g(3)[1]==='M'?'mayor indica una escala <b>mayor</b>':'menor indica una escala <b>menor</b>'}.`,
    `${Cap(ESC_RASGO[tipo])} → <b>escala ${ESCALAS[tipo].nom}</b>.`, `Semitonos entre grados consecutivos (del I a la octava): ${pt}.`];
}
const parTxt=(a,b,flecha)=>`${nom(a)} ${flecha?'→':'–'} ${nom(b)}`;

/* ---------- Teoría ---------- */
registrar({id:'t6-armadura',tema:6,modo:'teoria',titulo:'Campo diatónico y armadura',gen(R,nv){
  const {tonica,modo,arm}=tonalidadAzar(R,nv), campoD=campoDiatonico(arm), alts=alteraciones(arm), rel=tonicaDe(arm,'M');
  return { enunciado:`¿Cuántas alteraciones tiene el campo diatónico de <b>${nomTonalidad(tonica,modo)}</b>?`, vista:'', vistaSol:pent([{notas:[N(tonica.l,tonica.a,tonica.l>4?3:4)]}],{arm}), sonar:null,
    campos:[campo('cant','Cantidad',[0,1,2,3,4,5,6,7].map(k=>op(k))),campo('tipo','Tipo',[op('s','Sostenidos'),op('b','Bemoles'),op('n','Ninguna')])],
    sol:{cant:Math.abs(arm),tipo:arm>0?'s':arm<0?'b':'n'}, acepta:arm===0?{tipo:['s','b','n']}:null, resumen:`${nomTonalidad(tonica,modo)}: ${armTxt(arm)}${alts.length?` (${alts.map(nom).join(', ')})`:''}.`,
    explicar:()=>listaPasos([
      modo==='m'?`Una tonalidad menor comparte el campo diatónico con su relativa mayor, que está una tercera menor por encima: ${nom(tonica)} menor ↔ <b>${Nom(rel)} mayor</b>.`:`El campo diatónico de ${Nom(tonica)} mayor se obtiene añadiendo quintas justas consecutivas.`,
      `Por quintas justas, desde ${nom(campoD[0])}: <b>${campoD.map(nom).join(' – ')}</b>. ${modo==='M'?`La tónica mayor es la segunda nota de la cadena (${nom(campoD[1])})`:`La tónica menor es la quinta nota de la cadena (${nom(campoD[4])})`}.`,
      alts.length?`Notas alteradas: ${alts.map(nom).join(', ')} → <b>${armTxt(arm)}</b>. Los ${arm>0?'sostenidos aparecen en el orden fa, do, sol, re, la, mi, si':'bemoles aparecen en el orden si, mi, la, re, sol, do, fa'}.`:'Ninguna nota está alterada: es el campo diatónico sin alteraciones.']) };
}});

registrar({id:'t6-campo',tema:6,modo:'teoria',titulo:'Tritono y semitonos característicos',gen(R,nv){
  const arm=armAzar(R,Math.min(nv,2)), que=R.pick(['tritono','mayor','menor']), tM=tonicaDe(arm,'M'), tm=tonicaDe(arm,'m'), tr=tritonoDe(arm), sM=semitonoMayor(arm), sm=semitonoMenor(arm), campoD=campoDiatonico(arm);
  const flecha=que!=='tritono', bien=que==='tritono'?tr:que==='mayor'?sM:sm, o=p=>op(parTxt(p[0],p[1],flecha)), cand=[tr,sM,sm,[sM[1],sM[0]],[sm[1],sm[0]],tritonoDe(arm+1),tritonoDe(arm-1),semitonoMayor(arm+1),semitonoMenor(arm-1),[campoD[1],campoD[4]],[campoD[2],campoD[5]]];
  const cadena=`El campo diatónico ${armCon(arm)} (${Nom(tM)} mayor / ${nom(tm)} menor), por quintas justas: <b>${campoD.map(nom).join(' – ')}</b>.`;
  const p1=N(bien[0].l,bien[0].a,4), p2=que==='menor'?N(bien[1].l,bien[1].a,bien[1].l<p1.l?4:3):encima(bien[1],p1);
  const preg={tritono:'¿qué notas forman el tritono?',mayor:'¿cuál es el semitono característico del modo mayor?',menor:'¿cuál es el semitono característico del modo menor?'}[que];
  const exp={tritono:[cadena,`Las notas de los extremos de la cadena, <b>${nom(tr[0])}</b> y <b>${nom(tr[1])}</b>, están a distancia de tritono (6 semitonos): ${iNom(4,'+')} o, invertida, ${iNom(5,'-')}.`],
    mayor:[cadena,`El semitono característico del modo mayor se produce entre la segunda y la séptima nota de la cadena: ${nom(sM[1])} y ${nom(sM[0])}.`,`Tiene dirección <b>ascendente</b> hacia la fundamental del acorde de tónica mayor (${Nom(tM)}): <b>${parTxt(sM[0],sM[1],true)}</b>. ${Cap(nom(sM[0]))} es la sensible.`],
    menor:[cadena,`El semitono característico del modo menor se produce entre la primera y la sexta nota de la cadena: ${nom(sm[0])} y ${nom(sm[1])}.`,`Tiene dirección <b>descendente</b> hacia la quinta del acorde de tónica menor (${nom(tm)} menor: ${lista(acorde(tm,'m').notas.map(nom))}): <b>${parTxt(sm[0],sm[1],true)}</b>.`]}[que];
  return { enunciado:`En el campo diatónico de <b>${Nom(tM)} mayor</b> y <b>${nom(tm)} menor</b> (${armTxt(arm)}), ${preg}`, vista:'', vistaSol:pent([{notas:[p1]},{notas:[p2]}]),
    sonar:null, campos:[campo('par','Notas',eleccion(R,o(bien),cand.map(o)))], sol:{par:o(bien).v}, resumen:`${armTxt(arm)}: ${parTxt(bien[0],bien[1],flecha)}.`, explicar:()=>listaPasos(exp) };
}});

registrar({id:'t6-escala',tema:6,modo:'teoria',titulo:'Identificar la escala',gen(R,nv){
  const pide=pideDoble(R,nv);
  return intentar(()=>{ const tipo=R.pick(nv<=1?['mayor','menorNat','menorArm']:ESC_KEYS), tonica=tonicaDe(armAzar(R,nv),ESCALAS[tipo].modo), notas=escalaEscrita(tonica,tipo); if(maxAlt(notas)>topeAlt(nv)||(pide&&!hayDoble(notas))) return null;
    return { enunciado:`¿Qué escala es esta, que empieza en <b>${nom(tonica)}</b>?`, vista:pent(notas.map(n=>({notas:[n],sep:1.7}))), sonar:secEscala(notas),
      campos:[campo('tipo','Escala',ESC_KEYS.map(k=>op(k,Cap(ESCALAS[k].nom))))], sol:{tipo}, resumen:`${notas.slice(0,7).map(nom).join(' ')}: ${escNom(tonica,tipo)}.`,
      explicar:r=>listaPasos(pasosEscala(tonica,tipo))+(r.tipo&&r.tipo!==tipo?`<p class="tu">Respondiste ${ESCALAS[r.tipo].nom}: desde ${nom(tonica)} sería ${escala(tonica,r.tipo).map(nom).join(' ')} (${ESC_RASGO[r.tipo].split(':')[0]}).</p>`:'') }; });
}});

registrar({id:'t6-grado',tema:6,modo:'teoria',titulo:'Construir la escala',gen(R,nv){
  const pide=pideDoble(R,nv);
  return intentar(()=>{ const tipo=R.pick(nv<=1?['mayor','menorNat','menorArm']:ESC_KEYS), modo=ESCALAS[tipo].modo, arm=armAzar(R,nv), tonica=tonicaDe(arm,modo), sc=escala(tonica,tipo), g=R.chance(0.7)?R.pick([3,6,7]):2+R.int(6), x=sc[g-1];
    if(maxAlt(sc)>topeAlt(nv)||(pide&&!hayDoble([x]))) return null; const natural=escala(tonica,modo==='M'?'mayor':'menorNat'), cambia=!mismaNota(natural[g-1],x), notas=escalaEscrita(tonica,tipo);
    return { enunciado:`En la escala de <b>${escNom(tonica,tipo)}</b>, ¿qué nota es el <b>${ROM[g-1]}</b> grado?`, vista:'', vistaSol:pent(notas.map((n,i)=>({notas:[n],sep:1.7,marca:i===g-1?true:undefined}))), sonar:secEscala(notas), sonarTras:true,
      campos:[campoLetra(),campoAlt(topeAlt(nv))], sol:{letra:x.l,alt:x.a}, resumen:`${escNom(tonica,tipo)}: ${sc.map(nom).join(' ')}. El ${ROM[g-1]} es ${nom(x)}.`,
      explicar:()=>listaPasos([`${nomTonalidad(tonica,modo)} ${armFrase(arm)}. La escala ${modo==='M'?'mayor':'menor natural'}, que sale del campo diatónico sin deformar, es: ${natural.map(nom).join(' ')}.`,
        tipo==='mayor'||tipo==='menorNat'?'Es justamente la escala pedida: no cambia ninguna nota.':`La escala ${ESCALAS[tipo].nom} tiene ${ESC_RASGO[tipo].split(':')[0]}: ${sc.map((n,i)=>mismaNota(n,natural[i])?nom(n):`<b>${nom(n)}</b>`).join(' ')}.`,
        `El ${ROM[g-1]} grado es <b>${nom(x)}</b>, a una ${iNom(+ESCALAS[tipo].iv[g-1][0],ESCALAS[tipo].iv[g-1][1])} de la tónica${cambia?` (en la escala ${modo==='M'?'mayor':'menor natural'} sería ${nom(natural[g-1])})`:''}.`]) }; });
}});

/* ---------- Oído ---------- */
registrar({id:'t6-oido',tema:6,modo:'oido',titulo:'Reconocer la escala',gen(R,nv){
  return intentar(()=>{ const tipos=nv<=1?['mayor','menorNat']:nv===2?['mayor','menorNat','menorArm','menorMel']:ESC_KEYS, tipo=R.pick(tipos), tonica=tonicaDe(armAzar(R,1),ESCALAS[tipo].modo), notas=escalaEscrita(tonica,tipo); if(maxAlt(notas)>1) return null;
    return { enunciado:'Escucha la escala ascendente. ¿De qué tipo es?', vista:'', vistaSol:pent(notas.map(n=>({notas:[n],sep:1.7}))), sonar:secEscala(notas), sonarResp:r=>r.tipo?secEscala(escalaEscrita(tonica,r.tipo)):null,
      campos:[campo('tipo','Escala',tipos.map(k=>op(k,Cap(ESCALAS[k].nom))))], sol:{tipo}, resumen:`Sonó ${escNom(tonica,tipo)}: ${notas.slice(0,7).map(nom).join(' ')}.`,
      explicar:r=>par(`Sonó <b>${escNom(tonica,tipo)}</b>: ${notas.slice(0,7).map(nom).join(' ')}. Tiene ${ESC_RASGO[tipo]}.`,'Para oírlo: primero la tercera (mayor o menor decide el modo) y después el final de la escala, donde están la sexta y la séptima.')+
        (r.tipo&&r.tipo!==tipo?`<p class="tu">Respondiste ${ESCALAS[r.tipo].nom}, que tiene ${ESC_RASGO[r.tipo].split(':')[0]}. Compara las dos con los botones de abajo.</p>`:'')+listaPasos(pasosEscala(tonica,tipo)) }; });
}});
