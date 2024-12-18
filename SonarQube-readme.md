
# SonarQube

SonarQube es una herramienta de análisis de calidad y seguridad del código fuente que ayuda a los equipos de desarrollo a identificar problemas, mejorar la calidad del software y garantizar que el código sea seguro y sostenible a largo plazo. Proporciona un análisis continuo para detectar vulnerabilidades, errores, y problemas de estilo en múltiples lenguajes de programación.
## Instalación

Pasos para crear un proyecto en SonarCloud:

### Registro en SonarCloud
Accede a SonarCloud.
Inicia sesión utilizando tu cuenta de GitHub, GitLab, Bitbucket, o Azure DevOps.
Si no tienes cuenta, regístrate gratuitamente con tu proveedor de control de código.

### Crear una organización
Una vez registrado, selecciona o crea una organización.
Si ya tienes una organización vinculada a tu repositorio en GitHub/GitLab/etc., puedes sincronizarla automáticamente.
De lo contrario, crea una nueva organización y configura el control de facturación si es necesario.

### Agregar un proyecto
Desde el panel de SonarCloud, selecciona + Add Project o navega al menú de Projects.
Selecciona tu proveedor de repositorio (por ejemplo, GitHub).
Autoriza a SonarCloud a acceder a tu cuenta de repositorios.
Escoge el proyecto que deseas analizar de la lista sincronizada o introduce su nombre si no aparece.

### Configurar el análisis
Seleccionar tipo de integración:
Si utilizas un pipeline CI/CD (como GitHub Actions, Jenkins, GitLab CI, etc.), selecciona el pipeline correspondiente.
Si deseas ejecutarlo localmente, elige la opción de usar el Scanner CLI.

Generar un token de seguridad:
SonarCloud generará un token para autenticar los análisis. Guárdalo, ya que será necesario en la configuración.

## Configuración de SonarQube Analysis

### Definición del Job

```bash
sonarqube:
    name: Run SonarQube Analysis
    runs-on: ubuntu-latest
    needs: 
      - unit-test-customer-auth
      - unit-test-ui

```
`sonarqube:` Nombre del job que se encargará de ejecutar el análisis con SonarQube.

`name:` Etiqueta descriptiva para el job en el flujo de trabajo (GitHub Actions).

`runs-on: ubuntu-latest:` Este job se ejecutará en un runner con el sistema operativo Ubuntu (la última versión).

`needs:` Declara dependencias. Este job solo se ejecutará después de que los jobs unit-test-customer-auth y unit-test-ui se completen con éxito

### Pasos

```bash
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
```
Usa la acción oficial `actions/checkout` para clonar el código fuente del repositorio.

`fetch-depth:0`  Clona todo el historial del repositorio en lugar de solo el último commit, necesario si SonarQube requiere acceso al historial para algunas reglas de análisis.

### SonarQube Scanner

Para poder realizar un scanner sobre el codigo, es necesario que podamos acceder a los reportes de las pruebas unitarias que se han realizado en otra fase del pipeline. 

```bash
      - name: Download coverage report for customer-auth
        uses: actions/download-artifact@v3
        with:
          name: customer-auth-coverage-report
          path: ./customer-auth/coverage
  
      - name: Download coverage report for ui
        uses: actions/download-artifact@v3
        with:
            name: ui-coverage-report
            path: ./ui/coverage

```
Siendo:

`actions/download-artifact:` Descarga artefactos generados en pasos anteriores del pipeline.

`name:` Nombre del artefacto generado previamente en otros jobs (en este caso, reportes de cobertura para customer-auth y ui).

`path:` Ruta local donde se almacenará el archivo descargado.
Esto asegura que los reportes de cobertura estén disponibles para SonarQube en las rutas ./customer-auth/coverage y ./ui/coverage.

### Configurar Java

      - name: Set up Java
        uses: actions/setup-java@v3
        with:
          java-version: 11
          distribution: 'temurin'

Usa la acción `actions/setup-java` para instalar Java (versión 11 en este caso) en el runner. SonarQube Scanner requiere Java para ejecutarse, ya que está basado en Java.

