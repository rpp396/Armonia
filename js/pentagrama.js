// Dictado Armónico · Pentagrama en SVG: clave de sol o sistema de piano (sol y fa); notas sueltas, intervalos y acordes apilados,
// armadura, alteraciones, plicas, silencio de negra, ligaduras, cifrado encima (con superíndice), bajo cifrado debajo y notas marcadas.
// Usa los glifos de Petaluma (glifos.js). Script clásico: comparte el ámbito global con los demás de js/. No usa estilos en línea (la CSP solo admite styles.css).
'use strict';

const gw=k=>(typeof GLYPHS!=='undefined'&&GLYPHS[k]?GLYPHS[k].w:100)/100;
function use(k,x,y,sp){ return `<use href="#g-${k}" transform="translate(${r2(x)} ${r2(y)}) scale(${r2(sp/100*1000)/1000})"/>`; }
const ACCG={'1':['sharp'],'-1':['flat'],'0':['nat'],'2':['dsharp'],'-2':['flat','flat']};
const accW=a=>a===2?1.05:ACCG[a].reduce((s,g)=>s+gw(g)+0.05,0);
// el doble sostenido no está entre los glifos: un aspa con remates
function dsharp(x,y,sp){ const c=x+sp*0.5, h=sp*0.34, t=sp*0.2; const brazo=(dx,dy)=>`<line x1="${r2(c-dx*h)}" y1="${r2(y-dy*h)}" x2="${r2(c+dx*h)}" y2="${r2(y+dy*h)}" stroke-width="${r2(t)}"/>`;
  const punto=(dx,dy)=>`<rect x="${r2(c+dx*h-t*1.2)}" y="${r2(y+dy*h-t*1.2)}" width="${r2(t*2.4)}" height="${r2(t*2.4)}"/>`;
  return `<g class="st">${brazo(1,1)}${brazo(1,-1)}</g>${punto(1,1)}${punto(-1,-1)}${punto(1,-1)}${punto(-1,1)}`; }
function accSVG(a,xr,y,sp){ // dibuja la alteración terminando en xr; devuelve el trazado
  if(a===2) return dsharp(xr-sp*1.05,y,sp);
  let s='', x=xr; const gs=ACCG[a]; for(let i=gs.length-1;i>=0;i--){ x-=(gw(gs[i])+0.05)*sp; s+=use(gs[i],x,y,sp); } return s; }
const SHARP_POS=[38,35,39,36,33,37,34], FLAT_POS=[34,37,33,36,32,35,31];
const HEAD={w:'nhW',h:'nhH',q:'nhB'};
// cifrado encima: texto o {t, sup} (la parte sup va en superíndice)
const arribaTxt=a=>!a?'':typeof a==='string'?a:a.t+(a.sup?' '+a.sup:'');
const anchoTexto=(s,fs)=>[...s].length*fs*0.56;
const anchoArriba=(a,fs)=>typeof a==='string'?anchoTexto(a,fs):anchoTexto(a.t,fs)+(a.sup?anchoTexto(a.sup,fs*0.68)+fs*0.1:0);
const arribaSVG=(a,fs)=>typeof a==='string'?esc(a):esc(a.t)+(a.sup?`<tspan class="sup" dx="${r2(fs*0.08)}" dy="${r2(-fs*0.42)}" font-size="${r2(fs*0.68)}">${esc(a.sup)}</tspan>`:'');

