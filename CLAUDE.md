# Dictado Armónico

App web para practicar los nueve temas del curso de armonía (apuntes en `Temas/` y programa en `Programa del curso.txt`, que no están en el repositorio; su contenido está resumido en `APUNTES.md`, que es la referencia cuando no están los PDF). Cada tema tiene un resumen, ejercicios de teoría y ejercicios de oído generados al azar; el alumno responde con botones y, si falla, ve la respuesta correcta y la explicación. La interfaz está en español. Hermana de DandeBook y DandEtudeDuR (rpp396), de las que toma la paleta, las tipografías, los glifos, los instrumentos y las convenciones.

La app no tiene dependencias ni build: `index.html` (solo HTML), `styles.css` (todos los estilos, con las variables de color y el modo oscuro), las fuentes en `fonts/`, los iconos en `iconos/`, el JavaScript en `js/`, el manifiesto `manifest.webmanifest` y el service worker `sw.js`, repartido en scripts clásicos que `index.html` carga al final del `<body>` en orden. Para probarla basta con abrir `index.html` (funciona con `file://`) o servir la carpeta (por http(s) es además instalable y funciona sin conexión; ver «Instalable y sin conexión»). El audio arranca solo tras pulsar un botón.

## Mapa del código (archivos de `js/`, en orden de carga)

**Scripts clásicos, no módulos ES** (los módulos no cargan con `file://`): todos comparten el ámbito global, sin `import`/`export`. **El orden importa:** el código que se ejecuta al cargar un archivo solo puede usar lo de ese archivo y los anteriores; dentro de las funciones se puede usar cualquier cosa. Lo que arranca la app va en `inicio.js`, el último.

| Archivo | Qué hace |
|---|---|
| `glifos.js` | Copiado de DandeBook: `GLYPHS`, contornos de Petaluma como trazados SVG, insertados como `<defs>`. |
| `datos.js` | `$`, `$$`, `esc`, `has`, `isObj`, `intIn`, `oneOf`, `say` (anuncios en `#sr`). `crearRng(semilla)` (azar reproducible: `int`, `pick`, `chance`, `shuffle`). `PROGRAMA` (los 9 temas), `NIVELES`. Guardado: `store = {set, prog}` en `localStorage` `dictado-armonico-v1`, con `cleanSet` / `cleanProg` que validan todo lo que se carga (`set.visto`, la bienvenida vista, solo se conserva si es `true`). `debeMostrarBienvenida(store, search)`. |
| `teoria.js` | Motor de teoría, **sin DOM**. Notas `{l, a, o}` (letra 0–6, alteración −2…+2, octava) con su ortografía: `nota('fa#')`, `nom`, `cif`, `midi`, `paso`. Intervalos: `intervalo`, `sumar`, `semisDe`, `invertir`, `explicaIntervalo`. Acordes: `TIPOS`, `acorde`, `cifrado`, `disponer` (estado y posición), `clasificar`. `bajoCifrado(notas, armadura)`. Tensiones: `TENS`, `notasEstructura` (apiladas en teoría, para las explicaciones), `cifradoEstructura` (`.arr` para el pentagrama), `vozEstructura` (disposición para escribir y sonar), `LIL`, `cumpleLIL`, `sinQuinta`. Tonalidades y escalas: `armaduraDe`, `tonicaDe`, `campoDiatonico`, `tritonoDe`, `ESCALAS`, `escala`. Grados: `acordeDeGrado`, `gradosDe`, `TENS_DISP`, `gradoAcademico`, `gradoPopular`. Funciones: `FUNCIONES`, `funcionesDe`. |
| `pentagrama.js` | `pentagrama(eventos, opt)` → SVG en clave de sol o, con `opt.gran`, en sistema de piano (sol y fa; lo que está por debajo del do central va en fa): notas y acordes apilados (segundas desplazadas, alteraciones en columnas), armadura, plicas, silencio de negra, ligaduras, cifrado encima (`arriba`: texto o `{t, sup}`, con superíndice; el ancho del texto cuenta para que no se corte), bajo cifrado debajo (`abajo`), notas marcadas (`marca`) y barras (`barra`). Sin estilos en línea. |
| `instrumentos.js` | Copiado de DandeBook: `tone(inst, midi, t, dur, vel, papel)`, instrumentos sintetizados, `makeReverb`. |
| `audio.js` | `ensureAudio`, `tocar(sec, alTerminar)`, `detener`. |
| `secuencias.js` | Secuencias de sonido `[{t, m:[midi], d, r, v}]`, **sin DOM**: `secIntervalo`, `secAcorde`, `secEscala`, `secProgresion`, `unir`; ayudas de escucha puras `ralentizar(sec, factor=1.5)` y `soloBajo(sec)` (solo los eventos `r:'bass'`). |
| `ejercicio.js` | Motor de ejercicios, **sin DOM**: `registrar`, `EJ`, `ejerciciosDe`; opciones (`op`, `campo`, `eleccion`, `campoNum`, `campoCal`, `campoLetra`, `campoAlt`); corrección (`corregir`, `completo`, `solucionHTML`); ayudas (`fundamentales(nivel)`, `intentar`, `vozAcorde`, `vocesProgresion`, `cadencia`). |
| `temas/t1.js` … `t9.js` | Los generadores de cada tema. `t2.js` tiene la fábrica `registrarAcordes(tema)` (tríadas y tétradas; `t3.js` solo la llama) y `t7.js` la fábrica `registrarGrados(tema, modo)` (`t8.js` solo la llama). |
| `resumen.js` | `RESUMEN[n]()` → HTML del resumen de cada tema, con ejemplos (`fig`) que suenan (`RES_SEC`). Las tablas de grados y tensiones salen de `teoria.js`. |
| `interfaz.js` | Estado `V`, rutas por hash (`#/`, `#/tema/N/resumen|teoria|oido`), `renderPortada`, `renderTema`, `renderPanel`, `chipsPct`, `nuevo`, `renderEj`, `comprobar`, `feedbackHTML`, `oir` (aplica `ajustar`: «Solo el bajo» y «Lento»), `elegir`, `bind` (clics, atajos de teclado), exportar e importar el progreso (`exportar`, `leerImport`). `anotar(id, bien, nivel)` guarda el total y el desglose por nivel. |
| `bienvenida.js` | La bienvenida: `iniciarBienvenida` (enlaza el `<dialog id="bienv">` de `index.html` y rellena niveles y sonidos), `abrirBienvenida`, `pasoBienvenida`. Estado en `B`. |
| `inicio.js` | Arranque (y, solo con http(s), enlaza el manifiesto y registra `sw.js`). Debe ser el último script. |

