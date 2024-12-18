
# Implementación de ArgoCD para Martian Bank

Este documento describe cómo implementar y utilizar ArgoCD para gestionar el despliegue de la aplicación Martian Bank. Incluye una explicación detallada del manifiesto proporcionado y los pasos necesarios para instalar, configurar y acceder a ArgoCD.

## Manifiesto de ArgoCD

A continuación, se explica cada sección del manifiesto utilizado para configurar ArgoCD:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: martian-bank
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/devopsx-keepcoding/martian-bank.git'
    targetRevision: develop
    path: martianbank-helm-chart
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: martian-bank
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

### `apiVersion` y `kind`
- **`apiVersion: argoproj.io/v1alpha1`**: Define la versión de la API de ArgoCD.
- **`kind: Application`**: Especifica que este manifiesto describe una aplicación gestionada por ArgoCD.

### `metadata`
- **`name: martian-bank`**: Nombre único de la aplicación en ArgoCD.
- **`namespace: argocd`**: Espacio de nombres donde se despliega la aplicación ArgoCD.

### `spec`
- **`project: default`**: Especifica que la aplicación pertenece al proyecto predeterminado de ArgoCD.
- **`source`**:
  - **`repoURL`**: URL del repositorio Git donde se encuentra el código y el chart de Helm de la aplicación.
  - **`targetRevision`**: Rama o commit específico del repositorio a utilizar (en este caso, `develop`).
  - **`path`**: Ruta dentro del repositorio donde se encuentra el chart de Helm (`martianbank-helm-chart`).
- **`destination`**:
  - **`server`**: Dirección del servidor de Kubernetes donde se desplegará la aplicación. `https://kubernetes.default.svc` es el clúster interno por defecto.
  - **`namespace`**: Espacio de nombres en el clúster donde se desplegará la aplicación (`martian-bank`).
- **`syncPolicy`**:
  - **`automated`**: Configura la sincronización automática.
    - **`prune`**: Limpia recursos obsoletos del clúster durante la sincronización.
    - **`selfHeal`**: Detecta y corrige automáticamente diferencias entre el estado del clúster y la configuración del repositorio.

---

## Instalación de ArgoCD

1. **Instalar ArgoCD**:
   ```bash
   kubectl create namespace argocd
   kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
   ```

2. **Verificar la instalación**:
   ```bash
   kubectl get pods -n argocd
   ```

3. **Configurar un port-forward para acceder al servidor de ArgoCD**:
   ```bash
   kubectl port-forward svc/argocd-server -n argocd 8080:443
   ```

4. **Obtener la contraseña inicial**:
   ```bash
   kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d; echo
   ```

5. **Acceder a la interfaz web**:
   - URL: [https://localhost:8080](https://localhost:8080)
   - Usuario: `admin`
   - Contraseña: obtenida en el paso anterior.

---

## Configuración de Tokens y Acceso

1. **Generar un token para la API de ArgoCD**:
   ```bash
   argocd account generate-token --account admin
   ```
   Guarda el token generado para integraciones externas.

2. **Conectar ArgoCD al repositorio Git**:
   ```bash
   argocd repo add https://github.com/devopsx-keepcoding/martian-bank.git \
       --username <username> \
       --password <password>
   ```

---

## Uso de ArgoCD

1. **Crear la aplicación usando el manifiesto**:
   ```bash
   kubectl apply -f martian-bank-application.yaml
   ```

2. **Verificar el estado de la aplicación**:
   ```bash
   argocd app get martian-bank
   ```

3. **Sincronizar manualmente la aplicación (si es necesario)**:
   ```bash
   argocd app sync martian-bank
   ```

4. **Ver el estado en la interfaz web**:
   - Navega a [https://localhost:8080](https://localhost:8080) y busca `martian-bank` en el panel de aplicaciones.

---

## Notas adicionales

- **Documentación oficial de ArgoCD**: [https://argo-cd.readthedocs.io](https://argo-cd.readthedocs.io)
- **Solución de problemas**:
  - Revisa los logs de los pods de ArgoCD:
    ```bash
    kubectl logs -n argocd <pod-name>
    ```
  - Verifica las reglas RBAC y permisos del namespace configurado.

Este README asegura que puedas implementar y administrar correctamente la aplicación Martian Bank utilizando ArgoCD.

