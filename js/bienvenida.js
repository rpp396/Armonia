// Dictado Armónico · Bienvenida: un <dialog> modal de cuatro pasos (marcado en index.html) que sale sola la primera vez
// (ver debeMostrarBienvenida en datos.js) y se reabre con «Cómo funciona» en el pie. Al cerrarse de cualquier forma
// (Empezar, Omitir o Esc) guarda store.set.visto; el nivel elegido solo se aplica con «Empezar».
// Script clásico: comparte el ámbito global con los demás de js/. La arranca inicio.js.
'use strict';

// paso: 0–3; nivel: el que pulsó el alumno en el paso 2 (null = no tocó nada y no se escribe ningún nivel); desde: a dónde vuelve el foco
const B={paso:0,nivel:null,desde:null};
const PASOS=4;
const acordePrueba=()=>[{t:0,m:[60,64,67],d:1.1,v:0.6}];
function pasoBienvenida(i,anunciar){
  const d=$('#bienv'); B.paso=Math.max(0,Math.min(PASOS-1,i));
  $$('[data-paso]',d).forEach(s=>{ s.hidden=+s.dataset.paso!==B.paso; });
  const t=$('#bvT'+(B.paso+1)); d.setAttribute('aria-labelledby',t.id);
  $('#bvN').textContent=`Paso ${B.paso+1} de ${PASOS}`;
  $('#bvAtras').hidden=B.paso===0; $('#bvSig').textContent=B.paso===PASOS-1?'Empezar':'Siguiente';
  t.focus(); if(anunciar) say(`Paso ${B.paso+1} de ${PASOS}: ${t.textContent}.`);
}
function abrirBienvenida(){
  const d=$('#bienv'); if(d.open) return; const a=document.activeElement;
  B.desde=a&&a!==document.body&&!d.contains(a)?a:null; B.nivel=null;
  // marca el nivel que tienen ya los nueve temas (avanzado si no se eligió ninguno); si difieren, ninguno
  const ns=PROGRAMA.map(t=>nivelDe(t.n)), comun=ns.every(n=>n===ns[0])?ns[0]:0;
  $$('[data-bvnivel]',d).forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.bvnivel===comun)));
  $('#bvSnd').value=store.set.snd; d.returnValue='';
  // con el diálogo modal abierto, lo de fuera es inerte: la región de anuncios (#sr) se lleva dentro para que say() se oiga
  d.appendChild($('#sr')); d.showModal(); pasoBienvenida(0,false);
}
function iniciarBienvenida(){
  const d=$('#bienv');
  $('#bvNiv').innerHTML=NIVELES.map(([v,x])=>`<button type="button" class="nivb" data-bvnivel="${v}" aria-pressed="false">${x}</button>`).join('');
  $('#bvSnd').innerHTML=SONIDOS.map(([v,x])=>`<option value="${v}">${x}</option>`).join('');
  d.addEventListener('click',ev=>{ const b=ev.target.closest('button'); if(!b) return;
    if(b.dataset.bvnivel){ B.nivel=intIn(+b.dataset.bvnivel,1,3,3); $$('[data-bvnivel]',d).forEach(c=>c.setAttribute('aria-pressed',String(c===b)));
      say(`Nivel ${NIVELES[B.nivel-1][1].toLowerCase()} para los nueve temas.`); return; }
    if(b.id==='bvSig'){ if(B.paso===PASOS-1) d.close('empezar'); else pasoBienvenida(B.paso+1,true); return; }
    if(b.id==='bvAtras'){ pasoBienvenida(B.paso-1,true); return; }
    if(b.id==='bvOmitir'){ d.close('omitir'); return; }
    if(b.id==='bvProbar'&&!tocar(acordePrueba())) say('No se pudo iniciar el sonido.'); });
  // flechas: paso anterior o siguiente (no en el desplegable, que las usa para elegir)
  d.addEventListener('keydown',ev=>{ if(ev.ctrlKey||ev.metaKey||ev.altKey||ev.target.tagName==='SELECT') return;
    const j=ev.key==='ArrowRight'?B.paso+1:ev.key==='ArrowLeft'?B.paso-1:-1; if(j<0||j>=PASOS) return; ev.preventDefault(); pasoBienvenida(j,true); });
  // el mismo ajuste que el desplegable del pie: se guarda al momento y suena un acorde
  $('#bvSnd').addEventListener('change',ev=>{ store.set.snd=oneOf(ev.target.value,SONIDOS.map(x=>x[0]),'piano'); save(); $('#snd').value=store.set.snd; tocar(acordePrueba()); });
  // Esc dispara «cancel» y después «close» (returnValue vacío): cuenta como omitir
  d.addEventListener('close',()=>{ document.body.appendChild($('#sr'));
    const nivel=d.returnValue==='empezar'&&B.nivel; if(nivel) PROGRAMA.forEach(t=>{ store.set.nivel[t.n]=nivel; });
    store.set.visto=true; save(); if(nivel&&V.tema!==null) render();
    const f=B.desde&&B.desde.isConnected?B.desde:$('#app'); f.focus({preventScroll:true}); });
  $('#bAyuda').addEventListener('click',abrirBienvenida);
}
