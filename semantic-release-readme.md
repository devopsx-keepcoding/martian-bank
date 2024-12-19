# Configuración y Uso de Semantic Release con GitHub Actions

Este documento detalla el workflow para automatizar la gestión de versiones y publicaciones en múltiples módulos utilizando Semantic Release y GitHub Actions.

## Descripción del Workflow

El manifiesto está diseñado para ejecutar Semantic Release en paralelo para diferentes módulos de un monorepo, gestionando automáticamente las versiones y las publicaciones en GitHub y npm.

### Código del Workflow
```yaml
semantic-release:
    name: Semantic Release
    runs-on: ubuntu-latest
    strategy:
      matrix:
        module: [accounts, atm-locator, customer-auth, dashboard, loan, nginx, transactions, ui]
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20.8.1'

      - name: Install dependencies for ${{ matrix.module }}
        working-directory: ./${{ matrix.module }}
        run: npm ci

      - name: Run Semantic Release for ${{ matrix.module }}
        working-directory: ./${{ matrix.module }}
        run: npx semantic-release --dry-run
        env:
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Explicación de los Componentes

#### **`name: Semantic Release`**
- Asigna un nombre descriptivo al job.

#### **`runs-on: ubuntu-latest`**
- Especifica el sistema operativo que se usará para ejecutar el workflow.

#### **`strategy.matrix`**
- Permite ejecutar el workflow en paralelo para múltiples módulos especificados en la matriz (`accounts`, `atm-locator`, `customer-auth`, etc.).

#### **Steps**
1. **Checkout code**:
   - Usa `actions/checkout@v3` para clonar el repositorio en la máquina virtual.

2. **Set up Node.js**:
   - Usa `actions/setup-node@v3` para instalar Node.js versión `20.8.1`.

3. **Install dependencies**:
   - Instala las dependencias de cada módulo especificado en la matriz usando `npm ci`.
   - Cambia el directorio de trabajo al módulo correspondiente con `working-directory`.

4. **Run Semantic Release**:
   - Ejecuta `npx semantic-release --dry-run` para simular el proceso de publicación.
   - Las variables de entorno `GITHUB_TOKEN` y `NODE_AUTH_TOKEN` se utilizan para autenticar con GitHub y npm, respectivamente.

---

## Configuración Requerida

### Requisitos Locales

1. **Instalar Node.js**:
   - Descarga e instala Node.js versión `20.8.1` desde [Node.js](https://nodejs.org/).
   - Verifica la instalación:
     ```bash
     node -v
     npm -v
     ```

2. **Configurar Semantic Release en cada módulo**:
   - Asegúrate de que cada módulo tenga:
     - Un archivo `package.json` con la configuración necesaria para Semantic Release.
     - Dependencias relacionadas con Semantic Release instaladas:
       ```bash
       npm install semantic-release @semantic-release/npm @semantic-release/github --save-dev
       ```
     - Un archivo `.releaserc` o `.releaserc.json` en cada módulo con la configuración:
       ```json
       {
         "branches": ["main"],
         "plugins": [
           "@semantic-release/commit-analyzer",
           "@semantic-release/release-notes-generator",
           "@semantic-release/changelog",
           "@semantic-release/npm",
           "@semantic-release/github"
         ]
       }
       ```

3. **Estándar de commits**:
   - Usa [Conventional Commits](https://www.conventionalcommits.org/) para que Semantic Release pueda analizar los mensajes de commit.

### Requisitos en el Repositorio Remoto

1. **Configurar Secrets en GitHub**:
   - Ve a la pestaña `Settings` > `Secrets and variables` > `Actions` en el repositorio.
   - Añade los siguientes secrets:
     - **`GH_TOKEN`**: Token personal de GitHub con permisos de `repo` y `workflow`.
     - **`NPM_TOKEN`**: Token de autenticación para publicar paquetes en npm.

2. **Permisos del Repositorio**:
   - Asegúrate de que las acciones tengan acceso de lectura/escritura al repositorio.

3. **Archivo del Workflow**:
   - Guarda el manifiesto YAML en la ruta `.github/workflows/semantic-release.yml` del repositorio.

### Configuración de Tokens

#### Generar un Token de GitHub
1. Ve a [https://github.com/settings/tokens](https://github.com/settings/tokens).
2. Haz clic en "Generate new token".
3. Selecciona los siguientes scopes:
   - `repo`
   - `workflow`
4. Copia el token generado y configúralo como `GH_TOKEN` en los secrets de GitHub.

#### Generar un Token de npm
1. Ve a [https://www.npmjs.com/settings](https://www.npmjs.com/settings).
2. Genera un nuevo token con permisos de publicación.
3. Copia el token generado y configúralo como `NPM_TOKEN` en los secrets de GitHub.

---

## Ejecución y Verificación

1. **Ejecutar el Workflow**:
   - Realiza un commit en la rama configurada (por defecto, `main`). Esto activará automáticamente el workflow.

2. **Verificar el Resultado**:
   - Ve a la pestaña `Actions` del repositorio y selecciona el workflow "Semantic Release".
   - Revisa los logs para cada módulo en la matriz de ejecución.

3. **Revisión de Publicaciones**:
   - Los cambios publicados estarán disponibles en:
     - GitHub Releases.
     - npm (si aplica).

---

## Solución de Problemas

- **Error en la Publicación**:
  - Verifica que los tokens `GH_TOKEN` y `NPM_TOKEN` estén configurados correctamente en los secrets de GitHub.

- **Error en los Commits**:
  - Asegúrate de que los mensajes de commit sigan el estándar de Conventional Commits.

- **Dependencias Faltantes**:
  - Asegúrate de que Semantic Release y sus plugins estén instalados en cada módulo.

Con esta configuración, Semantic Release automatizará la gestión de versiones y publicaciones, reduciendo errores y mejorando la eficiencia del proceso de desarrollo.


