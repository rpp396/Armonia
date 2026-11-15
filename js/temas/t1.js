// Dictado Armónico · Tema 1: intervalos. Generadores de ejercicios y resumen.
// Script clásico: comparte el ámbito global con los demás de js/.
'use strict';

/* ---------- Ayudas ---------- */
function intervalosNivel(nv){
  const b=[[2,'m'],[2,'M'],[3,'m'],[3,'M'],[4,'j'],[5,'j'],[6,'m'],[6,'M'],[7,'m'],[7,'M'],[8,'j'],[4,'+'],[5,'-']]; if(nv<=1) return b;
  const c=b.concat([[2,'+'],[3,'-'],[4,'-'],[5,'+'],[6,'+'],[7,'-'],[8,'-'],[8,'+']]); return nv===2?c:c.concat([[1,'+'],[2,'-'],[3,'+'],[6,'-'],[7,'+']]);
}
const altMax=topeAlt;
// lo que el alumno respondió, en palabras, frente a lo correcto
function respIntervalo(lo,rnum,rcal){
  if(rnum==null||rcal==null) return '';
  const num=+rnum, s=semisDe(num,rcal);
  if(s===null){ const g=num===1?0:1, cals=(esJusto(num)?['j','+','-']:['M','m','+','-']).map(c=>CAL_NOM[c][g]+(c==='M'||c==='m'?'es':'s'));
    return `<p class="tu">Respondiste «${I_NOM[num]} ${CAL_NOM[rcal][g]}», que no existe: ${num===1?'los':'las'} ${I_PL[num]} son ${lista(cals)}.</p>`; }
  const y=sumar(lo,num,rcal);
  return `<p class="tu">Respondiste ${iNom(num,rcal)} (${iTxt(num,rcal)}), que tiene ${semTxt(s)}${y?` y desde ${nom(lo)} sería ${nom(lo)}–${nom(y)}`:''}.</p>`;
}
const evIntervalo=(lo,hi,num)=>num<=1?[{notas:[lo]},{notas:[hi]}]:[{notas:[lo,hi]}];

/* ---------- Teoría ---------- */
registrar({id:'t1-identificar',tema:1,modo:'teoria',titulo:'Identificar el intervalo',gen(R,nv){
  return intentar(()=>{ const [num,cal]=R.pick(intervalosNivel(nv)), lo=R.pick(fundamentales(nv)), hi=sumar(lo,num,cal);
    if(!hi||Math.abs(hi.a)>altMax(nv)||paso(hi)>41) return null;
    return { enunciado:`¿Qué intervalo hay entre <b>${nom(lo)}</b> y <b>${nom(hi)}</b>?`, vista:pent(evIntervalo(lo,hi,num)), sonar:secIntervalo(lo,hi,'asc',true),
      campos:[campoNum(1,8),campoCal()], sol:{num,cal}, resumen:`${nom(lo)}–${nom(hi)}: ${iNom(num,cal)} (${semTxt(semisDe(num,cal))}).`,
      explicar:r=>listaPasos(explicaIntervalo(lo,hi).pasos)+respIntervalo(lo,r.num,r.cal) }; });
}});

registrar({id:'t1-construir',tema:1,modo:'teoria',titulo:'Construir el intervalo',gen(R,nv){
  return intentar(()=>{ const [num,cal]=R.pick(intervalosNivel(nv).filter(x=>x[0]>1)), dir=nv>1&&R.chance(0.45)?-1:1, base0=R.pick(fundamentales(nv)), base=N(base0.l,base0.a,dir>0?4:5), dest=sumar(base,num,cal,dir);
    if(!dest||Math.abs(dest.a)>altMax(nv)||paso(dest)>41||paso(dest)<26) return null;
    const lo=dir>0?base:dest, hi=dir>0?dest:base, sentido=dir>0?'ascendente':'descendente';
    const explicar=r=>{ const st=num-1, letras=[]; for(let i=0;i<=st;i++) letras.push(LAT[(((base.l+dir*i)%7)+7)%7]);
      const natDest=N(dest.l,0,dest.o), n0=intervalo(base,natDest), falta=semisDe(num,cal)-n0.semis, pasos=[];
      pasos.push(`<b>Nombre de la nota.</b> Se cuentan ${num} notas ${dir>0?'hacia arriba':'hacia abajo'} desde ${LAT[base.l]}, incluida la primera: ${letras.join(', ')} → la nota es un <b>${LAT[dest.l]}</b>.`);
      pasos.push(`<b>Tamaño.</b> Entre ${nom(dir>0?base:natDest)} y ${nom(dir>0?natDest:base)} hay ${semTxt(n0.semis)}${n0.cal?` (${iNom(n0.num,n0.cal)})`:''}. ${Cap(num1(num))} ${CAL_NOM[cal][1]} tiene ${semTxt(semisDe(num,cal))}.`);
      if(falta===0) pasos.push(`Coincide: no hace falta ninguna alteración → <b>${nom(dest)}</b>.`);
      else pasos.push(`Hay que ${falta>0?'agrandar':'achicar'} el intervalo ${semTxt(Math.abs(falta))}. La nota que se busca es la ${dir>0?'aguda':'grave'}: para ${falta>0?'agrandarlo':'achicarlo'} se ${(falta>0)===(dir>0)?'sube':'baja'} → <b>${nom(dest)}</b>.`);
      let tu=''; if(r.letra!=null&&r.alt!=null){ const x=N(+r.letra,+r.alt,dest.o), cand=[x,N(x.l,x.a,x.o+1),N(x.l,x.a,x.o-1)].map(c=>intervalo(base,c)).find(c=>(dir>0?c.lo===base:c.hi===base)&&c.num<=8&&c.num>=1);
        if(cand&&!(+r.letra===dest.l&&+r.alt===dest.a)) tu=`<p class="tu">Respondiste ${nom(x)}: ${nom(cand.lo)}–${nom(cand.hi)} es ${cand.cal?iNom(cand.num,cand.cal):num1(cand.num)} (${semTxt(cand.semis)}).</p>`; }
      return listaPasos(pasos)+tu; };
    return { enunciado:`¿Qué nota está una <b>${I_NOM[num]} ${CAL_NOM[cal][1]} ${sentido}</b> desde <b>${nom(base)}</b>?`, vista:pent([{notas:[base]}]), vistaSol:pent(evIntervalo(lo,hi,num)),
      sonar:secIntervalo(base,dest,dir>0?'asc':'desc'), sonarTras:true,
      campos:[campoLetra(),campoAlt(altMax(nv))], sol:{letra:dest.l,alt:dest.a}, resumen:`${iNom(num,cal)} ${sentido} desde ${nom(base)}: ${nom(dest)}.`, explicar }; });
}});

