# Apuntes del curso: guía de referencia

Resumen de los apuntes del curso de armonía (Agustín Pardo y Alejandro Barbot, 2025), hecho a partir de los PDF de `Temas/` (`A1 - tema N.pdf`) y de `Programa del curso.txt`. Esos archivos **no están en el repositorio** (`.gitignore`). Esta guía los sustituye para trabajar sin ellos, por ejemplo en una sesión de Claude en la nube.

**Lo que no está aquí:** las partituras de los ejemplos (fragmentos de Bach, Pergolesi, Chopin, canciones populares). Se citan con su análisis cuando lo tienen. Las tablas de tensiones de los temas 7 y 8 están en imágenes pequeñas de los PDF: si se duda de una, mirar el PDF original. Las decisiones que la app toma donde los apuntes no dicen nada o se contradicen están en `CLAUDE.md`, en «Decisiones del curso».

Notación de esta guía: cifrado popular del curso (`C`, `Cm`, `Caug`, `Cº`, `Cmaj7`, `C7`…). Calidad de intervalos: `j` justo, `M` mayor, `m` menor, `+` aumentado, `-` disminuido.

---

## Programa del curso

**Objetivos generales:** aumentar los conocimientos teóricos, las capacidades analíticas y el desarrollo musical del estudiante, y ayudarlo a tener una visión lúcida del fenómeno musical.

**Objetivos específicos:** que el estudiante tenga una visión global de la armonía que le permita analizar armónicamente músicas académicas y populares; que reconozca **de oído** los procesos y situaciones armónicas básicas de la música tonal; y que reconozca el funcionamiento del sistema tonal en sus distintos niveles estructurales.

| Tema | Contenidos |
|---|---|
| 1. Intervalos | Justos, mayores, menores, disminuidos y aumentados: descripción y método de cálculo. Compuestos. Complementarios. |
| 2. Tríadas | Mayores, menores, disminuidas, aumentadas. Estado y posición. Cifrado popular (fundamental e invertidas). Bajo cifrado. |
| 3. Tétradas | Tipos. Estado fundamental e inversiones. Cifrado popular. Bajo cifrado. |
| 4. Notas con función melódica | Nota de paso (acentuada, cromática, grupos). Bordadura (cromática, doble). Suspensión. Apoyatura y escapada. Doble bordadura incompleta y cambiata. Anticipación. |
| 5. Tensiones | Concepto y cifrado. 9 mayor y menor; 11 justa y aumentada; 13 mayor y menor. Sexta en lugar de séptima. Novenas agregadas. sus4 y sus2. |
| 6. Campo diatónico y escalas | Campo diatónico. Tritono y semitonos característicos. Escalas mayor y mayor armónica. Menor natural, armónica y melódica. |
| 7. Grados en mayor | Tríadas, tétradas y tensiones sobre la escala mayor y la mayor armónica. Nomenclatura académica y popular. |
| 8. Grados en menor | Tríadas, tétradas y tensiones sobre la menor armónica, natural y melódica. |
| 9. Funciones armónicas | Tónica, dominante (y resolución del tritono) y subdominante, con los grados que las representan en mayor y en menor. |

---

## Tema 1: intervalos

Un **intervalo** es la distancia entre dos alturas. Es **armónico** si las dos notas suenan juntas y **melódico** si suenan una después de la otra. Se nombra por la cantidad de notas de la escala diatónica que abarca, **contando las dos de los extremos**: de do a re hay una segunda ascendente; de do a si (abajo), una segunda descendente; de do a mi, una tercera ascendente; de do a la (abajo), una tercera descendente.

La **calidad** (justo, mayor, menor, aumentado, disminuido) depende de cuántos tonos y semitonos contiene. Por ejemplo, de segunda: do–re♭ 2m, do–re 2M, do–re♯ 2+, do♯–re♭ 2-.

Es **simple** si cabe en la octava y **compuesto** si la supera.

### Cómo calcularlos (método de los apuntes)

**Justos** (unísono, cuarta, quinta, octava):
- Unísonos y octavas: justos si las dos notas tienen la misma alteración (do♯–do♯, mi♭–mi♭, sol–sol).
- Cuartas y quintas: justas si las dos notas tienen la misma alteración, **salvo el par si–fa**.
  - 5j ascendentes: re–la, mi♭–si♭, fa♯–do♯, si♭–fa, si–fa♯.
  - 4j ascendentes: la–re, si♭–mi♭, do♯–fa♯, fa–si♭, fa♯–si.

