# Configuración y Uso del Job de Linting con GitHub Actions

Este documento detalla el uso del job de linting para verificar la calidad del código mediante ESLint en un entorno de integración continua utilizando GitHub Actions.

## Descripción del Job

El siguiente job se encarga de realizar un análisis estático del código utilizando ESLint. Permite ejecutar linting en varios módulos de forma paralela gracias al uso de matrices en GitHub Actions.

### Código del Job
```yaml
lint:
    timeout-minutes: 15
    name: Lint code
    runs-on: ubuntu-latest
    strategy:
        matrix:
            module: [atm-locator,customer-auth,ui]
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20.8.1'

      - name: Install dependencies for ${{ matrix.module }}
        working-directory: ./${{ matrix.module }}
        run: npm ci --no-audit --no-fund

      - name: Run ESLint for ${{ matrix.module }}
        working-directory: ./${{ matrix.module }}
        run: npx eslint .
```

### Explicación de los Componentes

1. **`timeout-minutes: 15`**:
   - Establece un tiempo máximo de ejecución para el job. Si el job tarda más de 15 minutos, se cancelará automáticamente.

2. **`runs-on: ubuntu-latest`**:
   - Indica el sistema operativo que se utilizará para ejecutar el job. En este caso, se utiliza una máquina virtual con Ubuntu.

3. **`strategy.matrix`**:
   - Define una matriz que permite ejecutar el job de forma paralela para diferentes valores del parámetro `module`. En este ejemplo, los módulos son `atm-locator`, `customer-auth` y `ui`.

4. **Steps**:
   - **Checkout code**:
     - Usa la acción `actions/checkout@v3` para clonar el repositorio en la máquina virtual.
   - **Set up Node.js**:
     - Usa la acción `actions/setup-node@v3` para configurar Node.js en la máquina virtual.
     - Se especifica la versión `20.8.1` de Node.js en el atributo `node-version`.
   - **Install dependencies for ${{ matrix.module }}**:
     - Cambia el directorio de trabajo al módulo correspondiente especificado en la matriz.
     - Ejecuta `npm ci` para instalar las dependencias definidas en el archivo `package-lock.json`.
     - Se utilizan las opciones `--no-audit` y `--no-fund` para deshabilitar auditorías y notificaciones.
   - **Run ESLint for ${{ matrix.module }}**:
     - Cambia al directorio del módulo y ejecuta ESLint utilizando `npx eslint .`.

---

## Requisitos para Ejecutar el Job

### Requisitos Locales
1. **Instalar Node.js**:
   - Descarga e instala la versión `20.8.1` de Node.js desde [https://nodejs.org/](https://nodejs.org/).
   - Verifica la instalación ejecutando:
     ```bash
     node -v
     npm -v
     ```

2. **Instalar ESLint**:
   - Asegúrate de que cada módulo (`atm-locator`, `customer-auth`, `ui`) tenga ESLint configurado en su archivo `package.json`.
   - Verifica que los archivos `.eslintrc.js` o equivalentes estén configurados correctamente en cada módulo.

3. **Dependencias locales**:
   - En cada módulo, instala las dependencias ejecutando:
     ```bash
     npm ci --no-audit --no-fund
     ```

### Requisitos en el Repositorio Remoto
1. **Estructura del Repositorio**:
   - Cada módulo (`atm-locator`, `customer-auth`, `ui`) debe estar en el nivel raíz o en subdirectorios definidos dentro del repositorio.
   - Verifica que cada módulo contenga un archivo `package-lock.json` actualizado.

2. **Configuración del Workflow**:
   - Asegúrate de que el archivo del workflow esté ubicado en `.github/workflows/lint.yml`.

3. **Acciones de GitHub**:
   - Las acciones `actions/checkout@v3` y `actions/setup-node@v3` deben estar disponibles. No requieren instalación adicional, pero asegúrate de usar las versiones correctas especificadas en el job.

### Configuración en GitHub
1. **Habilitar GitHub Actions**:
   - Ve a la pestaña `Actions` en el repositorio y asegúrate de que los workflows estén habilitados.

2. **Permisos de Repositorio**:
   - Verifica que las acciones tengan acceso de lectura/escritura al código del repositorio en los ajustes de GitHub Actions.

---

## Ejecución y Verificación

1. **Ejecutar el Workflow**:
   - Realiza un commit con cambios en el repositorio. Esto activará automáticamente el workflow.

2. **Verificar el Resultado**:
   - Ve a la pestaña `Actions` del repositorio y selecciona el workflow "Lint code".
   - Observa los resultados para cada módulo en la matriz de ejecución.

3. **Solución de Problemas**:
   - **Error: Dependencias no instaladas**:
     - Verifica que el archivo `package-lock.json` esté actualizado y que `npm ci` se ejecute correctamente en cada módulo.
   - **Error: ESLint no configurado**:
     - Revisa el archivo `.eslintrc.js` o equivalente en el módulo afectado.
   - **Error: Node.js no instalado**:
     - Asegúrate de que la versión especificada en `setup-node` sea compatible con el proyecto.

---

Con esta configuración, el job de linting garantiza que cada módulo del repositorio cumpla con los estándares de calidad definidos por ESLint.

