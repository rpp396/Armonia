// Dictado Armónico · Motor de teoría: notas con su ortografía, intervalos, acordes, cifrados, tensiones, escalas, grados y funciones.
// No toca el DOM (las pruebas lo cargan en Node). Script clásico: comparte el ámbito global con los demás de js/.
'use strict';

/* ---------- Notas ---------- */
// Una nota es {l, a, o}: letra 0–6 (do…si), alteración −2…+2 y octava (do central = do4). La ortografía importa: do♯ no es re♭.
const LAT=['do','re','mi','fa','sol','la','si'], LET=['C','D','E','F','G','A','B'], PC=[0,2,4,5,7,9,11];
const ALT={'-2':'♭♭','-1':'♭','0':'','1':'♯','2':'♯♯'}, ALT_VOZ={'-2':' doble bemol','-1':' bemol','0':'','1':' sostenido','2':' doble sostenido'};
const N=(l,a=0,o=4)=>({l,a,o});
const midi=n=>12*(n.o+1)+PC[n.l]+n.a, paso=n=>n.o*7+n.l, pcDe=n=>((PC[n.l]+n.a)%12+12)%12;
const nom=n=>LAT[n.l]+ALT[n.a], cif=n=>LET[n.l]+ALT[n.a], nomVoz=n=>LAT[n.l]+ALT_VOZ[n.a];
const Nom=n=>{ const s=nom(n); return s[0].toUpperCase()+s.slice(1); };
const mismaNota=(a,b)=>a.l===b.l&&a.a===b.a;
// nota('fa#'), nota('sib3'), nota('mibb')
function nota(s){ const m=/^(do|re|mi|fa|sol|la|si)(bb|b|##|#)?(\d)?$/.exec(s); if(!m) throw new Error('nota: '+s);
  return N(LAT.indexOf(m[1]),{bb:-2,b:-1,'#':1,'##':2}[m[2]]||0,m[3]?+m[3]:4); }

/* ---------- Intervalos ---------- */
const I_NOM=[null,'unísono','segunda','tercera','cuarta','quinta','sexta','séptima','octava','novena','décima','oncena','duodécima','trecena','decimocuarta','doble octava'];
const I_PL=[null,'unísonos','segundas','terceras','cuartas','quintas','sextas','séptimas','octavas'];
const CALS=['j','M','m','+','-'];
const CAL_NOM={j:['justo','justa'],M:['mayor','mayor'],m:['menor','menor'],'+':['aumentado','aumentada'],'-':['disminuido','disminuida']};
const esJusto=num=>{ const c=(num-1)%7; return c===0||c===3||c===4; };
const iNom=(num,cal)=>I_NOM[num]+' '+CAL_NOM[cal][num===1?0:1];
const iTxt=(num,cal)=>num+cal;
// semitonos de un intervalo; null si la calidad no existe para ese número (no hay «quinta mayor»)
function semisDe(num,cal){ const st=num-1, base=PC[st%7]+12*Math.floor(st/7);
  const d=esJusto(num)?{j:0,'+':1,'-':-1}[cal]:{M:0,m:-1,'+':1,'-':-2}[cal]; return d===undefined?null:base+d; }
// intervalo entre dos notas, medido desde la más grave
function intervalo(a,b){
  let lo=a, hi=b; if(paso(b)<paso(a)||(paso(b)===paso(a)&&midi(b)<midi(a))){ lo=b; hi=a; }
  const num=paso(hi)-paso(lo)+1, semis=midi(hi)-midi(lo); let cal=null;
  for(const c of CALS) if(semisDe(num,c)===semis) cal=c;
  return {num,cal,semis,lo,hi,desc:lo!==a};
}
// la nota que queda a ese intervalo por encima (dir=1) o por debajo (dir=-1); null si haría falta más que una doble alteración
function sumar(n,num,cal,dir=1){ const s=semisDe(num,cal); if(s===null) return null;
  const ts=paso(n)+dir*(num-1), l=((ts%7)+7)%7, o=Math.floor(ts/7), a=midi(n)+dir*s-(12*(o+1)+PC[l]);
  return Math.abs(a)>2?null:N(l,a,o); }
function invertir(num,cal){ return {num:9-num,cal:{j:'j',M:'m',m:'M','+':'-','-':'+'}[cal]}; }
// Todas las distancias se miden en semitonos (lo pidió el usuario). tonosTxt ya no se usa en la app; queda por si se vuelve a los tonos de los apuntes.
const semTxt=s=>(s<0?'−':'')+Math.abs(s)+(Math.abs(s)===1?' semitono':' semitonos');
function tonosTxt(s){ const neg=s<0; s=Math.abs(s); const n=Math.floor(s/2), h=s%2; return (neg?'−':'')+(h?(n?n+'½':'½'):String(n))+' T'; }
const tablaCal=num=>(esJusto(num)?['-','j','+']:['-','m','M','+']).map(c=>({cal:c,semis:semisDe(num,c)}));

// Explicación de un intervalo con la forma habitual de calcularlo: 1) el número, contando los nombres de las notas;
// 2) la calidad, contando los semitonos entre las notas naturales y corrigiendo por las alteraciones.
function explicaIntervalo(a,b){
  const it=intervalo(a,b), lo=it.lo, hi=it.hi, oct=Math.floor((it.num-1)/7), simple=it.num-7*oct, pasos=[];
  if(oct>0&&simple>1){ // compuesto: se reduce al simple
    const hi2=N(hi.l,hi.a,hi.o-oct);
    pasos.push(`Entre ${nom(lo)} y ${nom(hi)} hay más de una octava: es un intervalo compuesto. Se baja ${nom(hi)} ${oct===1?'una octava':'dos octavas'} y se calcula el intervalo simple.`);
    pasos.push(...explicaIntervalo(lo,hi2).pasos);
    pasos.push(`${I_NOM[simple][0].toUpperCase()+I_NOM[simple].slice(1)} + octava = ${I_NOM[it.num]}, que conserva la calidad: <b>${iNom(it.num,it.cal)}</b> (${iTxt(it.num,it.cal)}).`);
    return {it,pasos};
  }
  const st=it.num-1, letras=[]; for(let i=0;i<=st;i++) letras.push(LAT[(lo.l+i)%7]);
  pasos.push(`<b>Número.</b> Se cuentan los nombres de las notas, incluidas la primera y la última: ${letras.join(', ')} → ${letras.length===1?'una nota':letras.length+' notas'}: es ${num1(it.num)}.`);
  if(st===0){ pasos.push(`<b>Calidad.</b> Entre ${LAT[lo.l]} y ${LAT[lo.l]} naturales hay 0 semitonos.`); }
  else { const pares=[]; let tot=0; for(let i=0;i<st;i++){ const x=(lo.l+i)%7, y=(x+1)%7, s=(PC[y]-PC[x]+12)%12; tot+=s; pares.push(`${LAT[x]}–${LAT[y]} ${s}`); }
    pasos.push(`<b>Calidad.</b> Se cuentan los semitonos entre las notas naturales: ${pares.join(' + ')} = ${semTxt(tot)}.`); }
  const aj=[]; if(hi.a) aj.push(`${nom(hi)} (la nota aguda) ${hi.a>0?'sube':'baja'} ${semTxt(Math.abs(hi.a))}: el intervalo ${hi.a>0?'crece':'se achica'}`);
  if(lo.a) aj.push(`${nom(lo)} (la nota grave) ${lo.a>0?'sube':'baja'} ${semTxt(Math.abs(lo.a))}: el intervalo ${lo.a>0?'se achica':'crece'}`);
  if(aj.length) pasos.push(`Las alteraciones: ${aj.join('; ')}. Total: <b>${semTxt(it.semis)}</b>.`);
  const tab=tablaCal(it.num).map(x=>`${CAL_NOM[x.cal][it.num===1?0:1]} ${x.semis}`).join(' · ');
  pasos.push(`${I_PL[it.num][0].toUpperCase()+I_PL[it.num].slice(1)}: ${tab} (en semitonos). Con ${semTxt(it.semis)} es <b>${it.cal?iNom(it.num,it.cal):'un intervalo fuera de la tabla'}</b>${it.cal?` (${iTxt(it.num,it.cal)})`:''}.`);
  return {it,pasos};
}
const num1=num=>(num===1?'un ':'una ')+I_NOM[num];
const listaPasos=p=>'<ol class="pasos">'+p.map(x=>`<li>${x}</li>`).join('')+'</ol>';

/* ---------- Acordes ---------- */
// iv: intervalos desde la fundamental; cif: cifrado popular del curso; gen: como aparece en las tablas de grados
const TIPOS={
  M:{iv:[[3,'M'],[5,'j']],cif:'',gen:'M',nom:'mayor',voz:'mayor'},
  m:{iv:[[3,'m'],[5,'j']],cif:'m',gen:'m',nom:'menor',voz:'menor'},
  aug:{iv:[[3,'M'],[5,'+']],cif:'aug',gen:'aug',nom:'aumentada',voz:'aumentado'},
  dim:{iv:[[3,'m'],[5,'-']],cif:'º',gen:'º',nom:'disminuida',voz:'disminuido'},
  maj7:{iv:[[3,'M'],[5,'j'],[7,'M']],cif:'maj7',gen:'Mmaj7',tri:'M',nom:'tríada mayor con séptima mayor',voz:'mayor con séptima mayor'},
  '7':{iv:[[3,'M'],[5,'j'],[7,'m']],cif:'7',gen:'M7',tri:'M',nom:'tríada mayor con séptima menor',voz:'mayor con séptima menor'},
  mmaj7:{iv:[[3,'m'],[5,'j'],[7,'M']],cif:'mmaj7',gen:'mmaj7',tri:'m',nom:'tríada menor con séptima mayor',voz:'menor con séptima mayor'},
  m7:{iv:[[3,'m'],[5,'j'],[7,'m']],cif:'m7',gen:'m7',tri:'m',nom:'tríada menor con séptima menor',voz:'menor con séptima menor'},
  augmaj7:{iv:[[3,'M'],[5,'+'],[7,'M']],cif:'augmaj7',gen:'augmaj7',tri:'aug',nom:'tríada aumentada con séptima mayor',voz:'aumentado con séptima mayor'},
  aug7:{iv:[[3,'M'],[5,'+'],[7,'m']],cif:'aug7',gen:'aug7',tri:'aug',nom:'tríada aumentada con séptima menor',voz:'aumentado con séptima menor'},
  m7b5:{iv:[[3,'m'],[5,'-'],[7,'m']],cif:'m7(♭5)',gen:'m7(♭5)',tri:'dim',nom:'tríada disminuida con séptima menor',voz:'menor siete con quinta bemol'},
  dim7:{iv:[[3,'m'],[5,'-'],[7,'-']],cif:'º7',gen:'º7',tri:'dim',nom:'tríada disminuida con séptima disminuida',voz:'disminuido con séptima disminuida'},
};
const TRIADAS=['M','m','aug','dim'], TETRADAS=['maj7','7','mmaj7','m7','augmaj7','aug7','m7b5','dim7'];
const ESTADOS=['estado fundamental','primera inversión','segunda inversión','tercera inversión'];
const COMPONENTE=['fundamental','tercera','quinta','séptima'];
// acorde sobre una fundamental: {fund, tipo, notas}; null si alguna nota pide más que una doble alteración
function acorde(fund,tipo){ const f=N(fund.l,fund.a,4), notas=[f];
  for(const [num,cal] of TIPOS[tipo].iv){ const x=sumar(f,num,cal); if(!x) return null; notas.push(x); }
  return {fund:f,tipo,notas}; }
const maxAlt=notas=>Math.max(...notas.map(n=>Math.abs(n.a)));
function cifrado(ac,bajo=0){ return cif(ac.fund)+TIPOS[ac.tipo].cif+(bajo?'/'+cif(ac.notas[bajo]):''); }
function acordeVoz(ac,bajo=0){ return `${nomVoz(ac.fund)} ${TIPOS[ac.tipo].voz}${bajo?`, con ${nomVoz(ac.notas[bajo])} en el bajo`:''}`; }
// la nota (letra y alteración) en la octava más baja que quede por encima de «prev» en el pentagrama
function encima(n,prev){ for(let o=0;o<9;o++){ const c=N(n.l,n.a,o); if(paso(c)>paso(prev)) return c; } return N(n.l,n.a,8); }
const octBajo=l=>l<=4?4:3; // el bajo entre la3 y sol4
// Disposición cerrada para el pentagrama: «estado» = componente en el bajo; «pos» = componente en la voz superior (opcional)
function disponer(ac,estado=0,pos=null){
  const k=ac.notas.length, b=ac.notas[estado], out=[N(b.l,b.a,octBajo(b.l))]; let orden=[];
  for(let i=1;i<k;i++) orden.push((estado+i)%k);
  if(pos!==null){ orden=orden.filter(i=>i!==pos); orden.push(pos); }
  for(const i of orden) out.push(encima(ac.notas[i],out[out.length-1]));
  return out;
}
// tipo de acorde que forman unas notas apiladas por terceras desde la primera (o null)
function clasificar(notas){
  const f=notas[0], iv=notas.slice(1).map(n=>{ const num=((n.l-f.l+7)%7)+1, s=(pcDe(n)-pcDe(f)+12)%12; return [num,CALS.find(c=>semisDe(num,c)===s)||'?']; });
  return Object.keys(TIPOS).find(t=>TIPOS[t].iv.length===iv.length&&TIPOS[t].iv.every((x,i)=>x[0]===iv[i][0]&&x[1]===iv[i][1]))||null;
}

/* ---------- Armaduras y bajo cifrado ---------- */
const ORDEN_SOST=[3,0,4,1,5,2,6], ORDEN_BEM=[6,2,5,1,4,0,3];
// alteración que la armadura (n>0 sostenidos, n<0 bemoles) da a una letra
function altArmadura(l,n){ if(n>0) return ORDEN_SOST.slice(0,n).includes(l)?1:0; if(n<0) return ORDEN_BEM.slice(0,-n).includes(l)?-1:0; return 0; }
const SIGNO={'-2':'♭♭','-1':'♭','0':'♮','1':'♯','2':'♯♯'};
const BC_ABREV={'3,5':[],'3,6':[6],'4,6':[6,4],'3,5,7':[7],'3,5,6':[6,5],'3,4,6':[4,3],'2,4,6':[2]};
const BC_ESTADO={'3,5':0,'3,6':1,'4,6':2,'3,5,7':0,'3,5,6':1,'3,4,6':2,'2,4,6':3};
// Bajo cifrado abreviado de unas notas (la primera es el bajo) con una armadura: cifras de arriba abajo, p. ej. ['♯6','4'].
// Las cifras de notas con alteración distinta de la armadura llevan su signo; la tercera alterada, si no forma parte de la cifra, es el signo solo.
function bajoCifrado(notas,arm){
  const b=notas[0], por={}; notas.slice(1).forEach(n=>{ if(n.l!==b.l) por[((n.l-b.l+7)%7)+1]=n; });
  const nums=Object.keys(por).map(Number).sort((x,y)=>x-y), ab=BC_ABREV[nums.join(',')]; if(!ab) return null;
  const out=[]; for(const num of nums.slice().reverse()){ const n=por[num], alt=n.a!==altArmadura(n.l,arm);
    if(ab.includes(num)) out.push((alt?SIGNO[n.a]:'')+num); else if(alt) out.push(num===3?SIGNO[n.a]:SIGNO[n.a]+num); }
  return {cifras:out,estado:BC_ESTADO[nums.join(',')],completo:nums.slice().reverse()};
}
const bcTxt=c=>c.length?c.join('/'):'(sin cifra)';

/* ---------- Tensiones (tema 5) ---------- */
const TENS={'9':[9,'M'],'b9':[9,'m'],'#9':[9,'+'],'11':[11,'j'],'#11':[11,'+'],'13':[13,'M'],'b13':[13,'m']};
const TENS_ORD=['b9','9','#9','11','#11','b13','13'];
const tensTxt=t=>t.replace('b','♭').replace('#','♯');
const TENS_NOM={'9':'novena mayor','b9':'novena menor','#9':'novena aumentada','11':'oncena justa','#11':'oncena aumentada','13':'trecena mayor','b13':'trecena menor'};
// estructura: {fund, base, sus, tens}. base: tríada ('M','m'), tétrada con séptima o con sexta ('6','m6'); sus: 0, 2 o 4
const BASES={M:{iv:[[3,'M'],[5,'j']],cif:''},m:{iv:[[3,'m'],[5,'j']],cif:'m'},
  maj7:{iv:[[3,'M'],[5,'j'],[7,'M']],cif:'maj7'},'7':{iv:[[3,'M'],[5,'j'],[7,'m']],cif:'7'},m7:{iv:[[3,'m'],[5,'j'],[7,'m']],cif:'m7'},
  mmaj7:{iv:[[3,'m'],[5,'j'],[7,'M']],cif:'mmaj7'},m7b5:{iv:[[3,'m'],[5,'-'],[7,'m']],cif:'m7(♭5)'},
  '6':{iv:[[3,'M'],[5,'j'],[6,'M']],cif:'6'},m6:{iv:[[3,'m'],[5,'j'],[6,'M']],cif:'m6'}};
const ordenTens=t=>t.slice().sort((x,y)=>TENS[x][0]-TENS[y][0]||TENS_ORD.indexOf(x)-TENS_ORD.indexOf(y));
function ivEstructura(e){ let iv=BASES[e.base].iv.map(x=>x.slice()); if(e.sus) iv[0]=e.sus===2?[2,'M']:[4,'j'];
  return iv.concat(ordenTens(e.tens).map(t=>TENS[t])).sort((x,y)=>x[0]-y[0]); }
function notasEstructura(e){ const f=N(e.fund.l,e.fund.a,e.fund.l<=2?4:3), out=[f];
  for(const [num,cal] of ivEstructura(e)){ const x=sumar(f,num,cal); if(!x) return null; out.push(x); } return out; }
// cifrado del curso: C7⁹, C7(♭9), Cmaj7(9 ♯11 13), C6, Cadd9, C7sus4⁹
function cifradoEstructura(e){
  const triada=e.base==='M'||e.base==='m', t=ordenTens(e.tens), par=t.some(x=>x.includes('b')||x.includes('#'));
  let base=cif(e.fund)+BASES[e.base].cif+(e.sus?'sus'+e.sus:'');
  if(!t.length) return {txt:base,html:esc(base),arr:base};
  const lista=t.map(tensTxt).join(' ');
  if(triada){ const x=base+'add'+lista.replace(/ /g,' add'); return {txt:x,html:esc(x),arr:x}; }
  const sup=par?`(${lista})`:lista; return {txt:base+' '+sup,html:esc(base)+'<sup>'+esc(sup)+'</sup>',arr:{t:base,sup}};
}
// Low Interval Limits (Berklee): para cada intervalo entre dos voces vecinas, la nota grave más baja admitida (midi).
// 2m mi3 · 2M mi♭3 · 3m do3 · 3M si♭2 · 4j si♭2 · 4+ si2 · 5j si♭1 · 6m sol2 · 6M fa2 · 7m fa2 · 7M fa2 · 9m mi3 · 9M mi♭2
const LIL={1:52,2:51,3:48,4:46,5:46,6:47,7:34,8:43,9:41,10:41,11:41,13:52,14:39};
const cumpleLIL=ms=>ms.every((m,i)=>i===0||!(LIL[ms[i]-ms[i-1]]>ms[i-1]));
const enOctava=(n,m)=>N(n.l,n.a,n.o+Math.round((m-midi(n))/12));
// La 13 (o ♭13) ocupa el lugar de la quinta justa: no suenan las dos.
const sinQuinta=e=>e.tens.some(t=>TENS[t][0]===13)&&BASES[e.base].iv[1][1]==='j';
// Disposición para escribir en el sistema de piano y para sonar: la fundamental sola en el bajo (mi2–re♯3) y las demás notas
// en posición cerrada (tensiones incluidas) en el registro central, respetando los LIL.
// opt.cascara: solo fundamental, tercera (o sus) y séptima (o sexta), más las tensiones.
// Devuelve {notas, rol}: rol 'f' fundamental, '3', '5', '7' (o la sexta), 't' tensión.
function vozEstructura(e,opt={}){
  const f=N(e.fund.l,e.fund.a,4), b=BASES[e.base], partes=[];
  b.iv.forEach((iv,i)=>{ const x=i===0&&e.sus?(e.sus===2?[2,'M']:[4,'j']):iv; partes.push({n:sumar(f,x[0],x[1]),rol:['3','5','7'][i]}); });
  const nucleo=partes.filter(p=>p.rol!=='5'||!(opt.cascara||sinQuinta(e))), tens=ordenTens(e.tens).map(t=>({n:sumar(f,...TENS[t]),rol:'t'}));
  if([...nucleo,...tens].some(p=>!p.n)) return null;
  let bajo=midi(f); while(bajo>51) bajo-=12; while(bajo<40) bajo+=12;
  const arriba=[...nucleo,...tens].sort((x,y)=>(midi(x.n)-midi(f)+120)%12-(midi(y.n)-midi(f)+120)%12);
  let mejor=null;
  for(let r=0;r<arriba.length;r++){
    const orden=arriba.slice(r).concat(arriba.slice(0,r)), ms=[]; let m=Math.max(53,bajo+7);
    orden.forEach((p,i)=>{ if(i) m=ms[i-1]+1; while(((m-pcDe(p.n))%12+12)%12) m++; ms.push(m); });
    const top=ms[ms.length-1], med=ms.reduce((a,c)=>a+c,0)/ms.length, ok=cumpleLIL([bajo,...ms]);
    const nota=(ok?0:1000)+Math.abs(med-65)+(top-ms[0])*0.5+r+(top>79?(top-79)*4:0);
    if(!mejor||nota<mejor.nota) mejor={nota,orden,ms}; }
  return {notas:[enOctava(f,bajo),...mejor.orden.map((p,i)=>enOctava(p.n,mejor.ms[i]))],rol:['f',...mejor.orden.map(p=>p.rol)]};
}

/* ---------- Tonalidades, campo diatónico y escalas ---------- */
// nota en la cadena de quintas: 0 = do, 1 = sol, −1 = fa, 6 = fa♯…
function quinta(k){ const q=k+1; return N(ORDEN_SOST[((q%7)+7)%7],Math.floor(q/7),4); }
const posQuinta=n=>[0,2,4,-1,1,3,5][n.l]+7*n.a;
// armadura de una tonalidad (n de sostenidos; negativo, bemoles) y su inversa
const armaduraDe=(tonica,modo)=>posQuinta(tonica)-(modo==='m'?3:0);
const tonicaDe=(n,modo)=>quinta(n+(modo==='m'?3:0));
const nomTonalidad=(tonica,modo)=>modo==='m'?nom(tonica)+' menor':Nom(tonica)+' mayor';
const armTxt=n=>n===0?'sin alteraciones':Math.abs(n)===1?(n>0?'1 sostenido':'1 bemol'):Math.abs(n)+(n>0?' sostenidos':' bemoles');
const armFrase=n=>n===0?'no tiene alteraciones':'tiene '+armTxt(n), armCon=n=>n===0?'sin alteraciones':'con '+armTxt(n);
const alteraciones=n=>(n>0?ORDEN_SOST.slice(0,n):ORDEN_BEM.slice(0,-n)).map(l=>N(l,n>0?1:-1));
// campo diatónico: siete notas por quintas justas; el de «n» alteraciones va de quinta(n−1) a quinta(n+5)
const campoDiatonico=n=>[0,1,2,3,4,5,6].map(i=>quinta(n-1+i));
const tritonoDe=n=>[quinta(n-1),quinta(n+5)];
const semitonoMayor=n=>[quinta(n+5),quinta(n)];   // 7.ª y 2.ª nota de la cadena: sube a la tónica mayor
const semitonoMenor=n=>[quinta(n-1),quinta(n+4)]; // 1.ª y 6.ª: baja a la quinta de la tónica menor
const ESCALAS={
  mayor:{nom:'mayor',modo:'M',suf:'',iv:['1j','2M','3M','4j','5j','6M','7M']},
  mayorArm:{nom:'mayor armónica',modo:'M',suf:'Ma',iv:['1j','2M','3M','4j','5j','6m','7M']},
  menorNat:{nom:'menor natural',modo:'m',suf:'nat',iv:['1j','2M','3m','4j','5j','6m','7m']},
  menorArm:{nom:'menor armónica',modo:'m',suf:'',iv:['1j','2M','3m','4j','5j','6m','7M']},
  menorMel:{nom:'menor melódica',modo:'m',suf:'mel',iv:['1j','2M','3m','4j','5j','6M','7M']},
};
const ESC_KEYS=Object.keys(ESCALAS), ESC_MODO={M:['mayor','mayorArm'],m:['menorArm','menorNat','menorMel']};
function escala(tonica,tipo){ const t=N(tonica.l,tonica.a,4); return ESCALAS[tipo].iv.map(s=>sumar(t,+s[0],s[1])); }
// patrón de tonos y semitonos entre grados consecutivos (el último, hasta la octava)
function patron(tipo){ const s=ESCALAS[tipo].iv.map(x=>semisDe(+x[0],x[1])).concat(12); return s.slice(1).map((x,i)=>x-s[i]); }

/* ---------- Grados (temas 7 y 8) ---------- */
const ROM=['I','II','III','IV','V','VI','VII'];
const ORD_GRADO=['primer','segundo','tercer','cuarto','quinto','sexto','séptimo'];
const etiqGrado=(g,esc)=>ROM[g-1]+ESCALAS[esc].suf;
// acorde por terceras sobre un grado, con las notas de la escala
function acordeDeGrado(tonica,esc,g,tetrada){ const sc=escala(tonica,esc), idx=[0,2,4].concat(tetrada?[6]:[]).map(i=>sc[(g-1+i)%7]);
  const tipo=clasificar(idx); return tipo?acorde(idx[0],tipo):null; }
const mismoAcorde=(x,y)=>x.tipo===y.tipo&&mismaNota(x.fund,y.fund);
// todas las etiquetas de grado que un acorde admite en un modo (la de la escala de referencia, primero)
function gradosDe(ac,tonica,modo){ const out=[]; for(const esc of ESC_MODO[modo]) for(let g=1;g<=7;g++){ const x=acordeDeGrado(tonica,esc,g,ac.notas.length===4); if(x&&mismoAcorde(x,ac)) out.push({g,esc,etiq:etiqGrado(g,esc)}); } return out; }
// Tensiones disponibles sobre cada grado, transcritas de las tablas del curso (temas 7 y 8). seis: admite sexta en lugar de la séptima.
const TENS_DISP={
  mayor:[['9','13',6],['9','11'],['11'],['9','#11','13',6],['9','13',6],['9','11'],['11','b13']],
  mayorArm:[['9'],['9','11'],[],['9','#11',6],['b9','13',6],['#9','#11'],['11','b13']],
  menorNat:[['9','11'],['11','b13'],['9','13',6],['9','11'],['11'],['9','#11','13',6],['9','13',6]],
  menorArm:[['9','11'],['11','13',6],['9'],['9','#11'],['b9','b13'],['#9','#11','13',6],['b13']],
  menorMel:[['9','11',6],['11'],['9','#11'],['9','#11','13',6],['9','b13'],['9','11','b13'],['b13']],
};
const tensDisp=(esc,g)=>({t:TENS_DISP[esc][g-1].filter(x=>x!==6),seis:TENS_DISP[esc][g-1].includes(6)});
// nomenclatura académica (grado + bajo cifrado abreviado) y popular (grado / componente en el bajo)
const FIG_TRIADA=['','6','6/4'], FIG_TETRADA=['7','6/5','4/3','2'];
const gradoAcademico=(g,esc,estado,tetrada)=>etiqGrado(g,esc)+(tetrada?FIG_TETRADA:FIG_TRIADA)[estado];
const gradoPopular=(g,esc,estado)=>etiqGrado(g,esc)+(estado?'/'+['','3ª','5ª','7ª'][estado]:'');

/* ---------- Funciones armónicas (tema 9) ---------- */
// certeza: s = siempre, u = usualmente, c = solo bajo ciertas circunstancias
const FUNC_NOM={T:'tónica',D:'dominante',S:'subdominante'};
const CERT_NOM={s:'siempre',u:'usualmente',c:'solo bajo ciertas circunstancias'};
const FUNCIONES={
  M:{T:{I:'s',IMa:'s',VI:'u',III:'c',IIIMa:'c'}, D:{V:'s',VMa:'s',VII:'s',VIIMa:'s',III:'c',IIIMa:'c'}, S:{II:'s',IIMa:'s',IV:'s',IVMa:'s',VIMa:'s',VI:'c'}},
  m:{T:{I:'s',Inat:'s',Imel:'s',IIInat:'u'}, D:{V:'s',Vmel:'s',VII:'s',VIImel:'s',Vnat:'u',VIInat:'u',III:'c',IIImel:'c'},
     S:{II:'s',IInat:'s',IImel:'s',IV:'s',IVnat:'s',IVmel:'s',VI:'s',VInat:'s',VImel:'s'}},
};
const funcionesDe=(modo,etiq)=>['T','S','D'].filter(f=>has(FUNCIONES[modo][f],etiq)).map(f=>({f,cert:FUNCIONES[modo][f][etiq]}));
