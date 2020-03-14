# Micro generador hecho con Plop para crear test para aplicaciones de Loopback 3

Este micro generador crea conjuntos de tests basados en las definiciones de una API de Loopback 3.

Este tipo de generador le evitara la repetitiva pérdida de tiempo que ocurre al escribir el código para los múltpiles tests des una API de Loopback 3.

Obviamente, usted puede personalizar las plantillas del generador y obtener el código para los tests que usted prefiera.

Las definiciones para crear los tests son obtenidas directamente, usando el comando **lb** (Loopback 3 CLI).

Los tests usan la librería [supertest](https://github.com/visionmedia/supertest) para hacer acceder mediante HTTP a la API de Loopback 3 bajo prueba.

## Obteniendo las definiciones de la API

Puede obtener una archivo JSON con las definiciones de la API ejecutando el siguiente comando:

```shell
lb export-api-def --json > testing_data/specs.json
```

## Usuarios que han accedido al sistema y usuario que no lo han hecho

Hay dos generadores diferentes. El primero de ellos crea los tests para un usuarion que ha accedido correctamente a la API y ha obtenido su "token de acceso", mientras que el segundo crea los tests para un usuario que no ha accedio a la API.

Estos dos tipos son importantes si ha definido una lista de control de acceso (ACL), que impide que ciertas operaciones no pueden ser realizadas por usuario que no poseen su token de acceso.


## Cómo usar estos tests

-   Instale en su proyecto las dependecias necesarias para los tests:

```shell
npm install --save-dev mocha chai supertest cross-env
```

-   Cree una estructura de directorios similar a la del ejemplo referido mas abajo.

-   Copie los archivos de test generados con el generador.

-   Edite y personalice cada test de acuerdo a sus necesidaes particulares.

-   Ejecute los tests.

**Nota importante:** Estos tests usan algunos archivos que contienen código auxiliar para crear usuarios en el sistema y acceder a la API durante las pruebas. Hay un ejemplo de tales archivos en el ejemplo referido a continuación.

## Ejemplo

Hay un ejemplo sobre cómo ejecutar los tests sobre una API de Looback 3 en el directorio denominado **examples**.

Para ejecutar el ejemplo:

```shell
cd examples
npm install
npm test
```

### Detalles del ejemplo

La estructura de directorios  para los tests es la siguiente:

<pre>
test---+
       |
       +- api -+
               |
               +-- models
               |
               +-- utils
               |
               +-- specs
</pre>

*  **models** contiene los tests obtenidos a partir del micro generador.

*  **utils** contiene el código auxiliar para crear usuarios y para acceder con ellos a la API.

*  **specs** contiene las definiciones de API obtenidas con Loopback 3 CLI.
