// Dictado Armónico · Utilidades, programa del curso, ajustes y su guardado en el navegador.
// Script clásico (no módulo): comparte el ámbito global con los demás de js/; el orden de carga está en index.html.
'use strict';

/* ---------- Utilidades ---------- */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const has=(o,k)=>o!=null&&Object.prototype.hasOwnProperty.call(o,k);
const isObj=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const intIn=(v,a,b,d)=>Number.isInteger(v)&&v>=a&&v<=b?v:d;
const oneOf=(v,list,d)=>list.includes(v)?v:d;
const r2=v=>Math.round(v*100)/100;
const reduceMQ=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const smooth=()=>reduceMQ.matches?'auto':'smooth';
let srT=0;
function say(t){ const el=$('#sr'); if(!el) return; clearTimeout(srT); el.textContent=''; srT=setTimeout(()=>{el.textContent=t;},40); }

/* ---------- Azar con semilla (mulberry32): las pruebas repiten los mismos ejercicios ---------- */
function crearRng(seed){
  let a=seed>>>0;
  const f=()=>{ a=(a+0x6D2B79F5)>>>0; let t=a; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; };
  const R={ f, int:n=>Math.floor(f()*n), pick:arr=>arr[Math.floor(f()*arr.length)], chance:p=>f()<p,
    shuffle:arr=>{ const b=arr.slice(); for(let i=b.length-1;i>0;i--){ const j=Math.floor(f()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b; } };
  return R;
}

/* ---------- Programa del curso ---------- */
const PROGRAMA=[
  {n:1,titulo:'Intervalos',puntos:['Justos, mayores, menores, disminuidos y aumentados','Intervalos compuestos','Intervalos complementarios']},
  {n:2,titulo:'Tríadas',puntos:['Mayores, menores, disminuidas y aumentadas','Estado y posición','Cifrado popular','Bajo cifrado']},
  {n:3,titulo:'Tétradas',puntos:['Tipos de tétradas','Estado fundamental e inversiones','Cifrado popular','Bajo cifrado']},
  {n:4,titulo:'Notas con función melódica',puntos:['Notas de paso','Bordaduras','Suspensiones','Apoyaturas y escapadas','Doble bordadura incompleta y cambiata','Anticipación']},
  {n:5,titulo:'Tensiones',puntos:['Novenas, oncenas y trecenas','Sexta en lugar de la séptima','Novenas agregadas (add)','Acordes sus4 y sus2']},
  {n:6,titulo:'Campo diatónico y escalas',puntos:['Campo diatónico','Tritono y semitonos característicos','Escalas mayores','Escalas menores']},
  {n:7,titulo:'Grados de la tonalidad mayor',puntos:['Tríadas y tétradas de la escala mayor y mayor armónica','Tensiones disponibles','Nomenclatura académica y popular']},
  {n:8,titulo:'Grados de la tonalidad menor',puntos:['Tríadas y tétradas de las escalas menor armónica, natural y melódica','Tensiones disponibles']},
  {n:9,titulo:'Funciones armónicas',puntos:['Tónica','Dominante y resolución del tritono','Subdominante']},
];
const NIVELES=[[1,'Básico'],[2,'Intermedio'],[3,'Avanzado']];

/* ---------- Ajustes y progreso (localStorage) ---------- */
const KEY='dictado-armonico-v1';
const SONIDOS=[['piano','Piano'],['epiano','Piano eléctrico'],['guitar','Guitarra'],['organ','Órgano'],['pad','Cuerdas']];
const DEFAULTS={snd:'piano',nivel:{},tipo:{}};
function cleanSet(s){
  const o={snd:'piano',nivel:{},tipo:{}}; if(!isObj(s)) return o;
  o.snd=oneOf(s.snd,SONIDOS.map(x=>x[0]),'piano');
  if(isObj(s.nivel)) for(let n=1;n<=9;n++) if(has(s.nivel,n)) o.nivel[n]=intIn(s.nivel[n],1,3,3);
  if(isObj(s.tipo)) for(const k of Object.keys(s.tipo).slice(0,40)) if(/^[1-9]-(teoria|oido)$/.test(k)&&typeof s.tipo[k]==='string'&&s.tipo[k].length<40) o.tipo[k]=s.tipo[k];
  // visto: ya se vio (o se omitió) la bienvenida; solo cuenta true, y si no, no se guarda
  if(s.visto===true) o.visto=true;
  return o;
}
// progreso por generador: {n: intentos, ok: aciertos, racha, mejor, niv?: {1|2|3: {n, ok}}}. `niv` es el desglose por nivel;
// lo guardado antes de que existiera no lo tiene y sigue contando en n y ok.
function cleanProg(p){
  const o={}; if(!isObj(p)) return o;
  for(const k of Object.keys(p).slice(0,200)){ const v=p[k]; if(!/^t[1-9]-[a-z0-9-]{1,30}$/.test(k)||!isObj(v)) continue;
    const n=intIn(v.n,0,1e7,0), ok=Math.min(n,intIn(v.ok,0,1e7,0)); o[k]={n,ok,racha:intIn(v.racha,0,1e7,0),mejor:intIn(v.mejor,0,1e7,0)};
    if(isObj(v.niv)){ const niv={}; for(const l of [1,2,3]) if(has(v.niv,l)&&isObj(v.niv[l])){ const ln=intIn(v.niv[l].n,0,1e7,0); niv[l]={n:ln,ok:Math.min(ln,intIn(v.niv[l].ok,0,1e7,0))}; }
      if(Object.keys(niv).length) o[k].niv=niv; } }
  return o;
}
let store={set:cleanSet(null),prog:{}};
function load(){ try{ const raw=localStorage.getItem(KEY); if(raw){ const d=JSON.parse(raw); store={set:cleanSet(d&&d.set),prog:cleanProg(d&&d.prog)}; } }catch(e){ store={set:cleanSet(null),prog:{}}; } }
function save(){ try{ localStorage.setItem(KEY,JSON.stringify(store)); }catch(e){} }
// sin nivel elegido, el tema empieza en avanzado
function nivelDe(tema){ return store.set.nivel[tema]||3; }
// la bienvenida sale sola solo la primera vez: sin la marca, sin progreso guardado y sin ?semilla= (pruebas reproducibles)
const debeMostrarBienvenida=(st,search)=>!(st&&st.set&&st.set.visto===true)&&!(st&&isObj(st.prog)&&Object.keys(st.prog).length)&&!/[?&]semilla=\d+/.test(search||'');
