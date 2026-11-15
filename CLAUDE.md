# Dictado Armónico

App web para practicar los nueve temas del curso de armonía (apuntes en `Temas/`, programa en `Programa del curso.txt`). Cada tema tiene un resumen, ejercicios de teoría y ejercicios de oído generados al azar; el alumno responde con botones y, si falla, ve la respuesta correcta y la explicación. La interfaz está en español. Hermana de DandeBook y DandEtudeDuR (rpp396), de las que toma la paleta, las tipografías, los glifos, los instrumentos y las convenciones.

La app no tiene dependencias ni build: `index.html` (solo HTML), `styles.css` (todos los estilos, con las variables de color y el modo oscuro), las fuentes en `fonts/` y el JavaScript en `js/`, repartido en scripts clásicos que `index.html` carga al final del `<body>` en orden. Para probarla basta con abrir `index.html` (funciona con `file://`) o servir la carpeta. El audio arranca solo tras pulsar un botón.

## Mapa del código (archivos de `js/`, en orden de carga)

**Scripts clásicos, no módulos ES** (los módulos no cargan con `file://`): todos comparten el ámbito global, sin `import`/`export`. **El orden importa:** el código que se ejecuta al cargar un archivo solo puede usar lo de ese archivo y los anteriores; dentro de las funciones se puede usar cualquier cosa. Lo que arranca la app va en `inicio.js`, el último.

| Archivo | Qué hace |
|---|---|
| `glifos.js` | Copiado de DandeBook: `GLYPHS`, contornos de Petaluma como trazados SVG, insertados como `<defs>`. |
| `datos.js` | `$`, `$$`, `esc`, `has`, `isObj`, `intIn`, `oneOf`, `say` (anuncios en `#sr`). `crearRng(semilla)` (azar reproducible: `int`, `pick`, `chance`, `shuffle`). `PROGRAMA` (los 9 temas), `NIVELES`. Guardado: `store = {set, prog}` en `localStorage` `dictado-armonico-v1`, con `cleanSet` / `cleanProg` que validan todo lo que se carga. |
| `teoria.js` | Motor de teoría, **sin DOM**. Notas `{l, a, o}` (letra 0–6, alteración −2…+2, octava) con su ortografía: `nota('fa#')`, `nom`, `cif`, `midi`, `paso`. Intervalos: `intervalo`, `sumar`, `semisDe`, `invertir`, `explicaIntervalo`. Acordes: `TIPOS`, `acorde`, `cifrado`, `disponer` (estado y posición), `clasificar`. `bajoCifrado(notas, armadura)`. Tensiones: `TENS`, `notasEstructura`, `cifradoEstructura`. Tonalidades y escalas: `armaduraDe`, `tonicaDe`, `campoDiatonico`, `tritonoDe`, `ESCALAS`, `escala`. Grados: `acordeDeGrado`, `gradosDe`, `TENS_DISP`, `gradoAcademico`, `gradoPopular`. Funciones: `FUNCIONES`, `funcionesDe`. |
| `pentagrama.js` | `pentagrama(eventos, opt)` → SVG en clave de sol: notas y acordes apilados (segundas desplazadas, alteraciones en columnas), armadura, plicas, silencio de negra, ligaduras, cifrado encima (`arriba`), bajo cifrado debajo (`abajo`), notas marcadas (`marca`) y barras (`barra`). Sin estilos en línea. |
| `instrumentos.js` | Copiado de DandeBook: `tone(inst, midi, t, dur, vel, papel)`, instrumentos sintetizados, `makeReverb`. |
| `audio.js` | `ensureAudio`, `tocar(sec, alTerminar)`, `detener`. |
| `secuencias.js` | Secuencias de sonido `[{t, m:[midi], d, r, v}]`, **sin DOM**: `secIntervalo`, `secAcorde`, `secEscala`, `secProgresion`, `unir`. |
| `ejercicio.js` | Motor de ejercicios, **sin DOM**: `registrar`, `EJ`, `ejerciciosDe`; opciones (`op`, `campo`, `eleccion`, `campoNum`, `campoCal`, `campoLetra`, `campoAlt`); corrección (`corregir`, `completo`, `solucionHTML`); ayudas (`fundamentales(nivel)`, `intentar`, `vozAcorde`, `vocesProgresion`, `cadencia`). |
| `temas/t1.js` … `t9.js` | Los generadores de cada tema. `t2.js` tiene la fábrica `registrarAcordes(tema)` (tríadas y tétradas; `t3.js` solo la llama) y `t7.js` la fábrica `registrarGrados(tema, modo)` (`t8.js` solo la llama). |
| `resumen.js` | `RESUMEN[n]()` → HTML del resumen de cada tema, con ejemplos (`fig`) que suenan (`RES_SEC`). Las tablas de grados y tensiones salen de `teoria.js`. |
| `interfaz.js` | Estado `V`, rutas por hash (`#/`, `#/tema/N/resumen|teoria|oido`), `renderPortada`, `renderTema`, `renderPanel`, `nuevo`, `renderEj`, `comprobar`, `feedbackHTML`, `oir`, `bind`. |
| `inicio.js` | Arranque. Debe ser el último script. |

## Contrato de un ejercicio