**Mayores y menores:**
- **Segundas**, a partir del unísono justo: 2M = un tono más; 2m = un semitono más.
  - 2M: mi–fa♯, si♭–do, la–si. 2m: mi–fa, si♭–do♭, la–si♭.
- **Terceras**, a partir del unísono justo: 3M = dos tonos; 3m = tono y medio.
  - 3M: fa♯–la♯, sol–si, la♭–do. 3m: fa♯–la, sol–si♭, la♭–do♭.
- **Sextas**, a partir de la quinta justa: 6M = 5j + un tono; 6m = 5j + un semitono.
  - 6M: si–sol♯, la–fa♯, re♭–si♭. 6m: si–sol, la–fa, re♭–si♭♭.
- **Séptimas**, a partir de la octava justa: 7M = 8j − un semitono; 7m = 8j − un tono.
  - 7M: re–do♯, la♭–sol, fa♯–mi♯. 7m: re–do, la♭–sol♭, fa♯–mi.

> La app no usa este atajo (sextas desde la 5j, séptimas desde la 8j) en las correcciones: explica en dos pasos, número y luego semitonos. Ver `CLAUDE.md`.

**Disminuidos:**
- 8-, 5- y 4-: un semitono menos que el justo.
  - 8-: re–re♭, sol♯–sol, mi♭–mi♭♭. 5-: mi–si♭, re♯–la, si–fa. 4-: re–sol♭, fa–si♭♭, la♯–re.
- 2-, 3-, 6- y 7-: un semitono menos que el menor.
  - 2-: re–mi♭♭, fa♯–sol♭, si–do♭. 3-: fa–la♭♭, mi–sol♭, do♯–mi♭.
  - 6-: sol–mi♭♭, re♯–si♭, mi–do♭. 7-: sol♯–fa, do♯–si♭, re–do♭.
- El unísono disminuido no existe en la práctica.

**Aumentados:**
- 1+, 8+, 5+ y 4+: un semitono más que el justo.
  - 1+: re–re♯, sol♭–sol, fa–fa♯. 8+: mi–mi♯, re♭–re, sol–sol♯.
  - 5+: re–la♯, si♭–fa♯, la♭–mi. 4+: fa–si, sol–do♯, mi♭–la.
- 2+, 3+, 6+ y 7+: un semitono más que el mayor.
  - 2+: re–mi♯, si♭–do♯, fa–sol♯. 3+: fa–la♯, re♭–fa♯, la♭–do♯.
  - 6+: la♭–fa♯, si♭–sol♯, mi♭–do♯. 7+: re♭–do♯, si♭–la♯, fa–mi♯.

### Tabla de semitonos (referencia)

| Intervalo | 1j | 2m | 2M | 3m | 3M | 4j | 4+ / 5- | 5j | 6m | 6M | 7m | 7M | 8j |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Semitonos | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |

### Compuestos

Superan la octava; cada uno es un intervalo simple más una octava y conserva su calidad: novena = 2ª + 8ª, décima = 3ª + 8ª, oncena = 4ª + 8ª, duodécima = 5ª + 8ª, trecena = 6ª + 8ª, decimocuarta = 7ª + 8ª. La **novena, la oncena y la trecena** son los que «cambian de identidad» respecto del simple (son los que se usan como tensiones, tema 5).

### Complementarios (inversión)

Un intervalo y su inversión suman una octava, y sus números suman **nueve**: 2ª ↔ 7ª, 3ª ↔ 6ª, 4ª ↔ 5ª, 1ª ↔ 8ª. La calidad se invierte así: mayor ↔ menor, justo ↔ justo, aumentado ↔ disminuido. Ejemplo: la inversión de una 3M es una 6m.

*Bibliografía:* Jaffe, *Jazz Harmony* (3.ª ed., 2015) pp. 9-10; Grove, «Intervals»; Mitchell, *Elementary Harmony* (1965) pp. 29-34; Schenker, *Harmony* (1968) p. 130; Wedge, *Applied Harmony* 1 (1930) pp. 7-10; Zamacois, *Tratado de armonía* I (1978) pp. 17-19.

---

## Tema 2: tríadas

Las notas que suenan juntas pueden ser parte de un acorde, notas con función melódica o tensiones. El curso usa dos estructuras básicas: **tríadas** (tres notas por terceras superpuestas desde una fundamental) y **tétradas** (cuatro notas).

### Tipos

