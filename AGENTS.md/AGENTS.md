# Instrucciones del proyecto

## Objetivo

Construir una página web científica, elegante, responsive e interactiva que muestre una sinapsis glutamatérgica en 3D y explique visualmente la excitotoxicidad.

## Principios generales

- No crear una página genérica de plantilla.
- No usar un diseño de dashboard administrativo.
- No usar una estética infantil, caricaturesca o de videojuego.
- No saturar la pantalla con texto.
- Priorizar la visualización 3D.
- Mantener una estética científica, editorial y sofisticada.
- Usar una jerarquía visual clara.
- La página debe funcionar correctamente en escritorio y dispositivos móviles.
- No depender de un backend.
- Debe poder desplegarse en GitHub Pages.
- No utilizar claves API.
- No incorporar dependencias innecesarias.

## Estética visual

- Fondo oscuro azul petróleo o negro azulado.
- Acentos discretos en cian, azul eléctrico y magenta.
- Paneles translúcidos tipo glassmorphism, sin exagerar.
- Tipografía moderna y legible.
- Contraste alto.
- Sombras suaves.
- Iluminación volumétrica sutil.
- Apariencia de ilustración científica 3D de alta calidad.
- Espaciado generoso.
- Animaciones suaves y no invasivas.

## Modelo 3D

El modelo debe tener:

- Terminal presináptica bulbosa y orgánica.
- Espina dendrítica con cabeza y cuello diferenciados.
- Hendidura sináptica visible.
- Membranas con materiales semitranslúcidos.
- Vesículas presinápticas redondeadas.
- Receptores AMPA y NMDA diferenciados visualmente.
- Glutamato representado como partículas pequeñas.
- Iones Ca2+ representados de manera clara.
- Mitocondria con forma orgánica y crestas internas.
- ROS como partículas o señales luminosas controladas.
- Caspasas como elementos conceptuales, no como estructuras anatómicas exactas.

Evitar:

- Discos planos.
- Cilindros rígidos.
- Tubos rectos.
- Estrellas utilizadas como espinas dendríticas.
- Formas geométricas sin función biológica.
- Exceso de partículas.
- Texto flotante ilegible.
- Etiquetas que atraviesen objetos.
- Componentes superpuestos de manera confusa.

## Interactividad

La página debe permitir:

1. Rotar la escena con el mouse o táctil.
2. Hacer zoom limitado.
3. Restablecer la cámara.
4. Activar y desactivar etiquetas.
5. Seleccionar AMPA.
6. Seleccionar NMDA.
7. Seleccionar mitocondria.
8. Seleccionar calcio.
9. Seleccionar ROS.
10. Seleccionar caspasas.
11. Mostrar un panel explicativo contextual.
12. Activar una secuencia educativa de excitotoxicidad.
13. Pausar y reanudar la animación.
14. Cambiar entre modo fisiológico y modo de sobrecarga excitotóxica.
15. Acceder a referencias bibliográficas.

## Comportamiento educativo

En el modo fisiológico:

- Liberación moderada de glutamato.
- Activación controlada de receptores.
- Entrada limitada de calcio.
- Actividad mitocondrial estable.
- Baja señal de ROS.

En el modo de sobrecarga excitotóxica:

- Aumento de glutamato.
- Mayor activación de receptores.
- Incremento visual de entrada de Ca2+.
- Aumento de señales de ROS.
- Cambio visual de la mitocondria.
- Activación conceptual de caspasas.

La animación debe ser explicativa, no una simulación numérica ni una afirmación cuantitativa.

## Arquitectura técnica

Preferir:

- HTML semántico.
- CSS organizado.
- JavaScript modular.
- Three.js o una biblioteca WebGL apropiada.
- Vite únicamente si realmente facilita el proyecto.
- GitHub Pages compatible.
- Carga local de archivos.
- Optimización para que la página no sea excesivamente pesada.

## Calidad

Antes de terminar:

- Ejecutar el proyecto localmente.
- Corregir errores de consola.
- Revisar que todos los botones funcionen.
- Revisar que la escena cargue sin errores.
- Revisar el diseño en escritorio y móvil.
- Revisar accesibilidad básica.
- Revisar que las etiquetas no se corten.
- Revisar que el texto sea legible.
- Revisar que el proyecto pueda desplegarse en GitHub Pages.
- No declarar que algo está terminado si no se ha probado.

## Regla de trabajo

Primero inspeccionar el repositorio y los archivos existentes. Después proponer una arquitectura breve. Luego implementar por fases y comprobar cada fase antes de continuar.