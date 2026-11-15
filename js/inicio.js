// Dictado Armónico · Arranque. Debe ser el último script.
'use strict';

load();
$('#snd').innerHTML=SONIDOS.map(([v,x])=>`<option value="${v}"${v===store.set.snd?' selected':''}>${x}</option>`).join('');
bind();
render();
// al cargar las fuentes cambia el ancho de los textos de la partitura
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(()=>{ if(V.tema!==null&&V.tab==='resumen') renderPanel(); });
