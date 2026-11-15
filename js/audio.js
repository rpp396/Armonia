// Dictado Armónico · Web Audio: reproduce «secuencias» (listas de notas con su momento, ver secuencias.js) con los instrumentos de instrumentos.js.
// Script clásico: comparte el ámbito global con los demás de js/. El audio arranca solo tras pulsar un botón.
'use strict';

/* ---------- Motor ---------- */
const A={ctx:null,out:null,rev:null,bus:null,fin:0};
function ensureAudio(){
  if(!A.ctx){ try{ try{ if(navigator.audioSession) navigator.audioSession.type='playback'; }catch(e){}
      A.ctx=new (window.AudioContext||window.webkitAudioContext)(); const comp=A.ctx.createDynamicsCompressor(); comp.threshold.value=-16; comp.ratio.value=4; comp.connect(A.ctx.destination); A.out=comp;
      A.rev=makeReverb(A.ctx); const wet=A.ctx.createGain(); wet.gain.value=0.2; A.rev.connect(wet); wet.connect(comp); }
    catch(e){ return false; } }
  if(A.ctx.state!=='running') A.ctx.resume().catch(()=>{});
  return true;
}
// el sonido «8 bits» de DandeBook; instrumentos.js lo usa como reserva
function voice(dest,freq,t,dur,type,peak,sus,cut){
  const c=A.ctx, o=c.createOscillator(), g=c.createGain(); o.type=type; o.frequency.value=freq;
  const end=t+Math.max(0.06,dur); g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(peak,t+0.012); g.gain.setTargetAtTime(sus,t+0.014,0.09); g.gain.setTargetAtTime(0.0001,end,0.05);
  let n=o; if(cut){ const f=c.createBiquadFilter(); f.type='lowpass'; f.frequency.value=cut; o.connect(f); n=f; } n.connect(g); g.connect(dest); o.start(t); o.stop(end+0.4);
}
function detener(){
  clearTimeout(A.fin); A.fin=0;
  if(A.bus&&A.ctx){ const b=A.bus, t=A.ctx.currentTime; try{ b.gain.cancelScheduledValues(t); b.gain.setValueAtTime(b.gain.value,t); b.gain.linearRampToValueAtTime(0.0001,t+0.04); }catch(e){} setTimeout(()=>{ try{ b.disconnect(); }catch(e){} },120); }
  A.bus=null;
}
// sec: [{t, m:[midi…], d, r:'mel'|'chord'|'bass', v}] en segundos. Devuelve false si no hay audio.
function tocar(sec,alTerminar){
  if(!sec||!sec.length||!ensureAudio()) return false;
  detener(); const c=A.ctx, bus=c.createGain(); bus.gain.value=1; bus.connect(A.out); bus.connect(A.rev); A.bus=bus;
  const t0=c.currentTime+0.09; let fin=0;
  for(const e of sec){ for(const m of e.m) tone(store.set.snd,m,t0+e.t,e.d,e.v||1,e.r||'mel',bus); fin=Math.max(fin,e.t+e.d); }
  A.fin=setTimeout(()=>{ A.fin=0; if(alTerminar) alTerminar(); },(fin+0.35)*1000);
  return true;
}
document.addEventListener('visibilitychange',()=>{ if(document.hidden) detener(); });
