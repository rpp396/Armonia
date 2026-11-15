// Dictado Armónico · Interfaz: portada de temas, pestañas (Resumen, Teoría, Oído), tarjeta de ejercicio, corrección y progreso.
// Script clásico: comparte el ámbito global con los demás de js/.
'use strict';

/* ---------- Estado de la vista ---------- */
const V={tema:null,tab:'resumen',gen:null,ej:null,resp:{},corr:null,sonando:null,sesion:{n:0,ok:0}};
const TABS=[['resumen','Resumen'],['teoria','Teoría'],['oido','Oído']];
const semillaURL=()=>{ const m=/[?&]semilla=(\d+)/.exec(location.search); return m?+m[1]:null; };
let semillaN=0;
function ruta(){ const m=/^#\/tema\/([1-9])(?:\/(resumen|teoria|oido))?$/.exec(location.hash); return m?{tema:+m[1],tab:m[2]||'resumen'}:{tema:null,tab:null}; }

/* ---------- Progreso ---------- */
function progTema(n){ let t=0, ok=0; for(const e of EJ) if(e.tema===n&&store.prog[e.id]){ t+=store.prog[e.id].n; ok+=store.prog[e.id].ok; } return {n:t,ok}; }
const pct=p=>p.n?Math.round(100*p.ok/p.n):0;
function anotar(id,bien){ const p=store.prog[id]||(store.prog[id]={n:0,ok:0,racha:0,mejor:0}); p.n++; if(bien){ p.ok++; p.racha++; p.mejor=Math.max(p.mejor,p.racha); } else p.racha=0; save(); }

/* ---------- Portada ---------- */
function renderPortada(){
  const total=EJ.reduce((s,e)=>s+(store.prog[e.id]?store.prog[e.id].n:0),0);
  $('#app').innerHTML=`<section aria-labelledby="hTemas"><h2 id="hTemas" class="sec">Temas del curso</h2>
    <ol class="temas">${PROGRAMA.map(t=>{ const p=progTema(t.n); return `<li><a class="tema" href="#/tema/${t.n}">
      <span class="tn">Tema ${t.n}</span><span class="tt">${esc(t.titulo)}</span><span class="tp">${t.puntos.map(esc).join(' · ')}</span>
      <span class="pg">${p.n?`<progress max="100" value="${pct(p)}" aria-hidden="true"></progress><span>${p.ok} de ${p.n} bien · ${pct(p)} %</span>`:'<span>Sin ejercicios todavía</span>'}</span></a></li>`; }).join('')}</ol>
    <p class="nota">${total?`Llevas ${total} ${total===1?'ejercicio':'ejercicios'} en total.`:'Elige un tema: cada uno tiene un resumen, ejercicios de teoría y ejercicios de oído que se generan al azar.'}</p></section>`;
  document.title='Dictado Armónico';
}

/* ---------- Tema ---------- */
function renderTema(){
  const t=PROGRAMA[V.tema-1], nv=nivelDe(V.tema);
  $('#app').innerHTML=`<nav aria-label="Navegación"><a class="volver" href="#/">← Todos los temas</a></nav>
    <header class="th"><div><p class="tn">Tema ${t.n}</p><h2 id="hTema" tabindex="-1">${esc(t.titulo)}</h2></div>
      <label class="niv">Nivel <select id="nivel">${NIVELES.map(([v,x])=>`<option value="${v}"${v===nv?' selected':''}>${x}</option>`).join('')}</select></label></header>
    <div class="tabs" role="tablist" aria-label="Secciones del tema">${TABS.map(([k,x])=>`<button type="button" role="tab" id="tab-${k}" data-tab="${k}" aria-selected="${k===V.tab}" aria-controls="panel" tabindex="${k===V.tab?0:-1}">${x}</button>`).join('')}</div>
    <section id="panel" role="tabpanel" aria-labelledby="tab-${V.tab}"></section>`;
  document.title=`Tema ${t.n}: ${t.titulo} · Dictado Armónico`;
  renderPanel();
}
function renderPanel(){
  detener(); V.sonando=null;
  if(V.tab==='resumen'){ RES_SEC=[]; $('#panel').innerHTML=`<article class="card res">${RESUMEN[V.tema]()}<p class="acts"><a class="btn primary" href="#/tema/${V.tema}/teoria">Practicar teoría</a> <a class="btn" href="#/tema/${V.tema}/oido">Practicar oído</a></p></article>`; return; }
  const gens=ejerciciosDe(V.tema,V.tab), k=V.tema+'-'+V.tab, sel=gens.some(g=>g.id===store.set.tipo[k])?store.set.tipo[k]:'mix';
  $('#panel').innerHTML=`<div class="chips" role="group" aria-label="Tipo de ejercicio">
      ${gens.length>1?`<button type="button" class="chip" data-gen="mix" aria-pressed="${sel==='mix'}">Variado</button>`:''}
      ${gens.map(g=>{ const p=store.prog[g.id]; return `<button type="button" class="chip" data-gen="${g.id}" aria-pressed="${sel===g.id||gens.length===1}">${esc(g.titulo)}${p&&p.n?` <small>${pct(p)} %</small>`:''}</button>`; }).join('')}</div>
    <article class="card ej" id="ej" aria-live="off"></article>
    <p class="marcador" id="marcador"></p>`;
  nuevo();
}
function genActual(){ const gens=ejerciciosDe(V.tema,V.tab), k=V.tema+'-'+V.tab, sel=store.set.tipo[k]; return gens.find(g=>g.id===sel)||gens[Math.floor(Math.random()*gens.length)]; }

/* ---------- Ejercicio ---------- */
function nuevo(){
  detener(); V.sonando=null; const g=genActual(), base=semillaURL(), seed=base!==null?base+(semillaN++):(Math.random()*4294967296)>>>0;
  V.gen=g; V.ej=g.gen(crearRng(seed),nivelDe(V.tema)); V.resp={}; V.corr=null; V.ej.campos.forEach(c=>{ if(c.multi) V.resp[c.id]=[]; });
  renderEj(); marcador();
}
function renderEj(){
  const e=V.ej, hecho=!!V.corr, oir=e.sonar&&(!e.sonarTras||hecho);
  $('#ej').innerHTML=`<p class="tipo">${esc(V.gen.titulo)}</p><p class="enun" id="enun">${e.enunciado}</p>
    ${e.vista?`<div class="vista">${e.vista}</div>`:''}
    ${oir?`<p class="oir"><button type="button" class="btn play" data-oir="ej">${icono('play')}<span>${V.tab==='oido'?'Escuchar':'Oír'}</span></button>${V.tab==='oido'?'<span class="pista">Puedes escucharlo las veces que quieras.</span>':''}</p>`:''}
    <div class="campos">${e.campos.map(c=>`<fieldset class="campo" data-campo="${c.id}"${hecho?' disabled':''}><legend>${esc(c.etiqueta)}${c.multi?' <small>(varias)</small>':''}</legend><div class="ops">
      ${c.opciones.map(o=>{ const marcado=c.multi?V.resp[c.id].includes(o.v):V.resp[c.id]===o.v; let cls='';
        if(hecho){ const buena=c.multi?e.sol[c.id].map(String).includes(o.v):(String(e.sol[c.id])===o.v||(marcado&&V.corr.campos[c.id])); cls=buena?' bien':marcado?' mal':''; }
        return `<button type="button" class="opb${cls}" data-v="${esc(o.v)}" aria-pressed="${marcado}"${o.voz?` aria-label="${esc(o.voz)}"`:''}>${o.t}${hecho&&cls?`<span class="sr-only"> (${cls===' bien'?'correcta':'incorrecta'})</span>`:''}</button>`; }).join('')}</div></fieldset>`).join('')}</div>
    ${hecho?'':`<p class="acts"><button type="button" class="btn primary" id="bComprobar"${completo(e,V.resp)?'':' disabled'}>Comprobar</button><span class="pista" id="falta">${completo(e,V.resp)?'':'Elige una opción en cada apartado.'}</span></p>`}
    ${hecho?feedbackHTML():''}`;
}
function feedbackHTML(){
  const e=V.ej, ok=V.corr.ok, exp=e.explicar(V.resp), tieneResp=!ok&&e.sonarResp&&e.sonarResp(V.resp);
  return `<section class="fb ${ok?'ok':'mal'}" id="fb" tabindex="-1" aria-labelledby="ver">
    <h3 class="ver" id="ver">${icono(ok?'ok':'no')}${ok?'Correcto':'Incorrecto'}</h3>
    ${ok?`<p class="porque">${e.resumen}</p>`:`<p class="sol">Respuesta correcta — ${solucionHTML(e)}</p>`}
    ${e.vistaSol?`<div class="vista">${e.vistaSol}</div>`:''}
    ${e.sonar&&(V.tab==='oido'||e.sonarTras)?`<p class="oir"><button type="button" class="btn sm play" data-oir="ej">${icono('play')}<span>Oír lo correcto</span></button>${tieneResp?` <button type="button" class="btn sm play" data-oir="resp">${icono('play')}<span>Oír lo que respondiste</span></button>`:''}</p>`:''}
    ${ok?`<details class="exp"><summary>Ver la explicación</summary>${exp}</details>`:`<div class="exp"><h4>Explicación</h4>${exp}</div>`}
    <p class="acts"><button type="button" class="btn primary" id="bSig">Siguiente ejercicio</button></p></section>`;
}
function marcador(){ const s=V.sesion, p=V.gen&&store.prog[V.gen.id]; $('#marcador').textContent=s.n?`En esta sesión: ${s.ok} de ${s.n} bien${p&&p.racha>1?` · racha de ${p.racha}`:''}.`:''; }
function elegir(campoId,v){
  if(V.corr) return; const c=V.ej.campos.find(x=>x.id===campoId); if(!c) return;
  if(c.multi){ const a=V.resp[c.id], i=a.indexOf(v); if(i>=0) a.splice(i,1); else a.push(v); } else V.resp[c.id]=V.resp[c.id]===v?null:v;
  // se actualiza sin repintar, para no perder el foco
  $$(`[data-campo="${campoId}"] .opb`).forEach(b=>b.setAttribute('aria-pressed',String(c.multi?V.resp[c.id].includes(b.dataset.v):V.resp[c.id]===b.dataset.v)));
  const listo=completo(V.ej,V.resp); $('#bComprobar').disabled=!listo; $('#falta').textContent=listo?'':'Elige una opción en cada apartado.';
}
function comprobar(){
  if(V.corr||!completo(V.ej,V.resp)) return; detener(); V.sonando=null;
  V.corr=corregir(V.ej,V.resp); V.sesion.n++; if(V.corr.ok) V.sesion.ok++; anotar(V.gen.id,V.corr.ok);
  renderEj(); marcador(); const fb=$('#fb'); fb.focus({preventScroll:true}); fb.scrollIntoView({block:'nearest',behavior:smooth()});
  say(V.corr.ok?'Correcto. '+textoPlano(V.ej.resumen):'Incorrecto. Respuesta correcta: '+textoPlano(solucionHTML(V.ej))+'. La explicación está debajo.');
}
const textoPlano=h=>{ const d=document.createElement('div'); d.innerHTML=h; return d.textContent; };

/* ---------- Sonido ---------- */
function oir(que,btn){
  if(V.sonando===btn){ detener(); finSonido(); return; }
  const sec=que==='resp'?V.ej.sonarResp(V.resp):que==='ej'?V.ej.sonar:RES_SEC[+que];
  finSonido(); if(!tocar(sec,finSonido)){ say('No se pudo iniciar el sonido.'); return; }
  V.sonando=btn; btn.classList.add('on'); btn.dataset.txt=$('span',btn)?$('span',btn).textContent:btn.textContent; (btn.querySelector('span')||btn).textContent='Detener';
}
function finSonido(){ const b=V.sonando; V.sonando=null; if(b&&b.isConnected){ b.classList.remove('on'); (b.querySelector('span')||b).textContent=b.dataset.txt; } }
const ICONOS={play:'<path d="M5 3.5v13l11-6.5z"/>',ok:'<path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',no:'<path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'};
const icono=k=>`<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">${ICONOS[k]}</svg>`;

/* ---------- Navegación y eventos ---------- */
function render(){
  const r=ruta(), cambiaTema=r.tema!==V.tema; detener(); V.sonando=null;
  if(r.tema===null){ V.tema=null; renderPortada(); return; }
  if(cambiaTema) V.sesion={n:0,ok:0};
  V.tema=r.tema; V.tab=r.tab; renderTema(); if(cambiaTema){ window.scrollTo(0,0); }
}
function bind(){
  window.addEventListener('hashchange',()=>{ render(); const h=$('#hTema'); if(h) h.focus({preventScroll:true}); });
  $('#app').addEventListener('click',ev=>{
    const b=ev.target.closest('button'); if(!b) return;
    if(b.dataset.tab){ location.hash=`#/tema/${V.tema}/${b.dataset.tab}`; return; }
    if(b.dataset.gen){ store.set.tipo[V.tema+'-'+V.tab]=b.dataset.gen; save(); $$('.chip[data-gen]').forEach(c=>c.setAttribute('aria-pressed',String(c===b))); nuevo(); return; }
    if(b.classList.contains('opb')){ elegir(b.closest('[data-campo]').dataset.campo,b.dataset.v); return; }
    if(b.id==='bComprobar'){ comprobar(); return; }
    if(b.id==='bSig'){ nuevo(); const en=$('#ej'); en.scrollIntoView({block:'nearest',behavior:smooth()}); const p=$('.opb',en); if(p) p.focus({preventScroll:true}); if(V.tab==='oido') say('Ejercicio nuevo. Pulsa Escuchar.'); return; }
    if(b.dataset.oir){ oir(b.dataset.oir,b); return; }
    if(b.dataset.ejm){ oir(b.dataset.ejm,b); return; }
  });
  $('#app').addEventListener('change',ev=>{ if(ev.target.id==='nivel'){ store.set.nivel[V.tema]=intIn(+ev.target.value,1,3,1); save(); if(V.tab!=='resumen') nuevo(); } });
  // pestañas con flechas, Inicio y Fin
  $('#app').addEventListener('keydown',ev=>{ const t=ev.target.closest('[role="tab"]'); if(!t) return; const i=TABS.findIndex(x=>x[0]===t.dataset.tab);
    const j=ev.key==='ArrowRight'?(i+1)%3:ev.key==='ArrowLeft'?(i+2)%3:ev.key==='Home'?0:ev.key==='End'?2:-1; if(j<0) return; ev.preventDefault(); location.hash=`#/tema/${V.tema}/${TABS[j][0]}`; setTimeout(()=>{ const n=$('#tab-'+TABS[j][0]); if(n) n.focus(); },0); });
  // atajos: E escuchar, Intro comprobar o pasar al siguiente (si el foco no está en un control)
  document.addEventListener('keydown',ev=>{ if(ev.ctrlKey||ev.metaKey||ev.altKey||!V.ej||V.tab==='resumen'||V.tema===null) return; const tag=ev.target.tagName;
    if(tag==='SELECT'||tag==='INPUT'||tag==='TEXTAREA') return;
    if(ev.key==='e'||ev.key==='E'){ const b=$('#ej [data-oir="ej"]'); if(b){ ev.preventDefault(); oir('ej',b); } }
    else if(ev.key==='Enter'&&tag!=='BUTTON'&&tag!=='A'&&tag!=='SUMMARY'){ ev.preventDefault(); if(V.corr) $('#bSig').click(); else comprobar(); } });
  $('#snd').addEventListener('change',ev=>{ store.set.snd=oneOf(ev.target.value,SONIDOS.map(x=>x[0]),'piano'); save(); if(ensureAudio()) tocar([{t:0,m:[60,64,67],d:1.1,v:0.6}]); });
  $('#bBorrar').addEventListener('click',()=>{ $('#borrarAsk').hidden=false; $('#bBorrarNo').focus(); });
  $('#bBorrarNo').addEventListener('click',()=>{ $('#borrarAsk').hidden=true; $('#bBorrar').focus(); });
  $('#bBorrarSi').addEventListener('click',()=>{ store.prog={}; save(); V.sesion={n:0,ok:0}; $('#borrarAsk').hidden=true; render(); say('Progreso borrado.'); $('#bBorrar').focus(); });
}
