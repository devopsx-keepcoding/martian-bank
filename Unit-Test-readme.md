# Ejecución de Unit Tests con GitHub Actions

Este documento detalla el workflow para ejecutar pruebas unitarias con cobertura de código utilizando GitHub Actions. El manifiesto incluye dos jobs separados: uno para `customer-auth` y otro para `ui`.

## Descripción del Manifiesto

El manifiesto está diseñado para ejecutar pruebas unitarias y generar reportes de cobertura para dos módulos distintos (`customer-auth` y `ui`). A continuación, se explica cada sección:

### Código del Manifiesto

#### Job: `unit-test-customer-auth`

```yaml
unit-test-customer-auth:
  name: Run Unit Tests for auth
  runs-on: ubuntu-latest

  steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Node.js  
      uses: actions/setup-node@v3
      with:
        node-version: '20.8.1'

    - name: Install dependencies
      working-directory: ./customer-auth
      run: npm ci

    - name: Run tests with coverage
      working-directory: ./customer-auth
      run: npm test

    - name: Upload coverage report
      uses: actions/upload-artifact@v3
      with:
        name: customer-auth-coverage-report
        path: customer-auth/coverage
```

#### Job: `unit-test-ui`

```yaml
unit-test-ui:
  name: Run Unit Tests for ui
  runs-on: ubuntu-latest

  steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Node.js  
      uses: actions/setup-node@v3
      with:
        node-version: '20.8.1'

    - name: Install dependencies
      working-directory: ./ui
      run: npm ci

    - name: Run tests with coverage
      working-directory: ./ui
      run: npm test

    - name: Upload coverage report
      uses: actions/upload-artifact@v3
      with:
        name: ui-coverage-report
        path: ui/coverage
```

### Explicación de los Componentes

#### **`name`**
- Proporciona un nombre descriptivo al job, como "Run Unit Tests for auth" y "Run Unit Tests for ui".

#### **`runs-on`**
- Especifica el sistema operativo en el que se ejecutarán los jobs (`ubuntu-latest`).

#### Steps
1. **Checkout code**:
   - Usa `actions/checkout@v3` para clonar el repositorio en el entorno de ejecución.

2. **Set up Node.js**:
   - Usa `actions/setup-node@v3` para configurar la versión `20.8.1` de Node.js.

3. **Install dependencies**:
   - Usa `npm ci` para instalar las dependencias listadas en el archivo `package-lock.json` del módulo correspondiente.
   - La opción `working-directory` asegura que el comando se ejecute en el directorio del módulo.

4. **Run tests with coverage**:
   - Ejecuta los tests configurados en el módulo con el comando `npm test`.

5. **Upload coverage report**:
   - Usa `actions/upload-artifact@v3` para cargar el reporte de cobertura generado en la carpeta `coverage` del módulo correspondiente.

---

## Configuración Requerida

### Requisitos Locales

1. **Node.js y npm**:
   - Instala Node.js versión `20.8.1` desde [Node.js](https://nodejs.org/).
   - Verifica la instalación:
     ```bash
     node -v
     npm -v
     ```

2. **Configuración de los Módulos**:
   - Cada módulo (`customer-auth`, `ui`) debe contener:
     - Un archivo `package.json` con scripts configurados para ejecutar pruebas unitarias:
       ```json
       "scripts": {
         "test": "jest --coverage"
       }
       ```
     - Un archivo `package-lock.json` actualizado.
     - Dependencias relacionadas con pruebas unitarias, como `jest` y `eslint`.

3. **Cobertura de Código**:
   - Configura el framework de pruebas (por ejemplo, `jest`) para generar reportes de cobertura en la carpeta `coverage`.
     - Ejemplo de configuración en `jest.config.js`:
       ```javascript
       module.exports = {
         collectCoverage: true,
         coverageDirectory: "coverage",
       };
       ```

### Requisitos en el Repositorio Remoto

1. **Estructura del Repositorio**:
   - Asegúrate de que los directorios `customer-auth` y `ui` estén correctamente ubicados en el nivel raíz o como subdirectorios del repositorio.

2. **Archivo del Workflow**:
   - Guarda el manifiesto YAML en la ruta `.github/workflows/unit-tests.yml` del repositorio.

### Configuración en GitHub

1. **Habilitar GitHub Actions**:
   - Ve a la pestaña `Actions` en tu repositorio y habilita los workflows.

2. **Permisos del Repositorio**:
   - Configura los permisos para que GitHub Actions tenga acceso de lectura/escritura al repositorio.

---

## Ejecución y Verificación

1. **Ejecutar el Workflow**:
   - Realiza un commit en la rama del repositorio para activar automáticamente el workflow.

2. **Revisar Resultados**:
   - Ve a la pestaña `Actions` en el repositorio y selecciona el workflow correspondiente.
   - Verifica los logs para asegurarte de que las pruebas y la carga de reportes de cobertura se ejecutaron correctamente.

3. **Descargar los Reportes de Cobertura**:
   - Los reportes de cobertura estarán disponibles como artefactos en la sección "Summary" del job ejecutado.

---

## Solución de Problemas

- **Error al Instalar Dependencias**:
  - Asegúrate de que el archivo `package-lock.json` esté actualizado y de que las dependencias estén definidas correctamente en `package.json`.

- **Fallo en las Pruebas**:
  - Verifica que el script `test` en `package.json` esté correctamente configurado.

- **Reporte de Cobertura no Generado**:
  - Revisa la configuración de `jest` o del framework de pruebas utilizado para asegurarte de que la cobertura esté habilitada.

Con esta configuración, los tests unitarios y los reportes de cobertura estarán completamente automatizados y disponibles para revisión.