registrar({id:'t1-compuestos',tema:1,modo:'teoria',titulo:'Intervalos compuestos',gen(R,nv){
  return intentar(()=>{ const [sn,cal]=R.pick(intervalosNivel(Math.min(nv,2)).filter(x=>x[0]>1&&x[0]<8)), num=sn+7, variante=R.pick(['ident','simple','comp']);
    const tabla='novena = segunda + octava · décima = tercera + octava · oncena = cuarta + octava · duodécima = quinta + octava · trecena = sexta + octava · decimocuarta = séptima + octava';
    const regla=`Un intervalo compuesto es un intervalo simple más una octava (${tabla}) y mantiene la calidad del simple.`;
    if(variante==='ident'){ const lo=R.pick(fundamentales(nv)), hi=sumar(lo,num,cal); if(!hi||Math.abs(hi.a)>altMax(nv)||paso(hi)>44) return null;
      return { enunciado:`¿Qué intervalo compuesto hay entre <b>${nom(lo)}</b> y <b>${nom(hi)}</b>?`, vista:pent([{notas:[lo,hi]}]), sonar:secIntervalo(lo,hi,'asc',true),
        campos:[campoNum(9,14),campoCal()], sol:{num,cal}, resumen:`${nom(lo)}–${nom(hi)}: ${iNom(num,cal)} = ${iNom(sn,cal)} + octava.`,
        explicar:r=>listaPasos(explicaIntervalo(lo,hi).pasos)+par(regla) }; }
    if(variante==='simple') return { enunciado:`¿A qué intervalo simple corresponde una <b>${iNom(num,cal)}</b>?`, vista:'', sonar:null,
      campos:[campoNum(2,7),campoCal()], sol:{num:sn,cal}, resumen:`${Cap(iNom(num,cal))} = ${iNom(sn,cal)} + octava.`,
      explicar:()=>par(regla,`${Cap(I_NOM[num])} = ${I_NOM[sn]} + octava: se restan siete al número (${num} − 7 = ${sn}) y la calidad no cambia → <b>${iNom(sn,cal)}</b>.`) };
    return { enunciado:`¿Qué intervalo compuesto resulta de sumar una octava a una <b>${iNom(sn,cal)}</b>?`, vista:'', sonar:null,
      campos:[campoNum(9,14),campoCal()], sol:{num,cal}, resumen:`${Cap(iNom(sn,cal))} + octava = ${iNom(num,cal)}.`,
      explicar:()=>par(regla,`${Cap(I_NOM[sn])} + octava = ${I_NOM[num]}: se suman siete al número (${sn} + 7 = ${num}) y la calidad no cambia → <b>${iNom(num,cal)}</b>.`) }; });
}});

