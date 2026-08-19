/**
 * Qué esquinas van redondeadas. `start` y `end` son lógicas: siguen la
 * dirección de escritura, así que en RTL se dan vuelta solas.
 *
 * Sirve para apoyar un componente contra otro sin que quede una esquina
 * redonda adentro de otra, con una medialuna de fondo entre las dos.
 *
 * El preset apaga esquinas puntuales con longhands lógicas, así que el radio
 * que sobrevive sale de la custom property del componente. Para una
 * combinación que no esté acá, esa custom property acepta el shorthand entero
 * de `border-radius` — pero solo con `corners="all"`, porque los otros presets
 * pisarían el shorthand.
 */
export type FsCorners = 'all' | 'none' | 'top' | 'bottom' | 'start' | 'end';