## Contrato de un ejercicio

```js
registrar({id:'t1-identificar', tema:1, modo:'teoria'|'oido', titulo, gen(R, nivel) {
  return { enunciado,            // html
    vista, vistaSol,             // partitura antes de responder / la que se revela al corregir
    sonar, sonarTras, sonarResp, // secuencia; true = solo se oye tras corregir; función(resp) → lo que el alumno respondió
    ref: {tonica, cadencia},     // opcional: secuencias de referencia con botón propio (ejercicios con cadencia; `refTonal` en t7.js)
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
- **Todas las distancias se miden en semitonos** (`semTxt`), en las correcciones y en el Resumen: lo pidió el usuario. `tonosTxt` ya no se usa en la app.
- **Acordes del tema 5** (lo pidió el usuario): en sistema de piano, con `vozEstructura`. La fundamental va sola en el bajo, entre mi2 y re♯3. Las demás notas van en posición cerrada en el registro central, desde fa3, y la disposición respeta los **LIL** (*low interval limits* de Berklee). La 13 o ♭13 **sustituye a la quinta justa** (`sinQuinta`), no suena junto a ella. En «Qué tensión suena» primero suena la cáscara (fundamental, tercera y séptima) y después la cáscara con la tensión encima. «Sus, add, sexta o séptima» incluye m, m6, 7, m7, 6sus4 y 6sus2.
- **Escalas del tema 6:** las soluciones se escriben con la armadura de su tonalidad (`{arm}`). La mayor sale con menos peso que las demás (`PESO_ESC`), porque el usuario oía demasiadas mayores.
- **Nivel:** un tema sin nivel elegido empieza en **avanzado** (`nivelDe`). El nivel se elige con tres botones (`.nivb`, `data-nivel`) bajo el título del tema, no con un desplegable. Lo pidió el usuario.
- **Tonalidades:** desde intermedio se sortean **las 13 habituales**, de 6 bemoles a 6 sostenidos (`ARM_MAX` en `t6.js`; nunca armaduras de 7). El básico se queda con pocas alteraciones: hasta 3 en el tema 6 (`topeArm`) y hasta 1 en los temas 7 a 9 (`tonNivel`). Lo pidió el usuario.
- **Ejercicios de oído con cadencia** (`oido-grado` y `oido-progresion` de los temas 7 y 8, `t9-oido`): tres botones, «Acorde de tónica», «Cadencia de referencia» y «Escuchar el ejercicio». El tercero toca **solo el ejercicio** (`sonar`: el acorde o la progresión, sin cadencia delante), para que lo que suena por defecto sea corto; la tónica y la cadencia salen de `ref` y se oyen solo si el alumno las pide. «Oír lo correcto» y «Oír lo que respondiste» tampoco llevan cadencia. Lo pidió el usuario; una prueba limita la duración de `sonar`.
- **«Tipo de tríada» al oído (tema 2)** (lo pidió el usuario): básico, mayor y menor en estado fundamental; intermedio, los cuatro tipos en estado fundamental; avanzado, los cuatro tipos, con las mayores y menores en estado fundamental, 1.ª o 2.ª inversión y las aumentadas y disminuidas siempre en estado fundamental. El enunciado de avanzado dice solo «puede estar invertida», para no dar pistas del tipo.
- **Repeticiones:** `nuevo()` descarta el ejercicio que coincide con alguno de los ocho últimos (`V.vistos`), salvo con `?semilla=`.
- **Dobles alteraciones** (`ejercicio.js`): `topeAlt(nivel)` es 1 en básico y 2 desde intermedio; `pideDoble(R, nivel)` hace que el avanzado busque una doble en el 35 % de los ejercicios (decidirlo fuera de `intentar()`, si no casi nunca sale); `sinDobles` las quita de los distractores del básico; `campoAlt(max)` añade ♯♯ y ♭♭ a los botones. Los ejercicios de oído no las usan. Las pruebas exigen 0 % en básico y al menos 4 % en avanzado.
- **Cifrado popular:** `C`, `Cm`, `Caug`, `Cº`; `Cmaj7`, `C7`, `Cmmaj7`, `Cm7`, `Caugmaj7`, `Caug7`, `Cm7(♭5)`, `Cº7`. Tensiones en superíndice, entre paréntesis si alguna no es mayor ni justa.
- **Calidad de intervalos:** `j`, `M`, `m`, `+`, `-` (5j, 3M, 4+, 5-).
- **Bajo cifrado:** abreviado; las notas con alteración distinta de la armadura llevan su signo junto a la cifra; la tercera alterada, si no es parte de la cifra, es el signo solo. En los apuntes hay algún ejemplo que escribe el 3 y otro que no; aquí la regla es siempre esa.
- **Grados:** en mayor la escala implícita es la mayor (`Ma` = mayor armónica); en menor, la armónica (`nat`, `mel`).
- **`TENS_DISP` y `FUNCIONES`** están transcritas a mano de las tablas de los temas 7, 8 y 9. Las tensiones del PDF están en imágenes pequeñas: si se duda de una, mirar el PDF (o `APUNTES.md` si no está).
- Las definiciones de `NFM` (tema 4) son las de los apuntes. «Nota de paso acentuada» y «grupo de notas de paso» no están definidas allí: aquí, acentuada = suena al articularse el acorde; grupo = dos notas de paso seguidas.

## Diseño y accesibilidad

- **Identidad visual** (lo pidió el usuario: «elegante y moderno»): papel pautado y lápiz bicolor. La cabecera es un pentagrama a todo lo ancho (`.pauta`, líneas con `repeating-linear-gradient`, `--sp` es el espacio) con la clave de sol de `GLYPHS` (`<use href="#g-gClef">`) y el título encima; las líneas se trazan una vez al cargar (sin animación con `prefers-reduced-motion`). Los temas se numeran en romanos (`ROMANOS` en `interfaz.js`, solo a la vista; el lector oye «Tema N») en un índice sin tarjetas. Azul (`--accent`) para elegir, rojo (`--bad`) para corregir; lo seleccionado va en tinta llena. Lo que suena va en píldora (`.btn.play`, `.btn.ref`), las acciones en rectángulo. Young Serif para títulos, numerales y pestañas; la mono solo para cifrados y teclas.
- **Color:** los tokens de `:root` usan `light-dark(claro, oscuro)` con `color-scheme: light dark` (y `data-theme` lo fija); un bloque `@supports not (color: light-dark(...))` repite los valores para navegadores anteriores a 2024. `accent-color` y `scrollbar-color` siguen la paleta. `@media (forced-colors: active)` marca lo pulsado, `.bien`/`.mal` y el pentagrama con colores del sistema.
- **Fuentes:** todas en `woff2`. `Atkinson respaldo` y `Young Serif respaldo` son `local()` con `size-adjust`/`*-override` medidos con fontTools, para que no salte la maquetación. No hay `<link rel="preload">`: con `file://` falla por CORS.
- Sin estilos en línea ni scripts en línea: la CSP de `index.html` es `default-src 'none'; script-src 'self'; style-src 'self'`. Las barras de progreso son `<progress>`, no anchos en `style`.
- Ninguna petición a otros sitios: todo, fuentes incluidas, va en el repositorio.
- Las opciones son botones con `aria-pressed`; al corregir se marcan `.bien` / `.mal` con texto oculto «correcta / incorrecta». El veredicto se anuncia con `say()` y el foco pasa a `#fb`.
- Atajos: `E` escuchar, `Intro` comprobar o siguiente. Pestañas con flechas.
- Zonas táctiles de 44 px como mínimo (los botones del pie son `.btn.sm`, de 36 px, como «Borrar el progreso»).
- **Dictados con cadencia** (`ref`): junto a los botones de escucha hay dos conmutadores con `aria-pressed`, «Lento» (×1,5 en `t` y `d`) y «Solo el bajo» (solo `r:'bass'`). Su estado vive en `V` (no se guarda), vale para todo lo que suena del ejercicio (referencias, «Oír lo correcto», «Oír lo que respondiste»), cambiarlo no repinta la tarjeta, detiene lo que suena y se anuncia con `say()`.
- **Atajos:** `E` escuchar el ejercicio, `T` acorde de tónica, `C` cadencia de referencia (si el ejercicio tiene esos botones), `1`–`9` eligen la opción N del campo con el foco o, sin foco en un campo, del primer campo de elección única sin responder (no hacen nada tras corregir), `Intro` comprobar o siguiente. Ninguno actúa con `ctrl`/`meta`/`alt`, en `SELECT`/`INPUT`/`TEXTAREA` ni en la pestaña Resumen.
- **Progreso por nivel:** `store.prog[id]` es `{n, ok, racha, mejor, niv?: {1|2|3: {n, ok}}}` (misma clave `dictado-armonico-v1`). `n`/`ok` son el total (lo guardado antes de `niv` sigue contando ahí); `niv` solo cuenta lo hecho desde que existe. La portada muestra el total del tema; el porcentaje de cada chip de tipo es el del **nivel elegido** y la pantalla lo dice («Porcentaje de aciertos en nivel …»). `cleanProg` valida `niv` (solo niveles 1 a 3, enteros, `ok ≤ n`).
- **Exportar e importar** (pie): «Exportar» descarga `dictado-armonico-AAAA-MM-DD.json` con `{app, v, set, prog}` (blob + `<a download>`); «Importar» lee un JSON con `FileReader`, lo pasa por `cleanSet`/`cleanProg` y pide confirmación en `#importarAsk` antes de sustituir lo guardado; si no es válido, lo dice en `#ioMsg` y con `say()`. No hace falta tocar la CSP para esto (la descarga y la lectura de un archivo elegido por el usuario no son peticiones de red); se comprobó con `file://` y con http.

