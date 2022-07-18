## Description

La arquitectura está basada en capas, donde la más importante son los módulos. Los módulos tienen una organización jerárquica, donde existe un módulo principal. Dentro de cualquier módulo podemos encontrar artefactos, que son siempre clases de programación orientada a objetos, entre las que se incluyen:

- Módulos: otros módulos dependientes
- Controladores: que se encargan de implementar los casos de uso de la aplicación. Típicamente responden a las rutas de las aplicaciones web, es decir, las URL o endpoints de un API.
- Providers: dentro de los cuales podemos encontrar muchas clases, de diversos tipos, entre las que tenemos los pipes, servicios, repositorios, etc. Todas estas clases tienen una característica en común, que son inyectables en otras clases.

Esta arquitectura está fuertemente inspirada en Angular, por lo que los desarrolladores de este framework frontend serán capaces de entender muy bien el desarrollo backend con Nest.

<p align="center">
  <a target="blank"><img src="https://softwareontheroad.com/static/1a21f74cfc4c965f00324afd39642b9f/62eec/server_layers_2.jpg" alt="Nest Logo" /></a>
</p>
