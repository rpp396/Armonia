# Propuestas de mejora

Mejoras pendientes, anotadas el 15 de noviembre de 2026 tras revisar el código. Salen de leer el código, no de probar la app con alumnos: el impacto es una estimación. Las propuestas 5 a 9 de aquella revisión (controles de escucha, progreso por nivel, instalable sin conexión, atajos de teclado, exportar e importar el progreso) se implementaron aparte y no están aquí.

## 1. Progresiones con sentido armónico

- **Impacto:** alto. **Esfuerzo:** medio.
- **Qué pasa hoy:** en «Dictado de progresión» (temas 7 y 8, `registrarGrados` en `js/temas/t7.js`) y «Función de cada acorde» (`t9-oido` en `js/temas/t9.js`) la progresión empieza en el I y cada acorde siguiente se elige al azar entre los disponibles; solo se evita repetir el anterior. Salen sucesiones como I–VII–III–II, que no suenan a música tonal y no entrenan lo que el curso enseña.
- **Propuesta:** generar por funciones (tónica → subdominante → dominante → tónica), usando `FUNCIONES` y `funcionesDe` de `js/teoria.js`, y cerrar en cadencia. Mantener variedad suficiente en básico (hoy el tema 9 básico solo tiene 8 progresiones posibles).
- **Cuidado:** toca decisiones del curso; consultar `APUNTES.md` (temas 7, 8 y 9) y revisar el plan con el usuario antes de implementar.
- **Agente:** `Plan` con Opus 5.5 y después `general-purpose` con Sonnet 5.5.

## 2. Repasar los fallos

- **Impacto:** alto. **Esfuerzo:** medio.
- **Qué pasa hoy:** `store.prog` guarda intentos, aciertos y racha por tipo de ejercicio. «Variado» elige el tipo al azar con el mismo peso (`genActual` en `js/interfaz.js`) y un ejercicio fallado no vuelve a salir a propósito.
- **Propuesta:** guardar la semilla y el nivel de los ejercicios fallados (los generadores son reproducibles por semilla) para ofrecer «Repasar fallos», y hacer que «Variado» pese más los tipos con peor porcentaje.
- **Cuidado:** todo lo que se guarde debe validarse en `cleanProg` (`js/datos.js`) y tener un tope de tamaño.
- **Agente:** `Plan` y después `general-purpose`, con Sonnet 5.5.

## 3. Inversiones y tétradas en el oído avanzado

- **Impacto:** medio-alto. **Esfuerzo:** medio.
- **Qué pasa hoy:** los ejercicios de oído de los temas 7 a 9 solo usan tríadas en estado fundamental (`gradosOido` llama a `acordeDeGrado(..., false)` y `vozAcorde` pone siempre la fundamental en el bajo), también en avanzado.
- **Propuesta:** en avanzado, tétradas y acordes invertidos; el alumno responde con la nomenclatura que ya practica en «Nomenclatura de grados».
- **Cuidado:** decisión del curso (qué inversiones y con qué cifrado); conviene hacerla después de la propuesta 1, que toca los mismos generadores.
- **Agente:** `general-purpose` con Sonnet 5.5.

## 4. Prueba de humo de la interfaz

- **Impacto:** medio. **Esfuerzo:** medio.
- **Qué pasa hoy:** no hay pruebas en navegador; la interfaz se comprueba a mano. En la última tanda de cambios no se pudo verificar la vista en móvil ni el sonido.
- **Propuesta:** un script (fuera de `npm test`, porque necesita un navegador) que abra con Edge `--headless` cada tema y pestaña con `?semilla=`, y falle si hay errores de consola, desbordes horizontales a 390 px o botones de menos de 44 px.
- **Cuidado:** Edge headless no baja de unos 500 px de ancho de ventana; para el móvil hay que emular el viewport de otra forma (por ejemplo, con el protocolo de depuración).
- **Agente:** `general-purpose` con Sonnet 5.5.