- **Bienvenida** (`bienvenida.js`, marcado en `index.html`): `<dialog>` modal de cuatro pasos (qué es la app; cómo es un tema y nivel inicial; cómo se responde y atajos; sonido y progreso). Sale sola al arrancar solo si no hay `store.set.visto`, no hay progreso guardado y la URL no lleva `?semilla=` (`debeMostrarBienvenida`); «Cómo funciona», en el pie, la reabre. Al cerrarse de cualquier forma (Empezar, Omitir o `Esc`) guarda `visto: true`. El nivel solo se escribe si el alumno pulsa un botón de nivel y termina con «Empezar»: entonces se aplica a los nueve temas; sin pulsar, no se toca ningún nivel (al reabrir no se pisan los elegidos). El sonido se guarda al momento y sincroniza `#snd`. «Borrar el progreso» borra `prog` y marca `visto` (para que no salga sola con el progreso vacío); importar un archivo sin la marca la conserva. Con el diálogo abierto, los atajos globales de `bind()` no actúan (`$('dialog[open]')`); flechas izquierda y derecha cambian de paso. Al cambiar de paso, foco al título (`tabindex="-1"`, `aria-labelledby` del diálogo) y `say()`; mientras está abierto, `say()` escribe en `#bvSr`, la región de anuncios del propio diálogo (lo de fuera es inerte). `closedby="any"` lo cierra al pulsar fuera (con respaldo en JS donde no existe) y «Omitir» usa `requestClose()`. Al cerrar, el foco vuelve al botón que lo abrió o a `#app`.