| Tríada | Terceras (de abajo arriba) | Fundamental–quinta | Cifrado (en do) | Notas |
|---|---|---|---|---|
| Mayor | 3M + 3m | 5j | `C` | do mi sol |
| Menor | 3m + 3M | 5j | `Cm` | do mi♭ sol |
| Aumentada | 3M + 3M | 5+ | `Caug` | do mi sol♯ |
| Disminuida | 3m + 3m | 5- | `Cº` | do mi♭ sol♭ |

### Estado y posición

- **Estado** = qué nota del acorde está en el **bajo**: estado fundamental (fundamental), primera inversión (tercera), segunda inversión (quinta).
- **Posición** = qué nota está en la **voz superior**: posición de octava (fundamental), de tercera (tercera), de quinta (quinta).
- Una tríada no cambia de identidad aunque sus notas se dupliquen, se repartan de otra manera o estén en otros registros. Puede tocarse en bloque (*plaqué*) o arpegiada. Ejemplo de los apuntes: sol♯º en primera inversión.

### Cifrado popular

Letras: A la, B si, C do, D re, E mi, F fa, G sol. Tríadas en estado fundamental: `C`, `Cm`, `Caug`, `Cº`. Las inversiones añaden una barra y la nota del bajo: `Cm`, `Cm/E♭` (1.ª inv.), `Cm/G` (2.ª inv.). El cifrado popular indica el tipo y el estado, **no** la posición ni el *voicing*.

### Bajo cifrado

Se escribe la nota del bajo y debajo los números de los intervalos que se forman hacia arriba desde ella. Solo indica el estado; el acorde concreto se deduce con la armadura.

| Estado | Completo | Abreviado |
|---|---|---|
| Fundamental | 5/3 | (nada) |
| 1.ª inversión | 6/3 | 6 |
| 2.ª inversión | 6/4 | 6/4 |

Ejemplos en re mayor (dos sostenidos): `Bm/D` = 6; `G` = nada; `F♯m/C♯` = 6/4; `C♯º/E` = 6; `D/F♯` = 6; `D` = nada; `D/A` = 6/4.

**Alteraciones distintas de la armadura:** se escribe la alteración junto a la cifra correspondiente. Si lo alterado es la **tercera** sobre el bajo, se escribe el signo solo (el 3 se sobrentiende).

Ejemplos en sol mayor (un sostenido):

| Acorde | Bajo | Cifra |
|---|---|---|
| `B/F♯` | fa♯ | ♯6 / 4 |
| `E` | mi | ♯ |
| `Aaug` | la | ♯5 / ♯ |
| `Gm/D` | re | ♭6 / 4 |
| `B♯º/F♯` | fa♯ | ♯6 / ♯4 |
| `C♯m` | do♯ | ♯5 |
| `E/B` | si | ♯6 / 4 |

*Bibliografía:* Jaffe (2015) pp. 11-14; Korsakov, *Tratado práctico de armonía* (2004) pp. 19-21; Mitchell (1965) pp. 47-51; Schenker (1968) pp. 182-187; Wedge (1930) pp. 11-13; Zamacois I pp. 28-37.

---

## Tema 3: tétradas

Tres terceras superpuestas: fundamental, tercera, quinta y séptima. Pueden estar en estado fundamental o en tres inversiones (con la 3.ª, la 5.ª o la 7.ª en el bajo). Se piensan como **una tríada más una séptima**: a cada tríada se le suma una séptima mayor o menor; a la disminuida no se le suele poner séptima mayor, pero sí **séptima disminuida**. Como las tríadas, no cambian de identidad por duplicar notas, cambiar la disposición o el registro.

### Tipos y cifrado popular

`maj7` = séptima mayor; `7` = séptima menor. Las que salen de la tríada disminuida tienen cifrados propios.

| Tríada + séptima | Cifrado (en do) | Notas |
|---|---|---|
| Mayor + 7M | `Cmaj7` | do mi sol si |
| Mayor + 7m | `C7` | do mi sol si♭ |
| Menor + 7M | `Cmmaj7` | do mi♭ sol si |
| Menor + 7m | `Cm7` | do mi♭ sol si♭ |
| Aumentada + 7M | `Caugmaj7` | do mi sol♯ si |
| Aumentada + 7m | `Caug7` | do mi sol♯ si♭ |
| Disminuida + 7m | `Cm7(♭5)` | do mi♭ sol♭ si♭ |
| Disminuida + 7- | `Cº7` | do mi♭ sol♭ si♭♭ |

