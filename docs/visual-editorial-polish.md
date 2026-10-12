# Ronda puntual de correcciones visuales y editoriales

## Atlas neuronal

El acceso de excitotoxicidad glutamatérgica se ancla a una espina de la misma escala, geometría y membrana que sus vecinas. La anatomía ampliada de contexto y su axón aferente dejan de dibujarse en la vista general. El hotspot mantiene su identidad, etiqueta y navegación.

El modelo B conserva su fábrica, estructuras, ocho etapas, cámaras locales y controles. La vista de detalle se abre al seleccionar el hotspot y el regreso muestra de nuevo la dendrita uniforme.

Comparación: [antes](previews/polish/before-hub.png) y [después](previews/polish/after-hub.png). Detalle de [B](previews/polish/after-mechanism-b.png) y [atlas móvil](previews/polish/mobile-hub.png).

## Presentación experimental

La interfaz utiliza una presentación pública breve: ensayo, unidad, media ± SEM, n = 5–6, referencia al control de la misma edad y comparaciones según la figura original. Las leyendas públicas describen el ensayo y su procedencia experimental. La limitación del homogeneizado se concentra en Metodología.

Los pies literales, notas aprobadas MTT/TBARS y detalles técnicos de procedencia permanecen en las fuentes y documentación internas. No se renderizan en el panel, las leyendas ni el diálogo de las figuras. Los archivos de las tres figuras y sus símbolos estadísticos no cambian.

Se mantienen las diferencias tempranas de QUIN/TBARS en PN3 y PN5 y la ausencia de un patrón consistente de incremento entre edades. Las consultas MTT/PN3 siguen indicando «No evaluado». La descripción de 3-NP/DCFDA evita incorporar una comparación estadística nueva.

Comparación de TBARS: [antes](previews/polish/before-tbars-results.png), [después](previews/polish/after-tbars-results.png) y [móvil](previews/polish/mobile-tbars-results.png). [Leyenda MTT](previews/polish/after-mtt-caption.png) y [Metodología](previews/polish/after-methods.png).

## Comprobaciones

- `npm test`: 14 archivos aprobados, 0 fallos. La prueba focal de datos también pasó después del último ajuste de copy.
- `npm run build`: 45 módulos; 29 archivos y 62 referencias locales comprobados.
- Las pruebas recorren las 60 presentaciones públicas, conservan los datos fuente y comprueban que las notas de auditoría no se incluyan en el contenido público.
- Capturas reales de Chromium con WebGL y SwiftShader a 1280 × 900 y 390 × 844, con movimiento reducido. Los recorridos incluyen neurona, dendrita, entrada a B por el hotspot, regreso, tres ensayos, leyendas y metodología. Sin errores de consola, página o carga registrados.
- Informes: [escritorio](previews/polish/after-validation.json) y [móvil](previews/polish/mobile-validation.json).

La publicación utiliza los workflows existentes de GitHub Pages. Esta ronda no modifica su configuración.