// eventos: [{notas, fig:'w'|'h'|'q'|'r', marca:[índices]|true, arriba:'texto'|{t,sup}, abajo:['6','4'], barra:true, liga:true, sep}]
// opt: {arm: armadura, sp: espacio entre líneas, aria: descripción, gran: sistema de piano (las notas por debajo del do central van en clave de fa)}
function pentagrama(eventos,opt={}){
  const sp=opt.sp||15, arm=opt.arm||0, kN=Math.abs(arm), th=Math.max(1.2,sp*0.13), gran=!!opt.gran;
  // cada pentagrama: ref = paso de la línea superior (fa5 en sol, la3 en fa)
  const enFa=st=>gran&&st<28;
  const todos=eventos.flatMap(e=>e.notas||[]).map(paso), sol=todos.filter(st=>!enFa(st)), fa=todos.filter(enFa);
  const hayArriba=eventos.some(e=>e.arriba), hayMarca=eventos.some(e=>e.marca), lineas=Math.max(0,...eventos.map(e=>(e.abajo||[]).length));
  const plica=eventos.some(e=>e.fig==='q'||e.fig==='h')?sp*3.5:0, fsLab=sp*1.5;
  const hi=Math.max(38,...sol), loS=Math.min(30,...sol);
  const arribaNotas=Math.max((hi-38)*sp/2+sp*0.8,sp*1.6)+(plica?sp*1.2:0);
  const y0=Math.round(arribaNotas+(hayMarca?sp*1.5:0)+(hayArriba?sp*2.6:0)+4);
  let yB=null, loFin;
  if(gran){ const hiF=Math.max(26,...fa), loF=Math.min(18,...fa);
    const bajoSol=(30-loS)*sp/2+sp*0.9, sobreFa=(hiF-26)*sp/2+sp*0.9;
    yB=Math.round(y0+4*sp+Math.max(sp*3.2,bajoSol+sobreFa+sp*0.4)); loFin={top:yB,ref:26,lo:loF}; }
  else loFin={top:y0,ref:38,lo:loS};
  const pent_=st=>enFa(st)?{top:yB,ref:26}:{top:y0,ref:38};
  const yDe=st=>{ const p=pent_(st); return p.top+(p.ref-st)*sp/2; };
  const bajoNotas=Math.max((loFin.ref-8-loFin.lo)*sp/2+sp*0.9,sp*1.4)+(plica?sp*1.2:0), yFin=loFin.top+4*sp;
  const yCif=yFin+bajoNotas+sp*1.25, H=Math.round(yFin+bajoNotas+(lineas?lineas*sp*1.35+sp*0.6:0)+4);
  const yLab=y0-arribaNotas-(hayMarca?sp*1.5:0)-sp*0.5, ySup=y0, yInf=yFin;
  let x=sp*0.6+(gran?sp*0.4:0), s='', gl='', lin='', txt='', finLab=0;
  gl+=use('gClef',x,y0+3*sp,sp); if(gran) gl+=use('fClef',x+sp*0.15,yB+sp,sp); x+=sp*3.3;
  for(let k=0;k<kN;k++){ const st=arm>0?SHARP_POS[k]:FLAT_POS[k]; gl+=use(arm>0?'sharp':'flat',x+k*sp*1.05,yDe(st),sp); if(gran) gl+=use(arm>0?'sharp':'flat',x+k*sp*1.05,yB+(26-(st-14))*sp/2,sp); }
  x+=kN?kN*sp*1.05+sp*0.6:0; x+=sp*0.9;
  let estado={}, prev=null;
  const etiqueta=(a,xa)=>{ txt+=`<text class="lab" x="${r2(xa)}" y="${r2(yLab)}" font-size="${r2(fsLab)}">${arribaSVG(a,fsLab)}</text>`; return xa+anchoArriba(a,fsLab); };
  eventos.forEach((e,ei)=>{
    if(e.barra){ x=Math.max(x,finLab+sp*0.6); lin+=`<line class="bl" x1="${r2(x)}" y1="${ySup}" x2="${r2(x)}" y2="${yInf}"/>`; x+=sp*1.1; estado={}; }
    const fig=e.fig||'w';
    if(fig==='r'){ gl+=use('rQ',x,y0+2*sp,sp);
      if(e.arriba) finLab=etiqueta(e.arriba,x);
      x+=sp*(gw('rQ')+2.2); prev=null; return; }
    const notas=e.notas.map((n,i)=>({n,i,st:paso(n)})).sort((a,b)=>a.st-b.st), hk=HEAD[fig], hw=gw(hk)*sp;
    notas.forEach(o=>{ o.fa=enFa(o.st); o.k=o.st-(o.fa?100:0); });
    // segundas: la nota superior de cada par va a la derecha (solo dentro del mismo pentagrama)
    notas.forEach((o,j)=>{ const p=notas[j-1]; o.der=!!p&&p.fa===o.fa&&o.st-p.st<=1&&!p.der; });
    // alteraciones que hay que escribir, según la armadura y lo ya escrito en el compás
    notas.forEach(o=>{ const base=has(estado,o.st)?estado[o.st]:altArmadura(o.n.l,arm); o.acc=(o.n.a!==base&&!(e.liga&&prev&&prev.some(p=>p.st===o.st&&p.n.a===o.n.a)))?o.n.a:null; });
    notas.forEach(o=>{ estado[o.st]=o.n.a; });
    const cols=[]; notas.slice().reverse().forEach(o=>{ if(o.acc===null) return; let c=0; while(cols[c]&&cols[c].some(k=>Math.abs(k-o.k)<6)) c++; (cols[c]=cols[c]||[]).push(o.k); o.col=c; });
    const anchoCol=cols.map((_,c)=>Math.max(...notas.filter(o=>o.col===c).map(o=>accW(o.acc)))), hayDer=notas.some(o=>o.der);
    let hx=x+anchoCol.reduce((a,b)=>a+b*sp+sp*0.12,0)+(cols.length?sp*0.25:0);
    if(e.arriba&&finLab) hx=Math.max(hx,finLab+sp*0.8); // que el cifrado anterior no se monte sobre este
    const cx=hx+hw/2, marcas=e.marca===true?notas.map(o=>o.i):(e.marca||[]);
    notas.forEach(o=>{ const x0=hx+(o.der?hw-th*0.4:0), y=yDe(o.st), ref=o.fa?26:38; let g='';
      // líneas adicionales
      const xa=x0-sp*0.45, xb=x0+hw+sp*0.45; for(let st=ref+2;st<=o.st;st+=2) lin+=`<line class="stl" x1="${r2(xa)}" y1="${r2(yDe(st))}" x2="${r2(xb)}" y2="${r2(yDe(st))}"/>`;
      for(let st=ref-10;st>=o.st;st-=2) lin+=`<line class="stl" x1="${r2(xa)}" y1="${r2(yDe(st))}" x2="${r2(xb)}" y2="${r2(yDe(st))}"/>`;
      g+=use(hk,x0,y,sp);
      if(o.acc!==null){ let xr=hx-sp*0.25; for(let c=0;c<o.col;c++) xr-=anchoCol[c]*sp+sp*0.12; g+=accSVG(o.acc,xr,y,sp); }
      if(fig!=='w'){ const up=o.st<ref-4, sx=up?x0+hw-th/2:x0+th/2; g+=`<line class="st" x1="${r2(sx)}" y1="${r2(y+(up?-1:1)*sp*0.15)}" x2="${r2(sx)}" y2="${r2(y+(up?-1:1)*sp*3.5)}" stroke-width="${r2(th)}"/>`; }
      if(e.liga&&prev){ const p=prev.find(q=>q.st===o.st); if(p){ const d=o.st<ref-4?1:-1, ya=y+d*sp*0.75, xa2=p.x+hw*0.9, xb2=x0+hw*0.1, mid=(xa2+xb2)/2;
        g+=`<path class="tie" d="M${r2(xa2)} ${r2(ya)} Q${r2(mid)} ${r2(ya+d*sp*1.2)} ${r2(xb2)} ${r2(ya)} Q${r2(mid)} ${r2(ya+d*sp*0.8)} ${r2(xa2)} ${r2(ya)}Z"/>`; } }
      o.x=x0; gl+=marcas.includes(o.i)?`<g class="mk">${g}</g>`:g; });
    if(marcas.length){ const my=y0-arribaNotas-sp*0.4, mx=cx; txt+=`<path class="mkp" d="M${r2(mx-sp*0.6)} ${r2(my-sp*0.9)} L${r2(mx+sp*0.6)} ${r2(my-sp*0.9)} L${r2(mx)} ${r2(my)}Z"/>`; }
    if(e.arriba) finLab=etiqueta(e.arriba,hx);
    (e.abajo||[]).forEach((c,k)=>{ txt+=`<text class="cif" x="${r2(cx)}" y="${r2(yCif+k*sp*1.35)}" font-size="${r2(sp*1.3)}" text-anchor="middle">${esc(c)}</text>`; });
    prev=notas; x=hx+hw+(hayDer?hw:0)+sp*(e.sep||(fig==='w'?2.6:2.0));
  });
  const W=Math.round(Math.max(x+sp*0.4,finLab+sp*0.8));
  const lineasDe=top=>{ let l=''; for(let i=0;i<5;i++) l+=`<line class="stl" x1="0.5" y1="${top+i*sp}" x2="${W-0.5}" y2="${top+i*sp}"/>`; return l; };
  s+=lineasDe(y0); if(gran) s+=lineasDe(yB);
  s+=`<line class="bl" x1="0.5" y1="${ySup}" x2="0.5" y2="${yInf}"/><line class="bl" x1="${W-0.5}" y1="${ySup}" x2="${W-0.5}" y2="${yInf}"/>`;
  return `<svg class="pent" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(opt.aria||describe(eventos))}">${s}${lin}<g class="gl">${gl}</g>${txt}</svg>`;
}
// descripción en palabras para lectores de pantalla
function describe(eventos){ return eventos.map(e=>e.fig==='r'?'silencio':(e.arriba?arribaTxt(e.arriba)+': ':'')+e.notas.slice().sort((a,b)=>paso(a)-paso(b)).map(n=>nomVoz(n)).join(', ')).join('; '); }
