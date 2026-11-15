// Dictado Armónico · Resumen de cada tema: síntesis de los apuntes del curso con ejemplos en pentagrama que se pueden oír.
// Script clásico: comparte el ámbito global con los demás de js/.
'use strict';

// los ejemplos del resumen que se está viendo; cada botón «Oír» lleva el índice de su secuencia
let RES_SEC=[];
function fig(eventos,opt,sec,pie){ const k=RES_SEC.push(sec||null)-1;
  return `<figure class="ejm">${pentagrama(eventos,opt||{})}<figcaption>${pie||''}${sec?` <button type="button" class="btn sm" data-ejm="${k}">Oír</button>`:''}</figcaption></figure>`; }
const nn=(...xs)=>xs.map(nota);
const figInt=(a,b,pie)=>{ const x=nota(a), y=nota(b); return {notas:[x,y],abajo:[pie]}; };
const figAc=(f,t,est,arriba)=>{ const a=acorde(nota(f),t); return {notas:disponer(a,est||0),arriba:arriba===undefined?cifrado(a,est||0):arriba}; };
// estructura del tema 5 dispuesta para el sistema de piano, con su cifrado
const figEst=(f,base,sus,tens)=>{ const e={fund:nota(f),base,sus,tens}; return {notas:vozEstructura(e).notas,arriba:cifradoEstructura(e).arr}; };
const barras=ev=>ev.map((e,i)=>({...e,barra:i>0}));
const secVarios=ev=>unir(...ev.flatMap(e=>[[{t:0,m:e.notas.map(midi),d:1.3,v:0.6}],0.15]));
const tablaGrados=(esc,cuatro)=>`<tr><th scope="row">${Cap(ESCALAS[esc].nom)}</th>${[1,2,3,4,5,6,7].map(g=>{ const a=acordeDeGrado(nota('do'),esc,g,cuatro); return `<td>${esc_(TIPOS[a.tipo].gen)}<small>${esc_(cifrado(a))}</small></td>`; }).join('')}</tr>`;
const tablaTens=esc=>`<tr><th scope="row">${Cap(ESCALAS[esc].nom)}</th>${[1,2,3,4,5,6,7].map(g=>{ const d=tensDisp(esc,g); return `<td>${d.t.length?d.t.map(tensTxt).join(' '):'—'}${d.seis?'<small>(6)</small>':''}</td>`; }).join('')}</tr>`;
const esc_=s=>esc(s);
const cabGrados='<tr><td></td>'+ROM.map(r=>`<th scope="col">${r}</th>`).join('')+'</tr>';
const tabla=(filas,pie)=>`<div class="tw"><table class="tg">${cabGrados}${filas}</table></div>${pie?`<p class="nota">${pie}</p>`:''}`;
const funcTabla=modo=>'<ul>'+['T','D','S'].map(f=>{ const g={s:[],u:[],c:[]}; Object.entries(FUNCIONES[modo][f]).forEach(([e,c])=>g[c].push(e)); return `<li><b>${Cap(FUNC_NOM[f])}:</b> ${['s','u','c'].filter(c=>g[c].length).map(c=>`${g[c].join(', ')} (${CERT_NOM[c]})`).join('; ')}.</li>`; }).join('')+'</ul>';