registrar({id:'t1-complementarios',tema:1,modo:'teoria',titulo:'Intervalos complementarios',gen(R,nv){
  return intentar(()=>{ const pool=intervalosNivel(Math.max(nv,2)).filter(x=>x[0]>=2&&x[0]<=7).concat([[1,'j'],[8,'j']]), [num,cal]=R.pick(nv<=1?pool.filter(x=>'jMm'.includes(x[1])):pool), inv=invertir(num,cal);
    const lo=R.pick(fundamentales(nv)), hi=sumar(lo,num,cal); if(!hi||Math.abs(hi.a)>topeAlt(nv)) return null;
    const lo2=hi, hi2=N(lo.l,lo.a,lo.o+1), evInv=evIntervalo(lo2,hi2,inv.num); evInv[0].barra=true;
    const vSol=pent([...evIntervalo(lo,hi,num),...evInv]);
    const mapa={j:'un intervalo justo sigue siendo justo',M:'un intervalo mayor se vuelve menor',m:'un intervalo menor se vuelve mayor','+':'un intervalo aumentado se vuelve disminuido','-':'un intervalo disminuido se vuelve aumentado'};
    return { enunciado:`¿Cuál es la inversión (el intervalo complementario) de ${num===1?'un':'una'} <b>${iNom(num,cal)}</b>?`, vista:pent(evIntervalo(lo,hi,num)), vistaSol:vSol, sonar:secIntervalo(lo,hi,'asc',true),
      campos:[campoNum(1,8),campoCal()], sol:{num:inv.num,cal:inv.cal}, resumen:`La inversión de ${iTxt(num,cal)} es ${iTxt(inv.num,inv.cal)}: ${iNom(inv.num,inv.cal)}.`,
      explicar:r=>listaPasos([`<b>Número.</b> Los números de dos intervalos complementarios suman nueve: 9 − ${num} = ${inv.num} → ${num1(inv.num)}.`,
        `<b>Calidad.</b> Al invertir, ${mapa[cal]} → <b>${iNom(inv.num,inv.cal)}</b> (${iTxt(inv.num,inv.cal)}).`,
        `Comprobación: ${nom(lo)}–${nom(hi)} (${semTxt(semisDe(num,cal))}) y su inversión ${nom(hi)}–${nom(lo)} (${semTxt(semisDe(inv.num,inv.cal))}) completan la octava: 12 semitonos.`])+
        (r.num!=null&&r.cal!=null&&semisDe(+r.num,r.cal)!==null&&!(+r.num===inv.num&&r.cal===inv.cal)?`<p class="tu">Respondiste ${iNom(+r.num,r.cal)} (${semTxt(semisDe(+r.num,r.cal))}): con ${iTxt(num,cal)} suma ${semTxt(semisDe(num,cal)+semisDe(+r.num,r.cal))}, no 12.</p>`:'') }; });
}});

/* ---------- Oído ---------- */
const OIDO_INT=[[2,'m'],[2,'M'],[3,'m'],[3,'M'],[4,'j'],[4,'+'],[5,'j'],[6,'m'],[6,'M'],[7,'m'],[7,'M'],[8,'j']];
registrar({id:'t1-oido',tema:1,modo:'oido',titulo:'Reconocer el intervalo',gen(R,nv){
  return intentar(()=>{ const pool=nv<=1?OIDO_INT.filter(x=>[2,3,5,8].includes(x[0])||x[1]==='j'):OIDO_INT, [num,cal]=R.pick(pool), modo=nv<=1?'asc':R.pick(nv===2?['asc','desc']:['asc','desc','arm']);
    const lo0=R.pick(fundamentales(2)), lo=N(lo0.l,lo0.a,R.pick([3,4])), hi=sumar(lo,num,cal); if(!hi||Math.abs(hi.a)>1||midi(lo)<55||midi(hi)>84) return null;
    const s=semisDe(num,cal), opciones=pool.map(([n,c])=>op(semisDe(n,c),n===4&&c==='+'?'Tritono (4+ / 5-)':`${Cap(iNom(n,c))} (${iTxt(n,c)})`)), como={asc:'melódico ascendente',desc:'melódico descendente',arm:'armónico'}[modo];
    return { enunciado:`Escucha el intervalo (${como}). ¿Cuál es?`, vista:'', vistaSol:pent(modo==='arm'?[{notas:[lo,hi]}]:(modo==='asc'?[{notas:[lo]},{notas:[hi]}]:[{notas:[hi]},{notas:[lo]}])), sonar:secIntervalo(lo,hi,modo),
      sonarResp:r=>{ const x=OIDO_INT.find(([n,c])=>semisDe(n,c)===+r.int); const y=x&&sumar(lo,x[0],x[1]); return y?secIntervalo(lo,y,modo):null; },
      campos:[campo('int','Intervalo',opciones)], sol:{int:s}, resumen:`Sonó ${nom(lo)}–${nom(hi)}: ${iNom(num,cal)} (${semTxt(s)}).`,
      explicar:r=>{ const d=r.int!=null?+r.int-s:0;
        return par(`Sonó <b>${modo==='desc'?nom(hi)+'–'+nom(lo):nom(lo)+'–'+nom(hi)}</b> (${como}): <b>${iNom(num,cal)}</b>, ${semTxt(s)}.`)+
          (d?`<p class="tu">Respondiste un intervalo de ${semTxt(+r.int)}, ${semTxt(Math.abs(d))} más ${d>0?'grande':'chico'} que el que sonó. Compara los dos con los botones de abajo.</p>`:'')+
          listaPasos(explicaIntervalo(lo,hi).pasos); } }; });
}});
