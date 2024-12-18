# Guía de Instalación de Martian Bank

Esta guía proporciona instrucciones para instalar Martian Bank en dos entornos diferentes: localmente usando Minikube y en AWS.

## Instalación Local en Cluster Minikube (3 nodos)

### 1. Crear el cluster Minikube

Creamos un cluster Minikube con 3 nodos: 1 nodo control-plane y 2 nodos worker.

```bash
minikube start --kubernetes-version='v1.28.3'
--cpus=4
--memory=4096
--addons="metrics-server,default-storageclass,storage-provisioner"
--nodes 3 -p martian-bank-test-3nodes
```

Este comando inicia un cluster Minikube con la versión específica de Kubernetes, recursos asignados y addons necesarios.

### 2. Activar el dashboard

Activamos el addon del dashboard para una mejor visualización del cluster.

```bash
minikube -p martian-bank-test-3nodes dashboard
```


Espera un poco a que los pods de metrics-server estén listos antes de acceder.

### 3. Acceder al dashboard

Accede al dashboard a través del navegador usando la URL proporcionada por el comando anterior. Por ejemplo:

```bash
http://127.0.0.1:42785/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/#/workloads?namespace=default
```


### 4. Etiquetar los nodos worker

Cambiamos la etiqueta de dos nodos a "worker" para diferenciarlos del nodo control-plane.

```bash
kubectl get nodes
kubectl label node martian-bank-test-3nodes-m02 node-role.kubernetes.io/worker=worker
kubectl label node martian-bank-test-3nodes-m03 node-role.kubernetes.io/worker=worker
```

Verifica los cambios:

```bash
kubectl get nodes
```

### 5. Asignar etiquetas adicionales a los nodos

Asignamos etiquetas key:value a los nodos worker para facilitar la selección en el despliegue.

```bash
kubectl label nodes martian-bank-test-3nodes-m02 role=worker
kubectl label nodes martian-bank-test-3nodes-m03 role=worker
```

### 6. Instalar el chart de Helm de la aplicación

Instalamos la aplicación usando Helm:

```bash
helm install martianbanktest martianbank-helm-chart
```

El chart de Helm está configurado para desplegar 1 pod por cada servicio solo en los nodos worker, con un escalado de 1 a 5 réplicas.

### 7. Acceder a la aplicación

Para acceder a la aplicación, ejecuta:

```bash
minikube -p martian-bank-test-3nodes tunnel
```

Este comando crea un túnel para acceder a los servicios del cluster desde tu máquina local.

## Instalación en AWS (Ejemplo CAMBIAR POR REAL) 

**Nota**: Esta sección es un ejemplo y deberá ser actualizada con los pasos reales en el futuro.

### 1. Configurar el Cluster EKS

Crea un cluster EKS en AWS usando la consola de AWS o la CLI:

```bash
eksctl create cluster --name martian-bank-cluster --region us-west-2 --nodegroup-name standard-workers --node-type t3.medium --nodes 3 --nodes-min 1 --nodes-max 4 --managed
```


### 2. Configurar kubectl

Configura kubectl para conectarse a tu cluster EKS:

```bash
aws eks --region us-west-2 update-kubeconfig --name martian-bank-cluster
```

### 3. Desplegar la aplicación

Usa Helm para desplegar la aplicación en el cluster EKS:

```bash
helm install martianbanktest martianbank-helm-chart
```

### 4. Configurar el balanceador de carga

AWS EKS creará automáticamente un balanceador de carga. Obtén la URL del balanceador:

```bash
kubectl get services
```


Usa la URL externa proporcionada para acceder a la aplicación.

## Recursos Adicionales

- [Documentación de Minikube para clusters multi-nodo](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/)
- [Tutorial para crear un cluster Kubernetes de 3 nodos con Minikube](https://medium.com/womenintechnology/create-a-3-node-kubernetes-cluster-with-minikube-8e3dc57d6df2)
- [Documentación oficial del Dashboard de Kubernetes](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)