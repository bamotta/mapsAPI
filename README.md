# mapsAPI# mapsAPI
# Sesión 1  Insertar un mapa. 19/05/2025

## Resumen
- Desde la última hora de clase se realizó la explicación de la práctica. Conseguimos la API e insertamos el mapa en la página.

## Dificultades encontradas
- 

## Soluciones aplicadas
- 

## Fuentes consultadas 
- Apuntes vistos en clases anteriores

## Decisiones técnicas
- 

## Ideas de mejora futura
- 



# Sesión 2 Personalizar el mapa. 20/05/2025

## Resumen
- Hoy hemos realizado el script, el formulario y el css de la práctica. Se han almacenado las ciudades y sus respectivas coordenadas, así como sus ubicaciones elegidas y las coordenadas de estas. 
Hemos insertado también los iconos para cada lugar elegido.

## Dificultades encontradas
- Iconos personalizados
- Función hover iconos

## Soluciones aplicadas
- Uso de 'icon' dentro de la declaración del marker con la url de la imagen descargada.
- uso de dos EventListener, uno para cuando nos colocamos encima y otro para cuando quitamos el ratón de encima.

## Fuentes consultadas
- Apuntes vistos en clases anteriores
- https://developer.mozilla.org/es/docs/Web/API/Window/open
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction/setIcon
- https://developers.google.com/earth-engine/apidocs/map-setcenter

## Decisiones técnicas
- Decidimos poner el select en la esquina superior izquierda porque estéticamente es mejor.

## Ideas de mejora futura
- Introducir los nombres de los markers al lado.

# Sesión 3 Utilizar direcciones. 21/05/2025

## Resumen
- Hoy hemos añadido la caja de texto que permite introducir la dirección y un desplegable para establecer la categoría de la misma. Obtener las coordenadas de la dirección a través de OpenStreetMap, precisamente nominatim. Almacenamos la información de la ubicación en localstorage. Finalmente asignamos iconos a las ubicaciones. Y un botón de borrado.

## Dificultades encontradas
- Obtener las coordenadas OpenStreetMap.

## Soluciones aplicadas
- Usar la API nominatim de 

## Fuentes consultadas
- Apuntes vistos en clases anteriores.
- https://nominatim.openstreetmap.org/ui/search.html
- https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

## Decisiones técnicas
- Decidimos repartir lod select por las esquines para dar más visibilidad al mapa estéticamente es mejor.
- 

## Ideas de mejora futura
- Invertir la flecha del select.

# Sesión 4  Obtener posiciones de forma dinámica. 22/05/2025 - 23/05/2025

## Resumen
- Hoy hemos añadido la funcionalidad de recoger y mostrar en una pantalla nueva las localizaciones almacenadas en un xml. En este caso eran los terremeotos acaecidos en España en los últimos 10 días. Lo hemos decidido mostrar en una pantalla diferente y sin los iconos del resto de las ubicaciones buscadas con anterioridad. Luego hicimos una clasificación por magnitudes asignando un color a cada rango de magnitud.

## Dificultades encontradas
- En un primer momento no mostraba los marcadores de terremoto.
- Tomar de un nodo xml que es solo texto una parte excluyendo el resto del mismo.

## Soluciones aplicadas
- Comprobar el codigo de implementación.
- Guardar en una variable y utilizar el catch.

## Fuentes consultadas
- Apuntes vistos en clases anteriores.
- https://developer.mozilla.org/es/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
- https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch
- https://developer.mozilla.org/es/docs/Web/API/DOMParser
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then

## Decisiones técnicas
- Para utilizar los datos de la magnitud desde el XML y mostrarlos en nuestra aplicación se decidió guardar en una variable y utilizar el catch.

## Ideas de mejora futura


