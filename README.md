# Dictado Armónico

Ejercicios para el curso de armonía: los nueve temas del programa, cada uno con su resumen, ejercicios de **teoría** y ejercicios de **oído**. Los ejercicios se generan al azar, se responden con botones y, si la respuesta es incorrecta, la app muestra la respuesta correcta y la explicación paso a paso.

Es hermana de [DandeBook](https://github.com/rpp396/DandeBook) y [DandEtudeDuR](https://github.com/rpp396/DandEtudeDuR) y comparte su manera de hacer las cosas: sin instalación ni compilación, todo local y privado, accesible y pensada también para el móvil.

## Uso

Abre `index.html` en el navegador. Necesita a su lado `styles.css` y las carpetas `js/`, `fonts/` e `iconos/`. Funciona abriéndolo directamente (`file://`) o sirviendo la carpeta con cualquier servidor web; servida por http(s) se puede instalar como aplicación y funciona sin conexión. El progreso se guarda en el navegador y se puede exportar e importar (pie de página) para llevarlo a otro.

## Qué incluye

| Tema | Teoría | Oído |
|---|---|---|
| 1. Intervalos | Identificar, construir, compuestos, complementarios | Intervalo melódico o armónico |
| 2. Tríadas | Tipo, estado y posición, cifrado popular, bajo cifrado | Tipo, estado |
| 3. Tétradas | Tipo, estado, cifrado popular, bajo cifrado | Tipo, estado |
| 4. Notas con función melódica | Reconocer la nota marcada en un fragmento | Reconocerla de oído |
| 5. Tensiones | Cifrar el acorde, nota de la tensión | Qué tensión suena; sus, add, sexta o séptima |
| 6. Campo diatónico y escalas | Armadura, tritono y semitonos característicos, identificar y construir escalas | Tipo de escala |
| 7. Grados de la tonalidad mayor | Del grado al acorde y al revés, tensiones disponibles, nomenclatura | Grado de un acorde, dictado de progresión |
| 8. Grados de la tonalidad menor | Lo mismo, con las escalas armónica, natural y melódica | Lo mismo, en menor |
| 9. Funciones armónicas | Función de un grado, resolución del tritono | Función de cada acorde de una progresión |

- **Tres niveles** por tema (básico, intermedio, avanzado): cambian las tonalidades, las alteraciones y los tipos que entran. El básico no usa dobles alteraciones; el intermedio las admite cuando surgen solas, y el avanzado las busca a propósito (doble sostenido y doble bemol también en los botones de alteración). Los ejercicios de oído no las usan: la ortografía no se oye.
- **Corrección:** al comprobar se marcan la opción correcta y la elegida; debajo, la respuesta correcta, la partitura y la explicación. En los ejercicios de oído se puede comparar «lo correcto» con «lo que respondiste».
- **Los intervalos se explican como se calculan habitualmente:** primero el número (contando los nombres de las notas) y después la calidad (contando los semitonos y comparando con la tabla). Las correcciones y el Resumen miden las distancias en semitonos.
- **Acordes con tensiones en sistema de piano** (tema 5): bajo en clave de fa, el resto en el registro central, respetando los *low interval limits*. La 13 ocupa el lugar de la quinta.
- **Escalas con su armadura** en las soluciones (tema 6).
- **Progreso** por tema y por tipo de ejercicio; el porcentaje de cada tipo es el del nivel elegido.
- **Dictados con cadencia** (temas 7 a 9): se pueden escuchar más despacio y solo con el bajo.
- **Sonido** sintetizado en el propio navegador (piano, piano eléctrico, guitarra, órgano o cuerdas).
- **Bienvenida:** la primera vez, una guía de cuatro pasos explica cómo funciona y deja elegidos el nivel y el sonido; se vuelve a abrir con «Cómo funciona», al pie.
- **Accesible y privada:** se usa entera con teclado y lector de pantalla, y no hace ninguna petición a otros sitios.

Atajos: `E` escuchar · `T` tónica · `C` cadencia (en los dictados) · `1`–`9` elegir opción · `Intro` comprobar y pasar al siguiente.

## Contenido del curso

Los resúmenes, las reglas de cifrado, las tablas de grados y tensiones y las funciones salen de los apuntes de la carpeta `Temas/` (Agustín Pardo y Alejandro Barbot, 2025). Las tablas de tensiones disponibles (temas 7 y 8) se transcribieron a mano desde las imágenes de los PDF.

## Pruebas

```
npm test
```

Necesita Node 18 o posterior y no instala nada. Comprueba el motor de teoría contra los ejemplos de los apuntes y cada generador de ejercicios con cientos de semillas. La interfaz no tiene pruebas automáticas en navegador.

## Créditos

Glifos musicales y letra del cifrado: Petaluma (Steinberg), licencia SIL OFL 1.1. Tipografías Atkinson Hyperlegible, JetBrains Mono y Young Serif, también OFL (ver `fonts/OFL-*.txt`). Instrumentos y glifos tomados de DandeBook.