```js
registrar({id:'t1-identificar', tema:1, modo:'teoria'|'oido', titulo, gen(R, nivel) {
  return { enunciado,            // html
    vista, vistaSol,             // partitura antes de responder / la que se revela al corregir
    sonar, sonarTras, sonarResp, // secuencia; true = solo se oye tras corregir; función(resp) → lo que el alumno respondió
    campos: [campo(id, etiqueta, [op(valor, html, voz)…], multi)],
    sol: {id: valor | [valores]}, acepta: {id: [otros valores válidos]},
    resumen,                     // una línea: se muestra al acertar
    explicar(resp) };            // html: se muestra al fallar (y plegado al acertar)
}});
```

- El `id` debe cumplir `^t[1-9]-[a-z0-9-]{1,30}$` (lo exige `cleanProg`).
- Todo el azar sale de `R` (nunca `Math.random()` dentro de un generador): las pruebas repiten los ejercicios por semilla. `?semilla=123` en la URL fija la semilla en el navegador.
- Las opciones de un campo deben ser distintas y solo una correcta. Si dos etiquetas son igual de válidas (un acorde que está en dos escalas), se usa `acepta` y se excluyen de los distractores.
- Un ejercicio de oído no enseña partitura antes de responder (`vista: ''`); la revela en `vistaSol`.

## Decisiones del curso (no cambiarlas sin consultar los apuntes)

- **Los intervalos se explican con la forma habitual de calcularlos**, en dos pasos: número (contar los nombres de las notas) y calidad (contar los semitonos entre las naturales y corregir por las alteraciones; comparar con la tabla). Lo pidió el usuario al revisar el plan. El atajo de los apuntes (sextas desde la 5j, séptimas desde la 8j) no se usa en la corrección.
- **Las correcciones miden en semitonos** (`semTxt`), no en tonos: lo pidió el usuario. El Resumen sigue en tonos (`tonosTxt`), como los apuntes.
- **Dobles alteraciones** (`ejercicio.js`): `topeAlt(nivel)` es 1 en básico y 2 desde intermedio; `pideDoble(R, nivel)` hace que el avanzado busque una doble en el 35 % de los ejercicios (decidirlo fuera de `intentar()`, si no casi nunca sale); `sinDobles` las quita de los distractores del básico; `campoAlt(max)` añade ♯♯ y ♭♭ a los botones. Los ejercicios de oído no las usan. Las pruebas exigen 0 % en básico y al menos 4 % en avanzado.
- **Cifrado popular:** `C`, `Cm`, `Caug`, `Cº`; `Cmaj7`, `C7`, `Cmmaj7`, `Cm7`, `Caugmaj7`, `Caug7`, `Cm7(♭5)`, `Cº7`. Tensiones en superíndice, entre paréntesis si alguna no es mayor ni justa.
- **Calidad de intervalos:** `j`, `M`, `m`, `+`, `-` (5j, 3M, 4+, 5-).
- **Bajo cifrado:** abreviado; las notas con alteración distinta de la armadura llevan su signo junto a la cifra; la tercera alterada, si no es parte de la cifra, es el signo solo. En los apuntes hay algún ejemplo que escribe el 3 y otro que no; aquí la regla es siempre esa.
- **Grados:** en mayor la escala implícita es la mayor (`Ma` = mayor armónica); en menor, la armónica (`nat`, `mel`).
- **`TENS_DISP` y `FUNCIONES`** están transcritas a mano de las tablas de los temas 7, 8 y 9. Las tensiones del PDF están en imágenes pequeñas: si se duda de una, mirar el PDF.
- Las definiciones de `NFM` (tema 4) son las de los apuntes. «Nota de paso acentuada» y «grupo de notas de paso» no están definidas allí: aquí, acentuada = suena al articularse el acorde; grupo = dos notas de paso seguidas.

## Diseño y accesibilidad

- Sin estilos en línea ni scripts en línea: la CSP de `index.html` es `default-src 'none'; script-src 'self'; style-src 'self'`. Las barras de progreso son `<progress>`, no anchos en `style`.
- Ninguna petición a otros sitios: todo, fuentes incluidas, va en el repositorio.
- Las opciones son botones con `aria-pressed`; al corregir se marcan `.bien` / `.mal` con texto oculto «correcta / incorrecta». El veredicto se anuncia con `say()` y el foco pasa a `#fb`.
- Atajos: `E` escuchar, `Intro` comprobar o siguiente. Pestañas con flechas.
- Zonas táctiles de 44 px como mínimo.

## Pruebas

`npm test` (Node 18 o posterior, sin dependencias) ejecuta `tests/*.test.mjs`:

- `teoria.test.mjs`: el motor contra los ejemplos de los apuntes (intervalos, cifrados, bajo cifrado, tablas de grados, funciones).
- `generadores.test.mjs`: cada generador en los tres niveles con muchas semillas (`SEMILLAS=1000 npm test` para más): solución entre las opciones, corrección, explicación sin datos rotos, partitura y sonido válidos.
- `estatico.test.mjs`: CSP, nada en línea, ninguna dirección externa, validación de lo guardado.

`tests/lib.mjs` carga los scripts sin DOM en un contexto de `vm`. **No hay pruebas en navegador**: la interfaz se comprueba a mano.