## Instalable y sin conexión

- `manifest.webmanifest` (`start_url` y `scope` relativos, `display: standalone`, colores de la paleta) e iconos en `iconos/`: `icono.svg` y los PNG de 192, 512 y 180 px (este último, `apple-touch-icon.png`). Los PNG se generaron con una captura de Edge headless del SVG, sin dependencias.
- `sw.js` precarga la lista `ARCHIVOS` (HTML, CSS, manifiesto, iconos, fuentes y todos los JS) para que la app funcione sin conexión. Responde **primero desde la red** y guarda en la caché lo que llega bien; solo usa la caché sin conexión o si la red tarda más de 3 s (ignorando la cadena de consulta, para `?semilla=`). Lo pidió el usuario, para que nadie se quede con una versión vieja: cambiar un archivo no exige tocar `sw.js`. **Al añadir o quitar un archivo hay que actualizar `ARCHIVOS`** y conviene subir `VERSION`: una prueba de `estatico.test.mjs` compara la lista con los archivos reales.
- `inicio.js` registra el worker y añade el `<link rel="manifest">` **solo con http(s)**. Con `file://` no hace nada: Chromium rechaza el manifiesto de un archivo local con un error de CORS en la consola, por eso el enlace no está en `index.html`.
- La CSP añade `manifest-src 'self'; worker-src 'self'` (con `default-src 'none'` harían falta). Nada más.

