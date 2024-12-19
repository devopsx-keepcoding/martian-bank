# Construcción y Publicación de Imágenes Docker con GitHub Actions

Este documento detalla el workflow para construir y publicar imágenes Docker utilizando GitHub Actions. El job asegura que las imágenes estén actualizadas y versionadas correctamente para múltiples módulos de un monorepo.

## Descripción del Job

El job `docker-build` realiza las siguientes tareas:
1. Se ejecuta después de otros jobs (`lint`, `unit-test-customer-auth`, `unit-test-ui`, `semantic-release`).
2. Construye y publica imágenes Docker versionadas para los módulos especificados.

### Código del Workflow
```yaml
docker-build:
    name: Build and Push Docker Images
    runs-on: ubuntu-latest
    env:
      GITHUB_TOKEN: ${{ secrets.GH_TOKEN }} 
    needs: [lint, unit-test-customer-auth, unit-test-ui, semantic-release] # Se ejecuta después de lint y tests
    strategy:
      matrix:
        module: [accounts, atm-locator, customer-auth, dashboard, loan, nginx, transactions, ui]
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20.8.1  

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2 

      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Install dependencies
        run: npm ci    
      
      - name: Fetch and update remote branch
        run: |
          git fetch origin ${{ github.ref_name }}
          git checkout ${{ github.ref_name }}
          git pull origin ${{ github.ref_name }}

      - name: Verify branch sync
        run: |
          git fetch origin
          LOCAL=$(git rev-parse HEAD)
          REMOTE=$(git rev-parse origin/${{ github.ref_name }})
          if [ "$LOCAL" != "$REMOTE" ]; then
            echo "Local branch is out of sync with the remote branch."
            exit 1
          fi
          echo "Branches are in sync."
      
      - name: Determine Module Version
        id: version
        working-directory: ./${{ matrix.module }}
        run: |
          VERSION=$(npx semantic-release --dry-run | grep -Po '(?<=The next release version is )[^ ]+')
          if [ -z "$VERSION" ]; then
            echo "Error: VERSION is not generated for ${{ matrix.module }}."
            exit 1
          fi
          echo "VERSION=$VERSION" >> $GITHUB_ENV
          echo "Determined version for ${{ matrix.module }}: $VERSION"    
   
      - name: Build and Push Docker Image
        run: |
          if [ -z "${{ env.VERSION }}" ]; then
            echo "Error: VERSION is not set."
            exit 1
          fi

          docker build -f ${{ matrix.module }}/Dockerfile -t devopsxkeepcoding/martian-bank:${{ matrix.module }}-${{ env.VERSION }} .
          docker push devopsxkeepcoding/martian-bank:${{ matrix.module }}-${{ env.VERSION }}
```

### Explicación de los Componentes

#### **`name: Build and Push Docker Images`**
- Define un nombre descriptivo para el job.

#### **`runs-on: ubuntu-latest`**
- Especifica que el workflow se ejecutará en un sistema operativo basado en Ubuntu.

#### **`env`**
- **`GITHUB_TOKEN`**: Se utiliza para autenticar acciones relacionadas con GitHub.

#### **`needs`**
- Especifica que este job depende de la finalización exitosa de otros jobs (`lint`, `unit-test-customer-auth`, `unit-test-ui`, `semantic-release`).

#### **`strategy.matrix`**
- Define una matriz para ejecutar este job en paralelo para múltiples módulos.

#### **Steps**
1. **Checkout code**:
   - Usa `actions/checkout@v3` para clonar el repositorio completo.
   - La opción `fetch-depth: 0` asegura que se descargue todo el historial del repositorio.

2. **Set up Node.js**:
   - Configura Node.js versión `20.8.1` usando `actions/setup-node@v3`.

3. **Set up Docker Buildx**:
   - Configura Docker Buildx, necesario para construir imágenes Docker multiplataforma.

4. **Log in to Docker Hub**:
   - Usa `docker/login-action@v2` para autenticar con Docker Hub.
   - Requiere los secretos `DOCKER_USERNAME` y `DOCKER_PASSWORD` configurados en el repositorio.

5. **Install dependencies**:
   - Ejecuta `npm ci` para instalar las dependencias definidas en el archivo `package-lock.json`.

6. **Fetch and update remote branch**:
   - Asegura que la rama local esté sincronizada con la rama remota en GitHub.

7. **Verify branch sync**:
   - Verifica que las ramas local y remota estén en sincronía antes de proceder.

8. **Determine Module Version**:
   - Usa `npx semantic-release --dry-run` para determinar la siguiente versión del módulo.
   - La versión se guarda en la variable de entorno `VERSION`.

9. **Build and Push Docker Image**:
   - Construye la imagen Docker utilizando el `Dockerfile` del módulo.
   - Publica la imagen en Docker Hub con el nombre `devopsxkeepcoding/martian-bank:<module>-<version>`.

---

## Configuración Requerida

### Requisitos Locales
1. **Node.js y npm**:
   - Instala Node.js versión `20.8.1`.
   - Verifica la instalación:
     ```bash
     node -v
     npm -v
     ```

2. **Docker**:
   - Instala Docker y verifica la instalación:
     ```bash
     docker --version
     ```

3. **Semantic Release**:
   - Instala `semantic-release` y sus plugins:
     ```bash
     npm install -g semantic-release @semantic-release/github @semantic-release/npm
     ```

4. **Configura tus módulos**:
   - Asegúrate de que cada módulo tenga un `Dockerfile` y esté configurado para Semantic Release.

### Requisitos en el Repositorio Remoto
1. **Secrets en GitHub**:
   - Configura los siguientes secretos en `Settings > Secrets and variables > Actions`:
     - **`GH_TOKEN`**: Token personal de GitHub con permisos de repositorio.
     - **`DOCKER_USERNAME`**: Nombre de usuario de Docker Hub.
     - **`DOCKER_PASSWORD`**: Contraseña de Docker Hub.

2. **Permisos de Repositorio**:
   - Asegúrate de que GitHub Actions tenga acceso de lectura/escritura al repositorio.

3. **Estructura del Repositorio**:
   - Cada módulo debe tener:
     - Un `Dockerfile` configurado para construir la imagen.
     - Dependencias correctamente definidas en `package.json`.

---

## Ejecución y Verificación

1. **Ejecutar el Workflow**:
   - Realiza un commit en la rama configurada (por defecto, `main`). Esto activará automáticamente el workflow.

2. **Verificar el Resultado**:
   - Ve a la pestaña `Actions` en el repositorio para monitorear la ejecución del workflow.
   - Revisa los logs para cada módulo.

3. **Comprobar las Imágenes Docker**:
   - Verifica que las imágenes estén disponibles en Docker Hub bajo el nombre `devopsxkeepcoding/martian-bank:<module>-<version>`.

---

## Solución de Problemas

- **Error de Autenticación**:
  - Verifica que los secretos `DOCKER_USERNAME` y `DOCKER_PASSWORD` estén configurados correctamente.

- **Version no Generada**:
  - Asegúrate de que los mensajes de commit sigan el estándar de Conventional Commits.
  - Verifica que Semantic Release esté configurado correctamente en cada módulo.

Con esta configuración, las imágenes Docker se construirán y publicarán automáticamente, garantizando un flujo de trabajo eficiente y versionado adecuado.