Inversiones: barra y nota del bajo. Ejemplos de los apuntes: `Fm7/A♭`, `E♭7/D♭`, `Baug7/D♯`, `Fm7(♭5)/C♭`, `E♯º7/B`, `Fmaj7/C`, `Gmaj7/B`, `Gaug7/F`, `Bm7(♭5)/F`, `Dmaj7/C♯`.

### Bajo cifrado

| Estado | Completo | Abreviado |
|---|---|---|
| Fundamental | 7/5/3 | 7 |
| 1.ª inversión | 6/5/3 | 6/5 |
| 2.ª inversión | 6/4/3 | 4/3 |
| 3.ª inversión | 6/4/2 | 2 |

Las notas con alteración distinta de la armadura llevan el signo junto a su cifra. Ejemplos de los apuntes (cifra de arriba abajo):

| Armadura | Acorde | Cifra |
|---|---|---|
| fa mayor (1♭) | `F♯º7/C` | 6 / ♯4 / ♭ |
| fa mayor | `D♭augmaj7/A` | ♭4 / 3 |
| fa mayor | `A7/E` | ♯6 / 4 / 3 |
| fa mayor | `Gmmaj7` | ♯7 |
| fa mayor | `B♭m7/F` | ♭6 / 4 / ♭3 |
| la mayor (3♯) | `C♯m7(♭5)/E` | 6 / 5 / ♮ |
| la mayor | `Dmmaj7/F` | 6 / 5 |
| la mayor | `A♭maj7/E♭` | ♮6 / ♭4 / ♮3 |
| la mayor | `B7/A` | ♯4 / 2 |
| la mayor | `Fmaj7` | 7 / ♮5 |

> En los apuntes hay ejemplos que escriben el 3 alterado y otros que no. La app sigue siempre la regla del tema 2 (el signo solo). Ver `CLAUDE.md`.

*Bibliografía:* DeGreg, *Jazz Keyboard Harmony* (1995) pp. 3-5; Korsakov (2004) pp. 21-22; Nettles y Graf, *The Chord Scale Theory & Jazz Harmony* (2015) pp. 20-24; Mitchell (1965) pp. 164-168; Schenker (1968) pp. 188-189; Wedge (1930) p. 109; Zamacois II pp. 17-23.

---

## Tema 4: notas con función melódica

Notas que **no pertenecen al acorde** y se relacionan con las notas del acorde de distintas maneras.

| Nota | Definición de los apuntes |
|---|---|
| **Nota de paso** | Une dos notas del acorde por grado conjunto. Variantes: **acentuada**, **cromática** y **grupo de notas de paso**. |
| **Bordadura** | Adorna por grado conjunto una nota del acorde (sale y vuelve a ella). Superior o inferior; **cromática** (superior o inferior); **doble bordadura** (la superior y la inferior seguidas). |
| **Suspensión** | Pertenece al acorde anterior y se mantiene en la misma voz cuando entra el nuevo acorde, al que no pertenece. Resuelve por grado conjunto **descendente** (ascendente si es la sensible). Entre la suspensión y la resolución puede haber una o varias notas de **decoración**. |
| **Apoyatura** | Se llega a ella por **salto ascendente** y resuelve por **grado conjunto descendente** en una nota del acorde. Puede ser no acentuada. |
| **Escapada** | Se llega a ella por **grado conjunto ascendente** y resuelve por **salto descendente** en una nota del acorde. |
| **Doble bordadura incompleta** | Una doble bordadura sin su primera nota. |
| **Cambiata** | Nota ajena al acorde a la que se llega por grado conjunto; salta una tercera en la misma dirección hasta una nota del acorde y luego se mueve por grado conjunto en sentido contrario. |
| **Anticipación** | Nota del acorde siguiente que se ataca antes de que llegue ese acorde. |

> «Nota de paso acentuada» y «grupo de notas de paso» aparecen en los ejemplos pero no se definen. En la app: acentuada = suena cuando se articula el acorde; grupo = dos notas de paso seguidas.