### Instalar SonarQube

        name: Install SonarQube Scanner
        run: npm install -g sonarqube-scanner

`npm install -g sonarqube-scanner:` Instala el cliente de SonarQube Scanner globalmente en el runner, que será usado para enviar los datos del análisis al servidor de SonarQube.

### Ejecucion de SonarQube Scanner

```bash
  name: Install SonarQube Scanner
        run: npm install -g sonarqube-scanner

      - name: Run SonarQube Scanner
        env:
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        run: |
          sonar-scanner \
            -Dsonar.projectKey=devopsx-keepcoding_martian-bank \
            -Dsonar.sources=. \
            -Dsonar.host.url=${{ secrets.SONAR_HOST_URL }} \
            -Dsonar.organization=devopsx-keepcoding \
            -Dsonar.token=${{ secrets.SONAR_TOKEN }} \
            -Dsonar.javascript.lcov.reportPaths=customer-auth/coverage/lcov.info,ui/coverage/lcov.info \
            -Dsonar.exclusions=**/node_modules/**,**/__tests__/** \
            -Dsonar.coverage.exclusions=**/tests/**,**/__tests__/**,**/*.test.*,**/*.spec.*  
```
Siendo: 


`Dsonar.projectKey:`:Identifica de forma única el proyecto en SonarCloud. Formato: <organization-key>_<project-name> (recomendado). Ejemplo: devopsx-keepcoding_martian-bank es el proyecto martian-bank dentro de la organización devopsx-keepcoding.

`Dsonar.sources:` Especifica la ruta de las carpetas o archivos que contienen el código fuente que será analizado.
Valor: "." significa que se analizará el código en el directorio raíz del proyecto. También puede ser una ruta específica, como src/.

`Dsonar.host.url:` Define la URL del servidor de SonarQube o SonarCloud. Valor: ${{ secrets.SONAR_HOST_URL }} toma el valor de un secret configurado (por ejemplo: https://sonarcloud.io para SonarCloud).

`Dsonar.organization=devopsx-keepcoding:`
Indica la organización a la que pertenece el proyecto en SonarCloud. Ejemplo: devopsx-keepcoding es la organización registrada en SonarCloud.

`Dsonar.token:` Es el token de autenticación necesario para ejecutar el análisis. Valor: ${{ secrets.SONAR_TOKEN }} obtiene el token desde los secretos configurados en tu pipeline o sistema CI/CD.

`Dsonar.javascript.lcov.reportPaths:` Define las rutas de los informes de cobertura de código generados en formato LCOV (utilizado comúnmente para proyectos JavaScript/TypeScript).
Valor: customer-auth/coverage/lcov.info: Ruta al archivo lcov.info generado para el módulo customer-auth.
ui/coverage/lcov.info: Ruta al archivo lcov.info generado para el módulo ui. Propósito: Esto permite a Sonar analizar la cobertura de pruebas del código fuente.

`Dsonar.exclusions:`Especifica rutas o patrones de archivos que deben excluirse del análisis.
Valor:
**/node_modules/**: Excluye el contenido de la carpeta node_modules (librerías instaladas por npm/yarn).
**/__tests__/**: Excluye el contenido de las carpetas que contienen archivos de prueba, como __tests__.

`Dsonar.coverage.exclusions:`Especifica rutas o patrones de archivos que deben excluirse del análisis de cobertura de código.
Valor:
Vacío aquí, pero se podría usar para excluir archivos o carpetas que no deben considerarse en las métricas de cobertura de pruebas.
Ejemplo: **/generated/**,**/*.spec.js para excluir archivos generados y archivos de pruebas unitarias.

_______

Se tendrá que configurar en GitHub los secrets correspondientes al token generado en el paso anterior, al registrar el proyecto y copiar la URL del servidor de SonarCloud 
    
Al ejecutar el escaner de SonarQube, se podran observar en el dashboard de SonarCloud en el proyecto Martian Bank los resultados del escaner. 