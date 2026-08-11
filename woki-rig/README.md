# Woki rig

Rig inicial para animar el Woki del character kit original con CSS y JavaScript.

## Qué está separado

- cuerpo
- antena izquierda
- antena derecha
- ojo izquierdo
- ojo derecho
- pupila izquierda
- pupila derecha
- corazón
- dos destellos

## Qué anima ya

- respiración muy suave
- parpadeo automático y manual
- pupilas siguiendo el puntero
- pequeños movimientos de antenas
- acentos morados flotando
- estado `peek`
- estado `thinking`

## Importante

El cuerpo fuente del kit incluye las manos originales dentro del propio recorte. Por fidelidad no se ha inventado un cuerpo nuevo ni se han activado movimientos independientes de manos. Los recortes de manos siguen disponibles en el SVG como assets fuente ocultos para una fase posterior.

## Integración

Carga `woki-rig.css` y usa `mountWokiRig()` de `woki-rig.js`.

El demo necesita servirse por HTTP (por ejemplo GitHub Pages o un servidor local), no abrirse directamente con `file://`, porque JavaScript carga el SVG con `fetch`.