**Ejemplos de los apuntes** (partituras en el PDF): Bach, *Herzliebster Jesu* (notas de paso y nota de paso acentuada; Gm Cm7 Cm/E♭ D D7/C Gm/B♭ F♯º/A Gm); Rubén Lena, *A don José* (nota de paso y grupo de notas de paso con la segunda cromática; Cm Fm Cm); Michael Jackson, *Black or White* (bordadura y notas de paso acentuadas sobre E; nota: Esus4 E Esus2 E, tema 5); Bach, *Invención n.º 6* (bordaduras y bordaduras cromáticas; G♯m D♯ D♯7/C♯); Bach, *Sinfonía n.º 12* (doble bordadura; A G♯º F♯m A/C♯); Pergolesi, *Stabat Mater* (suspensiones; Fm C Fm E♭ A♭ B♭m C F7 B♭m C Fm Bº7 C); Darnauchans, *Final* (apoyaturas; F B♭/F B♭/D Gm7 C F C F C); Chopin, *Preludio op. 28 n.º 10* (escapada; C♯m F♯m C♯m G♯ G♯7 C♯m); Palestrina, *Adjuro vos filiae Jerusalem* (cambiata; Em G); Bach, *Invención n.º 1* (anticipación; G G/B C D Em F♯º G C/E G/B C G/D D G).

*Bibliografía:* Kennan, *Counterpoint* (1999) pp. 39-45; Mitchell (1965) pp. 136-163; Schoenberg, *Tratado de armonía* (1972) pp. 395-410; Zamacois III pp. 110-283.

---

## Tema 5: tensiones

Lo que pasa de la tétrada son **tensiones** añadidas. En el cifrado, todo número mayor que 8 es una tensión y se escribe después de la tétrada, en **superíndice**.

- El número solo indica el intervalo **mayor o justo** (9 = 9M, 11 = 11j, 13 = 13M).
- **♯** = un semitono más que el mayor o justo; **♭** = un semitono menos (♭9, ♯9, ♯11, ♭13).
- Si alguna tensión **no** es mayor ni justa, todas van **entre paréntesis**: `C7⁹`, `C7⁽♭⁹⁾`, `Cmaj7⁽⁹ ♯¹¹ ¹³⁾`.

| Tensión | Intervalo sobre la fundamental | Semitonos (desde la fundamental, sin octava) |
|---|---|---|
| ♭9 | 9m | 1 |
| 9 | 9M | 2 |
| ♯9 | 9+ | 3 |
| 11 | 11j | 5 |
| ♯11 | 11+ | 6 |
| ♭13 | 13m | 8 |
| 13 | 13M | 9 |

**Sexta en lugar de séptima.** Si la séptima se reemplaza por una **sexta mayor**, se cifra `6` (no hay otra sexta posible): `C6` = do mi sol la. Se considera una tétrada completa y admite tensiones igual que las de séptima: `C6⁽⁹ ♯¹¹⁾`.

**add.** Si no hay ni séptima ni sexta pero sí tensiones, se cifra con `add`: `Cadd9` = do mi sol re.

**sus4 y sus2.** La tercera puede reemplazarse por una **cuarta justa** o una **segunda mayor** (armonía por cuartas o notas con función melódica): `Csus4` = do fa sol; `Csus2` = do re sol. En las tétradas, primero va la tétrada y después el `sus`: `C7sus4` (do fa sol si♭), `Cmaj7sus2` (do re sol si), `C6sus4` (do fa sol la). Las tensiones van al final, en superíndice: `C7sus4⁹`.

**Resumen del cifrado:**

```
            Estructura          ||      Tensiones
   F      3        5      7     ||    9     11     13
        sus2  sus4        6     ||         add
        (2M)  (4J)       (6M)   ||  (si no hay 7 ni 6M)
```

> Decisiones de la app para el tema 5 (sistema de piano, LIL, la 13 en lugar de la 5j, etc.): ver `CLAUDE.md`.

*Bibliografía:* DeGreg (1995) pp. 4-5; Chediak, *Diccionario de acordes cifrados* (1984) pp. 56-109; Nettles y Graf (2015) pp. 22-24; Jaffe, *Jazz Harmony* (2.ª ed., 1996) pp. 11-12.

---

## Tema 6: campo diatónico y escalas

### Campo diatónico

Siete notas que se obtienen sumando **quintas justas** seguidas desde una nota. Desde fa sale el campo sin alteraciones:

```
FA  DO  SOL  RE  LA  MI  SI
```

Desde otras notas salen campos con sostenidos o bemoles (12 campos, ordenados por el círculo de quintas). El sistema tonal tiene dos centros posibles en cada campo: el **mayor** (do, 2.ª nota de la cadena) y el **menor** (la, 5.ª nota).

- **Tritono:** entre los extremos de la cadena (fa–si).
- **Semitonos característicos:** entre la 1.ª y la 6.ª nota de la cadena (fa–mi) y entre la 2.ª y la 7.ª (si–do).
  - El del **modo menor** va **hacia abajo, a la quinta** de la tónica menor (fa → mi en la menor).
  - El del **modo mayor** va **hacia arriba, a la fundamental** de la tónica mayor (si → do en do mayor).
