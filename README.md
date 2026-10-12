# Currency Explorer · Starter Project

## Integrantes
- Estudiante A: Natalia Jaquelin Sanchez Morales
- Estudiante B: Abril Saro Arteaga

## Pair Programming
| Misión | Driver | Navigator | Commit / evidencia |
|---|---|---|---|
| 04 | Natalia | Abril | |
| 05 | Abril | Natalia | |
| 06 | Natalia | Abril | |
| 07 | Abril | Natalia | |
| 08 | Natalia | Abril | |
| 09 | Abril | Natalia | |
| 10 | Natalia | Abril | |
| 11 | Abril | Natalia | |

## Objetivo
Completar una aplicación frontend que consuma Frankfurter API para convertir divisas y demostrar comprensión de eventos, DOM, `fetch()`, JSON, asincronía, validación y manejo de errores.

## Ejecución
1. Descomprime el proyecto.
2. Abre la carpeta en VS Code.
3. Ejecuta `index.html` con Live Server o un servidor local equivalente.
4. Abre DevTools → Console y Network para observar el comportamiento.

## API
Endpoint de referencia:
`https://api.frankfurter.dev/v2/rate/{origen}/{destino}`

## Decisiones técnicas
Registra aquí al menos dos decisiones tomadas por la pareja y explica por qué.

1. *Separar los errores HTTP de los de red (Misión 09).* fetch() solo lanza excepción cuando falla la red; un 404 o un 500 sí llegan como respuesta. Por eso comprobamos respuesta.ok, lanzamos el error nosotros con el código HTTP y en el catch mostramos un mensaje distinto para cada caso.
2. *Una rama y un Pull Request por misión.* Dejó trazabilidad de quién condujo y quién revisó cada cambio, y permitió detectar errores antes de unirlos a main.

## Revisión cruzada
- Aspecto bien resuelto: el intercambio con variable temporal y recálculo (06) y el uso de finally para reactivar los botones (08).
- Error o comportamiento mejorable: En la misión 05 quedó un } catch (error) { duplicado que rompía el script.
- Propuesta de mejora: Eliminar el } catch (error) { duplicado.
- Cambio incorporado después de la revisión: Se corrigió en la rama de la Misión 06.

## Reflexión final (150–200 palabras)
Lo más importante que aprendimos es que consumir una API es un recorrido, no una sola instrucción: el clic dispara un evento, fetch() pide los datos, response.json() los convierte en un objeto, JavaScript calcula y textContent actualiza la pantalla. Entender que HTTP y JSON son pasos distintos nos ayudó a manejar errores: fetch() solo falla por red, así que revisamos response.ok para detectar un 404 o un 500.
La principal dificultad fue trabajar con Git desde el navegador. Una rama quedó desactualizada y GitHub no pudo unirla automáticamente, y en varias ocasiones pegamos código mezclado con el anterior: constantes y un catch duplicados que rompían el script, y CSS pegado dentro de code.js. Aprendimos a crear cada rama desde main actualizado y a revisar el diff de cada Pull Request antes de unirlo.
Una decisión que surgió del trabajo Driver/Navigator fue reactivar los botones en un bloque finally. Al revisar la Misión 08 vimos que, de otro modo, un error dejaría la aplicación bloqueada. También decidimos probar cada misión en DevTools, usando el modo Offline para comprobar los mensajes de error, antes de aprobar el Pull Request.