## Versiones (releases)

- **Regla: las versiones siguen [Semantic Versioning 2.0.0](https://semver.org/lang/es/)** (lo pidió el usuario). La etiqueta es `v` + `MAYOR.MENOR.PARCHE`, sin ceros a la izquierda, con identificadores preliminares (`-beta.1`) y metadatos (`+20261118`) opcionales. Se sube el **PARCHE** con arreglos que no cambian el uso (una explicación corregida); el **MENOR** con algo nuevo compatible (un tipo de ejercicio, una ayuda); el **MAYOR** con un cambio incompatible, como un formato de progreso guardado o exportado que las versiones anteriores ya no lean (cambiar la clave `dictado-armonico-v1` o el `v` del JSON exportado). Mientras la versión empiece por `0.`, cualquier cosa puede cambiar. Cada versión nueva tiene que tener **más precedencia** que todas las anteriores (§11).
- `.github/semver.mjs` lo comprueba (la expresión regular oficial de semver.org y la precedencia del §11, sin dependencias); `tests/semver.test.mjs` lo prueba con los ejemplos de la especificación.
- `.github/workflows/release.yml`: al subir una etiqueta `v*` (`git tag -a v1.2.0 -m …` y `git push origin v1.2.0`) primero valida la versión con `semver.mjs` contra las etiquetas existentes (si no cumple, falla y no publica nada: hay que borrar la etiqueta con `git push origin --delete v…`), luego pasa las pruebas, arma `dictado-armonico-vX.Y.Z.zip` con lo que necesita la app (`index.html`, `styles.css`, `manifest.webmanifest`, `sw.js`, `js/`, `fonts/`, `iconos/`, `LICENSE`, `README.md`) y crea la release con notas generadas. Una versión con identificador preliminar sale como versión preliminar (un guion en los metadatos, `+build-1`, no cuenta). **Si se añade una carpeta o un archivo de nivel superior a la app, hay que añadirlo también al `cp` del flujo.**

## Pruebas

`npm test` (Node 18 o posterior, sin dependencias) ejecuta `tests/*.test.mjs`:

- `teoria.test.mjs`: el motor contra los ejemplos de los apuntes (intervalos, cifrados, bajo cifrado, tablas de grados, funciones).
- `generadores.test.mjs`: cada generador en los tres niveles con muchas semillas (`SEMILLAS=1000 npm test` para más): solución entre las opciones, corrección, explicación sin datos rotos, partitura y sonido válidos.
- `estatico.test.mjs`: CSP, nada en línea, ninguna dirección externa, validación de lo guardado (incluidos `niv` y `visto`), cuándo sale la bienvenida, y que `sw.js` lista exactamente los archivos de la app, el manifiesto y los iconos.
- `secuencias.test.mjs`: `ralentizar` y `soloBajo`.
- `semver.test.mjs`: la regla de versiones de las releases (`.github/semver.mjs`).

`tests/lib.mjs` carga los scripts sin DOM en un contexto de `vm`. **No hay pruebas en navegador**: la interfaz se comprueba a mano.