- Los campos se **deforman** para conseguir el semitono que les falta: la menor sube el sol a **sol♯** (sensible → la); do mayor baja el la a **la♭** (la♭ → sol). Con do como tónica menor (campo de tres bemoles) se sube el si♭ a **si♮**.

De la tonicidad de los campos naturales y de estas deformaciones salen las escalas del sistema tonal.

### Escalas mayores

| Escala | Origen | Estructura (T tono, S semitono, T½ = 3 semitonos) | En do |
|---|---|---|---|
| Mayor | Campo natural | T T S T T T S | do re mi fa sol la si |
| Mayor armónica | Campo deformado (semitono del modo menor: 6.º grado bajado) | T T S T S T½ S | do re mi fa sol la♭ si |

Ejemplos de los apuntes: sol, re, la, fa y si♭ mayor y mayor armónica (la armónica se escribe con la armadura de la mayor y el 6.º grado alterado: mi♭ en sol, si♭ en re, fa♮ en la, re♭ en fa, sol♭ en si♭).

**Círculo de quintas (mayores):** C, G (1♯), D (2♯), A (3♯), E (4♯), B (5♯), F♯ (6♯) = G♭ (6♭), D♭ (5♭), A♭ (4♭), E♭ (3♭), B♭ (2♭), F (1♭).

### Escalas menores

| Escala | Origen | Estructura | En do menor |
|---|---|---|---|
| Menor natural | Campo natural | T S T T S T T | do re mi♭ fa sol la♭ si♭ |
| Menor armónica | Campo deformado (semitono del modo mayor: 7.º grado subido, la sensible) | T S T T S T½ S | do re mi♭ fa sol la♭ si |
| Menor melódica | Para subir por grado conjunto sin la segunda aumentada | T S T T T T S | do re mi♭ fa sol la si |

Ejemplos de los apuntes: mi, si, re y sol menor en sus tres formas.

**Círculo de quintas (menores):** Am, Em (1♯), Bm (2♯), F♯m (3♯), C♯m (4♯), G♯m (5♯), D♯m (6♯) = E♭m (6♭), B♭m (5♭), Fm (4♭), Cm (3♭), Gm (2♭), Dm (1♭).

*Bibliografía:* Harrison, *Harmonic Function in Chromatic Music* (2010) pp. 23-33; Korsakov (2005) p. 23; Mitchell (1965) pp. 5-16; Wedge (1930) pp. 1-2; Zamacois I pp. 25-27, 176; Zamacois II pp. 156-160.

---

## Tema 7: acordes sobre los grados de la tonalidad mayor

Sobre cada grado se construyen tríadas, tétradas y tensiones con las notas de la escala; cada grado tiene así un tipo de acorde. La tonalidad mayor la forman la **escala mayor** (de uso general) y la **mayor armónica** (su uso depende de la época y el estilo).

### Tríadas

| Grado | I | II | III | IV | V | VI | VII |
|---|---|---|---|---|---|---|---|
| Mayor | M (`C`) | m (`Dm`) | m (`Em`) | M (`F`) | M (`G`) | m (`Am`) | º (`Bº`) |
| Mayor armónica | M (`C`) | º (`Dº`) | m (`Em`) | m (`Fm`) | M (`G`) | aug (`A♭aug`) | º (`Bº`) |

### Tétradas

En los apuntes, la fila «genérica» escribe `M7` para la tríada mayor con séptima menor (aquí `7`).

| Grado | I | II | III | IV | V | VI | VII |
|---|---|---|---|---|---|---|---|
| Mayor | `Cmaj7` | `Dm7` | `Em7` | `Fmaj7` | `G7` | `Am7` | `Bm7(♭5)` |
| Mayor armónica | `Cmaj7` | `Dm7(♭5)` | `Em7` | `Fmmaj7` | `G7` | `A♭augmaj7` | `Bº7` |

### Tensiones disponibles

Las que se pueden añadir sin desdibujar la identidad del acorde (sistematización de la práctica, sobre todo jazzística). «(6)» = se puede usar la sexta mayor en lugar de la séptima.

