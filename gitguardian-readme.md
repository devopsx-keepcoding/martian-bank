# Configuración y Uso de GitGuardian en Workflows de GitHub Actions

Este documento describe cómo configurar y utilizar GitGuardian para escanear secretos expuestos en un repositorio mediante un workflow de GitHub Actions.

## Descripción del Job

El siguiente job utiliza GitGuardian CLI para escanear repositorios en busca de secretos expuestos.

### Código del Job
```yaml
secrets_scan:
    name: Scan for exposed secrets
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install GitGuardian CLI
        run: pip install ggshield

      - name: Run GitGuardian secret scan
        env: 
          GITGUARDIAN_API_KEY: ${{ secrets.CI_GUARDIAN_API }}  
        run: ggshield secret scan repo .
```

### Explicación de los apartados

1. **`name: Scan for exposed secrets`**:
   - Asigna un nombre descriptivo al job.

2. **`runs-on: ubuntu-latest`**:
   - Define el sistema operativo donde se ejecutará el job. En este caso, se utiliza una máquina virtual basada en Ubuntu.

3. **Steps**:
   - **Checkout code**:
     - Usa la acción `actions/checkout@v3` para clonar el repositorio en la máquina virtual donde se ejecutará el job.
   - **Install GitGuardian CLI**:
     - Instala la herramienta CLI de GitGuardian, `ggshield`, usando pip.
   - **Run GitGuardian secret scan**:
     - Escanea el repositorio en busca de secretos expuestos utilizando el comando `ggshield secret scan repo .`.
     - La variable de entorno `GITGUARDIAN_API_KEY` es requerida para autenticar con GitGuardian. Este valor se obtiene de los `secrets` configurados en el repositorio de GitHub.

---

## Configuración de GitGuardian

### Paso 1: Registro en GitGuardian
1. Accede a [https://www.gitguardian.com/](https://www.gitguardian.com/).
2. Haz clic en "Sign Up" y completa el formulario de registro.
3. Confirma tu cuenta a través del correo electrónico que recibirás.

### Paso 2: Generar una API Key
1. Inicia sesión en el dashboard de GitGuardian.
2. Ve a la sección "API" o "API Keys" desde el menú principal.
3. Haz clic en "Generate API Key".
4. Asigna un nombre a tu API Key, como "CI/CD Integration".
5. Copia la API Key generada y guárdala de forma segura.

### Paso 3: Configurar el Secret en GitHub
1. Accede a tu repositorio en GitHub.
2. Ve a la pestaña `Settings` > `Secrets and variables` > `Actions`.
3. Haz clic en "New repository secret".
4. Introduce los siguientes valores:
   - **Name**: `CI_GUARDIAN_API`
   - **Value**: Pega la API Key generada en GitGuardian.
5. Guarda el secret.

### Paso 4: Configurar el Workflow
1. Copia el código YAML proporcionado en la sección anterior.
2. Asegúrate de que el workflow esté guardado en `.github/workflows/secrets_scan.yml` dentro de tu repositorio.
3. Realiza un commit del archivo.

---

## Visualización de Reportes en el Dashboard
1. Inicia sesión en el dashboard de GitGuardian.
2. Ve a la sección "Incidents" para revisar los secretos detectados.
3. Haz clic en cada incidente para ver detalles, como el archivo y línea donde fue encontrado el secreto.
4. Marca los incidentes como "resolved" o "ignored" según sea necesario.

---

## Notas Finales
- **Documentación Oficial**: Para más detalles sobre GitGuardian CLI y sus capacidades, consulta la [documentación oficial](https://docs.gitguardian.com/).
- **Solución de Problemas**:
  - Verifica que la API Key esté configurada correctamente como un secret en GitHub.
  - Asegúrate de que `ggshield` esté instalado y funcional ejecutando `ggshield --version` localmente.
  - Revisa los logs del workflow en GitHub Actions para identificar errores.

Con esta configuración, GitGuardian escaneará automáticamente el repositorio durante cada ejecución del workflow, ayudándote a identificar y mitigar riesgos relacionados con secretos expuestos.