const RESUMEN={
1:()=>`
<p>Un <b>intervalo</b> es la distancia entre dos alturas: <i>armónico</i> si suenan a la vez, <i>melódico</i> si suenan una tras otra. Se nombra por el número de notas que abarca, contando la primera y la última (do–mi: do, re, mi → tercera), y se clasifica según los semitonos que contiene.</p>
<h3>Cómo se calcula</h3>
<ol><li><b>Número:</b> se cuentan los nombres de las notas, incluidas la primera y la última.</li><li><b>Calidad:</b> se cuentan los semitonos entre ellas y se compara con la tabla (en semitonos).</li></ol>
<div class="tw"><table class="tg"><tr><td></td><th scope="col">disminuido</th><th scope="col">menor</th><th scope="col">justo</th><th scope="col">mayor</th><th scope="col">aumentado</th></tr>
${[1,2,3,4,5,6,7,8].map(n=>`<tr><th scope="row">${Cap(I_NOM[n])}</th>${['-','m','j','M','+'].map(c=>{ const s=semisDe(n,c); return `<td>${s===null||s<0?'':s}</td>`; }).join('')}</tr>`).join('')}</table></div>
<p class="nota">Unísonos, cuartas, quintas y octavas son justos, aumentados o disminuidos; segundas, terceras, sextas y séptimas son mayores, menores, aumentadas o disminuidas. El unísono disminuido no es posible en la práctica.</p>
${fig(barras([figInt('do4','do5','8j'),figInt('do4','sol4','5j'),figInt('do4','fa4','4j'),figInt('do4','mi4','3M'),figInt('do4','mib4','3m'),figInt('do4','la4','6M'),figInt('do4','sib4','7m'),figInt('do4','fa#4','4+')]),{},secVarios([figInt('do4','do5'),figInt('do4','sol4'),figInt('do4','fa4'),figInt('do4','mi4'),figInt('do4','mib4'),figInt('do4','la4'),figInt('do4','sib4'),figInt('do4','fa#4')]),'Algunos intervalos desde do.')}
<h3>Intervalos compuestos</h3>
<p>Superan la octava: cada uno es un intervalo simple más una octava y conserva su calidad. Novena = segunda + octava; décima = tercera + octava; oncena = cuarta + octava; duodécima = quinta + octava; trecena = sexta + octava; decimocuarta = séptima + octava.</p>
<h3>Intervalos complementarios</h3>
<p>Uno es la inversión del otro y entre los dos completan la octava. Sus números <b>suman nueve</b> (segunda ↔ séptima, tercera ↔ sexta, cuarta ↔ quinta, unísono ↔ octava) y la calidad se invierte: mayor ↔ menor, aumentado ↔ disminuido, justo ↔ justo.</p>
${fig(barras([figInt('do4','mi4','3M'),figInt('mi4','do5','6m'),figInt('si3','fa4','5-'),figInt('fa4','si4','4+')]),{},secVarios([figInt('do4','mi4'),figInt('mi4','do5'),figInt('si3','fa4'),figInt('fa4','si4')]),'La tercera mayor y la sexta menor; la quinta disminuida y la cuarta aumentada.')}`,

2:()=>`
<p>Las <b>tríadas</b> tienen tres alturas distintas, organizadas por superposición de dos terceras a partir de una fundamental.</p>
<ul><li><b>Mayor:</b> tercera mayor + tercera menor (quinta justa).</li><li><b>Menor:</b> tercera menor + tercera mayor (quinta justa).</li><li><b>Aumentada:</b> dos terceras mayores (quinta aumentada).</li><li><b>Disminuida:</b> dos terceras menores (quinta disminuida).</li></ul>
${fig(barras([figAc('do','M'),figAc('do','m'),figAc('do','aug'),figAc('do','dim')]),{},secVarios([figAc('do','M'),figAc('do','m'),figAc('do','aug'),figAc('do','dim')]),'Los cuatro tipos, con su cifrado popular.')}
<h3>Estado y posición</h3>
<p>El <b>estado</b> lo decide la nota del bajo: fundamental (estado fundamental), tercera (primera inversión) o quinta (segunda inversión). La <b>posición</b> la decide la voz superior: de octava (fundamental arriba), de tercera o de quinta. La tríada no pierde su identidad aunque sus notas se repitan, se distribuyan de otra manera o cambien de registro.</p>
${fig(barras([figAc('do','m',0),figAc('do','m',1),figAc('do','m',2)]),{},secVarios([figAc('do','m',0),figAc('do','m',1),figAc('do','m',2)]),'Do menor en estado fundamental, primera y segunda inversión.')}
<h3>Cifrado popular</h3>
<p>Las notas se escriben con letras: A la, B si, C do, D re, E mi, F fa, G sol. La letra sola es la tríada mayor; <b>m</b> menor, <b>aug</b> aumentada, <b>º</b> disminuida. En las inversiones se añade una barra y la nota del bajo (Cm/E♭). Da cuenta del tipo y del estado, pero no de la posición ni de la disposición de las notas.</p>
<h3>Bajo cifrado</h3>
<p>Se escribe la nota del bajo y, debajo, los números de los intervalos que se forman sobre ella. Solo indica el estado: el acorde se deduce con la armadura.</p>
<div class="tw"><table class="tg"><tr><td></td><th scope="col">Fundamental</th><th scope="col">1.ª inversión</th><th scope="col">2.ª inversión</th></tr><tr><th scope="row">Completo</th><td>5/3</td><td>6/3</td><td>6/4</td></tr><tr><th scope="row">Abreviado</th><td>(nada)</td><td>6</td><td>6/4</td></tr></table></div>
<p>Si una nota tiene una alteración distinta de la armadura, la alteración se escribe junto a su cifra; si es la tercera sobre el bajo, basta el signo, sin el 3.</p>`,

3:()=>`
<p>Las <b>tétradas</b> superponen tres terceras: fundamental, tercera, quinta y séptima. Se entienden como una tríada a la que se añade una séptima.</p>
${fig(barras(TETRADAS.map(t=>figAc('do',t))),{},secVarios(TETRADAS.map(t=>figAc('do',t))),'Las ocho tétradas del curso sobre do.')}
<div class="tw"><table class="tg"><tr><th scope="col">Cifrado</th><th scope="col">Tríada</th><th scope="col">Séptima</th></tr>${TETRADAS.map(t=>`<tr><th scope="row">C${esc(TIPOS[t].cif)}</th><td>${TRI_NOM[TIPOS[t].tri]}</td><td>${CAL_NOM[TIPOS[t].iv[2][1]][1]}</td></tr>`).join('')}</table></div>
<p class="nota">La séptima mayor se cifra <b>maj7</b> y la menor <b>7</b>. Las tétradas sobre la tríada disminuida usan cifrados excepcionales: m7(♭5) y º7. Las inversiones llevan barra y bajo, como las tríadas.</p>
<h3>Estados y bajo cifrado</h3>
<div class="tw"><table class="tg"><tr><td></td><th scope="col">Fundamental</th><th scope="col">1.ª inversión</th><th scope="col">2.ª inversión</th><th scope="col">3.ª inversión</th></tr><tr><th scope="row">En el bajo</th><td>fundamental</td><td>tercera</td><td>quinta</td><td>séptima</td></tr><tr><th scope="row">Completo</th><td>7/5/3</td><td>6/5/3</td><td>6/4/3</td><td>6/4/2</td></tr><tr><th scope="row">Abreviado</th><td>7</td><td>6/5</td><td>4/3</td><td>2</td></tr></table></div>
${fig(barras([figAc('sol','7',0),figAc('sol','7',1),figAc('sol','7',2),figAc('sol','7',3)]),{},secVarios([figAc('sol','7',0),figAc('sol','7',1),figAc('sol','7',2),figAc('sol','7',3)]),'G7 en sus cuatro estados.')}`,

4:()=>`
<p>Las <b>notas con función melódica</b> no pertenecen al acorde y se vinculan de distintas formas con las notas acórdicas.</p>
<dl class="defs">${Object.keys(NFM).map(k=>`<dt>${NFM[k].nom}</dt><dd>${NFM[k].def}</dd>`).join('')}</dl>
<p class="nota">En la suspensión, entre la nota suspendida y su resolución puede haber una nota o un grupo de notas (decoración); si la suspensión es la sensible, resuelve ascendiendo.</p>`,

5:()=>`
<p>Las estructuras mayores que una tétrada se consideran tétradas con <b>tensiones</b>. En el cifrado, todo número mayor que la octava es una tensión y se escribe después de la tétrada, en superíndice.</p>
<ul><li>El número solo indica intervalo <b>mayor o justo</b>: 9 (novena mayor), 11 (oncena justa), 13 (trecena mayor).</li><li><b>♯</b> y <b>♭</b> indican un semitono más o menos: ♭9, ♯9, ♯11, ♭13.</li><li>Si alguna tensión no es mayor ni justa, las tensiones van <b>entre paréntesis</b>.</li><li>La <b>13</b> o la <b>♭13</b> ocupa el lugar de la quinta justa: en el acorde suena una u otra, no las dos.</li></ul>
${(()=>{ const ev=barras([figEst('do','7',0,['9']),figEst('do','7',0,['b9']),figEst('do','maj7',0,['9','#11','13'])]); return fig(ev,{gran:true},secVarios(ev),'Novena mayor; novena menor; novena, oncena aumentada y trecena (la 13 ocupa el lugar de la quinta).'); })()}
<h3>Sexta, add y sus</h3>
<ul><li><b>6:</b> la séptima se sustituye por una sexta mayor (C6). Admite tensiones como cualquier tétrada.</li><li><b>add:</b> hay tensiones pero ni séptima ni sexta (Cadd9).</li><li><b>sus4 / sus2:</b> la tercera se sustituye por la cuarta justa o la segunda mayor (Csus4, C7sus4, Cmaj7sus2). Las tensiones van al final.</li></ul>
${(()=>{ const ev=barras([figEst('do','6',0,[]),figEst('do','M',0,['9']),figEst('do','M',4,[]),figEst('do','M',2,[]),figEst('do','7',4,['9'])]); return fig(ev,{gran:true},secVarios(ev),'C6, Cadd9, Csus4, Csus2 y C7sus4 con novena.'); })()}
<p class="nota">Esquema: F · 3 (o sus2 / sus4) · 5 · 7 (o 6) ‖ 9 · 11 · 13 (con «add» si no hay 7 ni 6).</p>`,

6:()=>`
<p>El <b>campo diatónico</b> es una colección de siete notas que se obtiene añadiendo quintas justas consecutivas. Desde fa resulta el campo sin alteraciones: <b>fa – do – sol – re – la – mi – si</b>. Desde otras notas salen los campos con sostenidos o bemoles.</p>
<ul><li>Las notas de los extremos (fa y si) forman un <b>tritono</b>.</li><li>Entre la segunda y la séptima nota (si → do) está el <b>semitono característico del modo mayor</b>: asciende a la fundamental de la tónica mayor.</li><li>Entre la primera y la sexta (fa → mi) está el <b>semitono característico del modo menor</b>: desciende a la quinta de la tónica menor.</li></ul>
<p>Cada campo da una tónica mayor y una menor (relativas). Como los dos semitonos son deseables, el campo se <b>deforma</b> para conseguir el que falta, y de ahí salen las escalas.</p>
<h3>Escalas mayores</h3>
${fig(escalaEscrita(nota('do'),'mayor').map(n=>({notas:[n],sep:1.7})),{},secEscala(escalaEscrita(nota('do'),'mayor')),`Mayor. En semitonos: ${patron('mayor').join(' – ')}.`)}
${fig(escalaEscrita(nota('do'),'mayorArm').map(n=>({notas:[n],sep:1.7})),{},secEscala(escalaEscrita(nota('do'),'mayorArm')),`Mayor armónica: el VI desciende para obtener el semitono característico del modo menor (${patron('mayorArm').join(' – ')}).`)}
<h3>Escalas menores</h3>
${fig(escalaEscrita(nota('la'),'menorNat').map(n=>({notas:[n],sep:1.7})),{},secEscala(escalaEscrita(nota('la'),'menorNat')),`Menor natural: la del campo diatónico sin deformar (${patron('menorNat').join(' – ')}).`)}
${fig(escalaEscrita(nota('la'),'menorArm').map(n=>({notas:[n],sep:1.7})),{},secEscala(escalaEscrita(nota('la'),'menorArm')),`Menor armónica: el VII asciende para obtener la sensible (${patron('menorArm').join(' – ')}).`)}
${fig(escalaEscrita(nota('la'),'menorMel').map(n=>({notas:[n],sep:1.7})),{},secEscala(escalaEscrita(nota('la'),'menorMel')),`Menor melódica: suben el VI y el VII, y así se evita la segunda aumentada (${patron('menorMel').join(' – ')}).`)}`,

7:()=>`
<p>Sobre cada grado de una escala se construyen tríadas y tétradas con las notas de la propia escala. La tonalidad mayor la forman la <b>escala mayor</b> y la <b>mayor armónica</b>.</p>
<h3>Tríadas</h3>${tabla(tablaGrados('mayor',false)+tablaGrados('mayorArm',false),'Tipo genérico y, debajo, el acorde en Do mayor.')}
<h3>Tétradas</h3>${tabla(tablaGrados('mayor',true)+tablaGrados('mayorArm',true))}
<h3>Tensiones disponibles</h3>${tabla(tablaTens('mayor')+tablaTens('mayorArm'),'(6): se puede sustituir la séptima por la sexta mayor. Las demás notas de la escala no están disponibles porque desdibujan la identidad del acorde.')}
<h3>Nomenclatura</h3>
<ul><li><b>Académica:</b> grado en números romanos + bajo cifrado abreviado. Tríadas: I, I6, I6/4. Tétradas: V7, V6/5, V4/3, V2.</li><li><b>Popular:</b> grado y, si está invertido, barra y componente en el bajo: I/3ª (C/E), V/3ª (G7/B).</li><li>La escala implícita es la mayor; los grados de la mayor armónica llevan <b>Ma</b> (VIMa).</li></ul>`,

8:()=>`
<p>La tonalidad menor la forman las escalas <b>menor armónica</b>, <b>menor natural</b> y <b>menor melódica</b>. La de referencia es la armónica: un grado sin más indicación es de la armónica; <b>nat</b> indica la natural y <b>mel</b> la melódica (Vnat, IImel).</p>
<h3>Tríadas</h3>${tabla(tablaGrados('menorNat',false)+tablaGrados('menorArm',false)+tablaGrados('menorMel',false),'Tipo genérico y, debajo, el acorde en do menor.')}
<h3>Tétradas</h3>${tabla(tablaGrados('menorNat',true)+tablaGrados('menorArm',true)+tablaGrados('menorMel',true))}
<h3>Tensiones disponibles</h3>${tabla(tablaTens('menorNat')+tablaTens('menorArm')+tablaTens('menorMel'),'(6): se puede sustituir la séptima por la sexta mayor.')}`,

9:()=>`
<p>La <b>función armónica</b> es el comportamiento de un acorde en relación con el centro tonal. Hay tres: tónica, dominante y subdominante.</p>
<dl class="defs">
<dt>Tónica</dt><dd>Reposo; punto de partida y de llegada. La representa sobre todo el acorde del I grado. Otro grado puede representarla si su tríada tiene dos notas en común con la del I (condición necesaria, no suficiente).</dd>
<dt>Dominante</dt><dd>Tensión que se resuelve hacia la tónica. Sus acordes contienen la <b>sensible</b> (el VII grado a un semitono bajo la tónica), que resuelve en la tónica.</dd>
<dt>Subdominante</dt><dd>Se «aleja» de la tónica y puede ir hacia ella o hacia la dominante. Sus acordes contienen el IV y/o el VI grado y no contienen la sensible.</dd></dl>
<h3>Modo mayor</h3>${funcTabla('M')}
<h3>Modo menor</h3>${funcTabla('m')}
<p class="nota">La escala menor natural no tiene sensible: la función de Vnat y VIInat se vincula con la tonicidad del campo diatónico y de la relativa mayor.</p>
<h3>Resolución del tritono</h3>
<p>La sensible forma un tritono con el IV grado. Dispuesto como <b>quinta disminuida</b> resuelve <b>cerrándose</b>; como <b>cuarta aumentada</b>, <b>abriéndose</b>.</p>
${fig([{notas:nn('si3','fa4'),abajo:['5-']},{notas:nn('do4','mi4')},{notas:nn('fa4','si4'),abajo:['4+'],barra:true},{notas:nn('mi4','do5')}],{},unir([{t:0,m:[59,65],d:1.3,v:0.7}],0.1,[{t:0,m:[60,64],d:1.6,v:0.7}],0.4,[{t:0,m:[65,71],d:1.3,v:0.7}],0.1,[{t:0,m:[64,72],d:1.6,v:0.7}]),'En Do mayor: si–fa se cierra en do–mi; fa–si se abre en mi–do.')}`,
};