| Grado | Escala mayor | Escala mayor armónica |
|---|---|---|
| I | `maj7` 9, 13 (6) | `maj7` 9 |
| II | `m7` 9, 11 | `m7(♭5)` 9, 11 |
| III | `m7` 11 | `m7` (ninguna) |
| IV | `maj7` 9, ♯11, 13 (6) | `mmaj7` 9, ♯11 (6) |
| V | `7` 9, 13 (6) | `7` ♭9, 13 (6) |
| VI | `m7` 9, 11 | `augmaj7` ♯9, ♯11 |
| VII | `m7(♭5)` 11, ♭13 | `º7` 11, ♭13 |

### Nomenclatura de grados en música académica

Número romano + cifra abreviada del bajo cifrado:

- Tríadas: `I` (fundamental), `I6` (1.ª inversión), `I6/4` (2.ª inversión).
- Tétradas: `V7` (fundamental), `V6/5` (1.ª), `V4/3` (2.ª), `V2` (3.ª).

Igual para todos los grados.

### Nomenclatura de grados en músicas populares

Número romano; si el acorde está invertido, barra y la parte del acorde que está en el bajo. En do mayor: `C/E` = `I/3ª`; `F` = `IV`; `G7/B` = `V/3ª`.

### Mayor o mayor armónica

La escala implícita es la **mayor**. Los grados de la mayor armónica llevan **Ma**: `VIMa` = sexto grado de la mayor armónica.

**Ejemplos de los apuntes:** Bach, *Preludio en do mayor BWV 846* (C I, Dm7/C II2, G7/B V6/5, C I, Am/C VI6); *Can't Help Falling in Love* (en re: D I, F♯m III, Bm VI, Bm7/A VI/7ª, G IV, D/F♯ I/3ª, A/E V/5ª…; el `I/5ª` antes del V es la **sexta y cuarta cadencial**, que ya funciona como V); Sting, *Seven Days* (en do: F IV, G V, E/G♯, Am7 VI, Fmmaj7 IVMa, Am7¹¹ VI, Fm6 IVMa, C I).

*Bibliografía:* DeGreg (1995) p. 5; Jaffe (1996) p. 19; Korsakov (2005) pp. 23-25; Nettles y Graf (2015) p. 32; Zamacois I pp. 32-33; Zamacois II p. 19.

---

## Tema 8: acordes sobre los grados de la tonalidad menor

La tonalidad menor la forman la **menor armónica**, la **natural** y la **melódica**, combinadas de distintas maneras según la época y el estilo. La de referencia es la **armónica**: el grado sin indicación es de la armónica; `nat` = natural; `mel` = melódica. Ejemplos: `V7` = quinto grado con séptima de la armónica; `IImel` = segundo grado de la melódica (tríada); `VIInat` = séptimo grado de la natural (tríada).

### Tríadas (en do menor)

| Grado | I | II | III | IV | V | VI | VII |
|---|---|---|---|---|---|---|---|
| Natural | `Cm` | `Dº` | `E♭` | `Fm` | `Gm` | `A♭` | `B♭` |
| Armónica | `Cm` | `Dº` | `E♭aug` | `Fm` | `G` | `A♭` | `Bº` |
| Melódica | `Cm` | `Dm` | `E♭aug` | `F` | `G` | `Aº` | `Bº` |

### Tétradas (en do menor)

| Grado | I | II | III | IV | V | VI | VII |
|---|---|---|---|---|---|---|---|
| Natural | `Cm7` | `Dm7(♭5)` | `E♭maj7` | `Fm7` | `Gm7` | `A♭maj7` | `B♭7` |
| Armónica | `Cmmaj7` | `Dm7(♭5)` | `E♭augmaj7` | `Fm7` | `G7` | `A♭maj7` | `Bº7` |
| Melódica | `Cmmaj7` | `Dm7` | `E♭augmaj7` | `F7` | `G7` | `Am7(♭5)` | `Bm7(♭5)` |

### Tensiones disponibles

| Grado | Natural | Armónica | Melódica |
|---|---|---|---|
| I | `m7` 9, 11 | `mmaj7` 9, 11 | `mmaj7` 9, 11 (6) |
| II | `m7(♭5)` 11, ♭13 | `m7(♭5)` 11, 13 (6) | `m7` 11 |
| III | `maj7` 9, 13 (6) | `augmaj7` 9 | `augmaj7` 9, ♯11 |
| IV | `m7` 9, 11 | `m7` 9, ♯11 | `7` 9, ♯11, 13 (6) |
| V | `m7` 11 | `7` ♭9, ♭13 | `7` 9, ♭13 |
| VI | `maj7` 9, ♯11, 13 (6) | `maj7` ♯9, ♯11, 13 (6) | `m7(♭5)` 9, 11, ♭13 |
| VII | `7` 9, 13 (6) | `º7` ♭13 | `m7(♭5)` ♭13 |

