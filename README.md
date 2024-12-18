# Martian Bank: Cloud-Native Microservices Demo Application

## 🚀 Descripción General
Martian Bank es una aplicación de demostración de microservicios diseñada para ilustrar prácticas de desarrollo cloud-native y arquitecturas de Kubernetes. 
<span style="color:red">(Rellenar mas resumen)</span>

![Diagrama de la arquitectura](images/diagrama_de_la_arquitectura.png)

### Estructura del Proyecto

<span style="color:red">(Modificar estructura)</span>

```bash
martian-bank/
├── charts/                 # Helm charts
├── services/               # Microservicios
│   ├── accounts/
│   ├── atm-locator/
│   ├── customer-auth/
│   ├── dashboard/
│   ├── loan/
│   └── transactions/
├── ui/                     # Frontend React
└── infrastructure/         # Configuraciones de infraestructura
```

## 🌐 Arquitectura de Microservicios

### Servicios Backend

| **Servicio**       | **Tecnología** | **Descripción**                 |
|---------------------|----------------|---------------------------------|
| `accounts`         | Flask (Python) | Gestión de cuentas bancarias   |
| `atm-locator`      | Node.js        | Localización de cajeros         |
| `customer-auth`    | Node.js        | Autenticación de usuarios       |
| `dashboard`        | Flask (Python) | Panel de control                |
| `loan`             | Flask (Python) | Gestión de préstamos            |
| `transactions`     | Flask (Python) | Procesamiento de transacciones  |

### Componentes Frontend
- **UI**: Aplicación React
- **Nginx**: Reverse proxy para servicios backend y frontend

## 📦 Requisitos Previos
- Docker
- Kubernetes (Minikube recomendado)
- Helm
- `kubectl`
- SealedSecrets

## 🔧 Instalación

<span style="color:red">(Resumen)</span>

[Guía de Instalación](docs/GuiaInstalacion.md)

## 🌟 Features - Funcionalidades

<span style="color:red">(poner en modo link solo las guias)</span>

### Mínimas

1. [CI](docs/ci.md)
   - Seguridad: GitGuardian
   - Linting
   - Testing: unit test
   - Análisis de código estático: SonarCloud
2. [CD: Argo CD](docs/cd.md)
3. HTTPS y certificados
4. Despliegue de aplicación en AWS EKS - TERRAFORM
5. [HELM-CHART](docs/helm-chart.md)
   - Gestión de Configuración Sensible - sealed-secrets
   - Probar Configuración Sensibles con secret-store-csi-driver
   - Añadir init container a microservicios para que espere a mongodb a estar disponible
   - Inicializar mongodb con tabla de clientes
   - Alta Disponibilidad (HA) - número mínimo de réplicas de cada microservicio
     - Resiliencia de la Aplicación - Health checks - liveness y readiness
     - Controlar en qué nodos se ejecutarán los pods (Taints, Tolerations & AffinityRules)
     - Probar en local en multi node minikube cluster
6. [Monitorización](docs/monitorizacion.md)

### Extras

1. Envío de alerta después de algún evento
2. Implementar alguna estrategia de despliegue: Ex.: Blue/Green - Argo Rollouts
   - Blue: Martian Bank
   - Green: KeepCoding Bank (cambiar la UI a KeepCoding Bank)
3. Utilizar mongodb atlas en GCP en vez de desplegar mongo en el cluster
4. Backup de Mongodb
5. Escalabilidad vertical del cluster?
6. Versionado de aplicaciones automático con Semantic Release


## 🛠 Metodología
<span style="color:red">(Ejemplo chatgpt, crear propio!)</span>

En el desarrollo de la aplicación Martian Bank, hemos adoptado una metodología ágil que nos permite iterar rápidamente y adaptarnos a los cambios. A continuación, se describen algunos aspectos clave de nuestra metodología de trabajo:

1. **Planificación Colaborativa**: 
   - Antes de comenzar el desarrollo, realizamos sesiones de planificación donde todos los miembros del equipo contribuyen con ideas y sugerencias. Esto asegura que todos estén alineados con los objetivos del proyecto.

2. **Desarrollo Iterativo**:
   - Dividimos el trabajo en pequeñas iteraciones o sprints, lo que nos permite enfocarnos en funcionalidades específicas y realizar entregas frecuentes.

3. **Integración Continua (CI)**:
   - Implementamos herramientas como GitGuardian para asegurar la seguridad del código y realizar análisis de código estático con SonarCloud. También utilizamos linting y pruebas unitarias para mantener la calidad del código.

4. **Despliegue Continuo (CD)**:
   - Utilizamos Argo CD para gestionar el despliegue automático de nuestras aplicaciones en el clúster de Kubernetes, lo que nos permite realizar actualizaciones rápidas y seguras.

5. **Revisiones de Código**:
   - Cada cambio propuesto es revisado por al menos otro miembro del equipo antes de ser fusionado en la rama principal. Esto ayuda a detectar errores y mejorar la calidad del código.

6. **Documentación**:
   - Mantenemos una documentación clara y accesible para todos los miembros del equipo, lo que facilita la incorporación de nuevos desarrolladores y asegura que todos comprendan la arquitectura y las decisiones tomadas.

### Ejemplo de Trabajo

Durante el desarrollo del microservicio `accounts`, seguimos estos pasos:

- **Definición de Requisitos**: Se definieron claramente los requisitos funcionales y no funcionales.
- **Diseño**: Se elaboró un diagrama de arquitectura para visualizar cómo se integraría `accounts` con otros microservicios.
- **Implementación**: El desarrollo se realizó en ramas separadas, permitiendo a cada desarrollador trabajar en su propia funcionalidad sin interferir con otros.
- **Pruebas**: Se implementaron pruebas unitarias y se realizaron pruebas manuales para asegurar que el servicio funcionara como se esperaba.
- **Despliegue**: Una vez completadas las pruebas, se realizó un despliegue a través de Argo CD, permitiendo una integración fluida en el entorno de producción.

Este enfoque nos ha permitido mantener un alto nivel de calidad en nuestro código mientras respondemos rápidamente a los cambios en los requisitos o en el entorno.

## Conlusiones
<span style="color:red">(Crear Conlusiones)</span>