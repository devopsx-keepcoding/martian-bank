
# Git Flow

Para este proyecto, se utilizó GitFlow como flujo de trabajo, para el manejo de ramas y lanzamientos.

¿Cómo se trabaja en GitFlow?
GitFlow utiliza cinco tipos principales de ramas:

`main`: Contiene el código de producción. Solo se actualiza cuando se lanza una nueva versión estable.

`develop`: Es la rama de integración. Todas las nuevas funcionalidades y correcciones se integran aquí antes de pasar a producción.

`feature/`: Para desarrollar nuevas funcionalidades. Se crean a partir de develop y se integran nuevamente a esta rama cuando están completas.

`release/`: Se usan para preparar una nueva versión estable. Se crean a partir de develop y se integran en main y develop cuando están listas.

`hotfix/`: Para arreglos críticos en producción. Se crean a partir de main y se integran tanto en main como en develop.


## 1. Activación

Para activar el flujo de trabajo se debe ejecutar el siguiente

```bash
  git flow init

```
Durante la inicialización, se te pedirá definir los nombres de las ramas principales (main y develop) y los prefijos para las ramas de características, lanzamientos y correcciones.

## 2. Ramas de caracteristicas

Todas las caracteristicas nuevas deben residir en su propia rama, que se puede enviar al repositorio central para copia de seguridad/colaboración. Sin embargo, en lugar de ramificarse de `main`, las ramas feature utilizan la rama `dev` como rama primaria. Cuando una caracteristica está terminada, se vuelve a fusionar en `dev`. Las features no deben interactuar nunca directamente con `main`.

### 3. Creacion de la rama Feature

```bash
$ git checkout -b feature/example dev
$ git push --set-upstream origin feature/example

(Hacer las modificaciones necesarias)
$ git add .
$ git commit -a -m "feat: add dev page" -m "context..."
$ git push

```

### 4 . Finalizacion de rama Feature

Cuando hayas terminado con el trabajo de desarrollo en la caracteristica, el siguiente paso es crear un pull request para que revisen el codigo o directamente fusionar feature_branch en dev.

```ps
create a pull request or

$ git checkout dev
$ git merge --no-ff feature/example
(Resolver conflictos)
$ git push origin dev
```

El indicador --no-ff hace que la combinación siempre cree un nuevo objeto de confirmación. Esto evita perder información sobre la existencia histórica de una rama feacture y agrupa todas las confirmaciones que agregaron la caracteristica.

Una vez integrada la rama en `dev` eliminaremos la rama en el repositorio local.

```ps
$ git branch -d feature/example
```

Y por ultimo eliminamo la rama remota.

```ps
$ git push origin :feature/example
```

## 5. Ramas de publicacion

![Feacture](https://raw.githubusercontent.com/JorgeGordilloDev/gitflow/478fcf5a351f4894a4204fd30f2517f6b45948ba/doc/03.svg)

Cuando `dev` haya adquirido suficientes funciones para una publicación (o se acerque una fecha de publicación predeterminada), debes bifurcar una rama release (o de publicación) a partir de `dev`. Al crear esta rama, se inicia el siguiente ciclo de publicación, por lo que no pueden añadirse nuevas funciones una vez pasado este punto (en esta rama solo deben producirse las soluciones de errores, la generación de documentación y otras tareas orientadas a la publicación). Cuando está lista para el lanzamiento, la rama release se fusiona en `master` y se etiqueta con un número de versión. Además, debería volver a fusionarse en `dev`, ya que esta podría haber progresado desde que se iniciara la publicación.

Crear ramas release es otra operación de ramificación sencilla. Al igual que las ramas `feature`, las ramas `release` se basan en la rama `dev`. Se puede crear una nueva rama `release` utilizando los siguientes métodos.

### 6. Creacion de rama Release

```ps
$ git checkout -b release/1.2.0 dev
$ git push --set-upstream origin release/1.2.0

(Hacer las modificaciones necesarias)
$ git add .
$ git commit -a -m "Release version 1.2.0 of the project" -m "context..."
$ git push
```

### Finalizacion de rama Release

Cuando hayas terminado con el trabajo de la publicacion, el siguiente paso es crear un pull request para que revisen el codigo o directamente fusionar release_branch en `master` y en `dev`.

Primero debemos actualizar la rama `master`.

```ps
crear pull request o

$ git checkout master
$ git merge --no-ff release/1.2.0
$ git tag -a 1.2.0
$ git push origin master
```

A continuación, debemos guardar esos cambios en la rama `dev`.

```ps
crear pull request o

$ git checkout dev
$ git merge --no-ff release/1.2.0
$ git push origin dev
```

Una vez integrada la rama tanto en `master` como en `dev` eliminaremos la rama local en el repositorio local.

```ps
$ git branch -d release/1.2.0
```

Y por ultimo eliminamo la rama remota.

```ps
$ git push origin :release/1.2.0
```