**Ejemplos de los apuntes:** Couperin, *La reine des cœurs* (en mi menor; I, IIInat6/4, IV, V, VImel6/4, VII6, Vnat6, VI7, II6/4, V7…); Samantha Navarro, *No quiero hablar de esas cosas* (en re menor: A7⁽♭¹³⁾ V, Dm7 Inat, Gm7 IV, Gm7¹³, A7⁽♯⁹⁾ — ese ♯9 es la décima menor de la natural usada como tensión sobre el V de la armónica —, Gm7⁽♯¹¹⁾); Ángela Alves, *Agua dulce* (en sol menor: Gm I, Am7(♭5) II, D7 V, E♭maj7 VI, Cm7 IV, F VIInat, Dm7 Vnat).

*Bibliografía:* DeGreg (1995) p. 5; Jaffe (1996) p. 19; Korsakov (2005) pp. 23-25; Nettles y Graf (2015) pp. 85-89; Zamacois I pp. 176-185; Zamacois II pp. 20-22.

---

## Tema 9: funciones armónicas

La **función armónica** es el papel que cumple el acorde de un grado respecto del centro tonal. Hay tres: **tónica (T)**, **dominante (D)** y **subdominante (S)**.

### Tónica

Reposo, punto de partida y de llegada. La representa sobre todo el acorde del I. Para que otro acorde la represente, su tríada debe tener **dos notas en común** con la del I (condición necesaria pero no suficiente: depende del contexto).

### Dominante

Una tensión que se resuelve yendo a la tónica. Sus acordes contienen la **sensible** (el 7.º grado cuando está un semitono por debajo de la tónica: escalas mayor, mayor armónica, menor armónica y melódica). La sensible resuelve en la tónica. La sensible y el 4.º grado forman un **tritono**: si es una **5-**, resuelve **cerrándose**; si es una **4+**, resuelve **abriéndose**. Los grados con función de dominante tienen la sensible en su tríada.

### Subdominante

Tradicionalmente, la función que se «aleja» de la tónica; puede ir hacia la tónica o hacia la dominante según la época y el estilo. Sus tríadas contienen el 4.º y/o el 6.º grado y **no** contienen la sensible.

### Qué grados representan cada función

| Función | Modo mayor | Modo menor |
|---|---|---|
| **Tónica** | I e IMa: siempre. VI: usualmente. III y IIIMa: solo en ciertas circunstancias. | I, Inat e Imel: siempre. IIInat: usualmente. |
| **Dominante** | V y VMa: siempre. VII y VIIMa: siempre. III y IIIMa: solo en ciertas circunstancias (el grado más ambiguo). | V y Vmel: siempre. VII y VIImel: siempre. Vnat y VIInat: usualmente (*). III y IIImel: solo en ciertas circunstancias. |
| **Subdominante** | II y IIMa: siempre. IV y IVMa: siempre. VIMa: siempre. VI: solo en ciertas circunstancias. | II, IInat y IImel: siempre. IV, IVnat y IVmel: siempre. VI, VInat y VImel: siempre. |

(*) La menor natural no tiene sensible; su funcionalidad depende de la tonicidad del propio campo diatónico y de la relativa mayor (se ve en cursos posteriores).

**Ejemplos de los apuntes:** Bach, *Aus meines Herzens Grunde* (en sol: I T, IV6 S, V6 D, I T, V D, VI T, IV S, VII6 D, I T, V D, I T, V/6 D, VI6/5 T, VII6 D, I6 T, II6/5 S, V7 D, I T); Lennon y McCartney, *Nowhere Man* (en mi: E I T, B V D, A IV S, E I T, F♯m II S, Am IVMa S, E I T); Bach, *Jesu, der du meine Seele* (en la menor: I T, V6 D, IVmel6 S, VII D, I T, V D, I T, VI S, II6/5 S, V D, IV6 S, VII6 D, I6 T, VImel6 S, V D); Queen, *The Show Must Go On* (en si menor: Bm I T, G VI S, Em IV S, F♯ V D).

*Bibliografía:* Jaffe (1996) pp. 29-30; Harrison (2010) pp. 43-72; Kennan (1999) pp. 11-12; Koellreutter, *Harmonia funcional* (1986) pp. 13-26; Mitchell (1965) pp. 66-77; Nettles y Graf (2015) pp. 30-31; Zamacois I pp. 123-127.
