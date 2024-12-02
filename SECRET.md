# Secrets

https://github.com/bitnami-labs/sealed-secrets#installation

### 1. Instalar Sealed Secrets Controller
Asegúrate de que el controller de Sealed Secrets esté instalado en tu clúster de Kubernetes. Esto se hace con el siguiente comando:

```bash
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/latest/download/controller.yaml
```

verificar:
Confirma que el controller está funcionando correctamente. Puedes hacer esto ejecutando:

```bash
kubectl get pods -n kube-system
```

```bash
thomas@DESKTOP-UAOLP5T:~/MartianSecret/martian-bank$ kubectl get pods -n kube-system
NAME                                               READY   STATUS    RESTARTS       AGE
coredns-5dd5756b68-sp6xq                           1/1     Running   2 (111m ago)   111m
etcd-martian-bank-test-3nodes                      1/1     Running   0              112m
kindnet-5smxh                                      1/1     Running   0              111m
kindnet-dpgb4                                      1/1     Running   0              111m
kindnet-nfhpf                                      1/1     Running   0              111m
kube-apiserver-martian-bank-test-3nodes            1/1     Running   0              112m
kube-controller-manager-martian-bank-test-3nodes   1/1     Running   0              112m
kube-proxy-2ds52                                   1/1     Running   0              111m
kube-proxy-cgngr                                   1/1     Running   0              111m
kube-proxy-xp88f                                   1/1     Running   0              111m
kube-scheduler-martian-bank-test-3nodes            1/1     Running   0              112m
metrics-server-5749f6cc7d-xbqhv                    1/1     Running   3 (111m ago)   111m
sealed-secrets-controller-65b48d9b89-ffjmw         1/1     Running   0              56m
storage-provisioner                                1/1     Running   1 (111m ago)   112m
```

### 2.Instalar kubeseal en Linux

```bash
KUBESEAL_VERSION='0.23.0'
```

```bash
curl -OL "https://github.com/bitnami-labs/sealed-secrets/releases/download/v${KUBESEAL_VERSION:?}/kubeseal-${KUBESEAL_VERSION:?}-linux-amd64.tar.gz"
```

```bash
tar -xvzf kubeseal-${KUBESEAL_VERSION:?}-linux-amd64.tar.gz kubeseal
```

```bash
sudo install -m 755 kubeseal /usr/local/bin/kubeseal
```

si todo salio bien:
```bash
thomas@DESKTOP-UAOLP5T:~/MartianSecret/martian-bank$ kubeseal --version
kubeseal version: 0.23.0
```

### 3.Aplicar

Obtener certificado:

```bash
kubectl get secret -n kube-system sealed-secrets-keyvdrrn -o jsonpath='{.data.tls\.crt}' | base64 --decode > mycert.pem
```
O si no funciona:
```bash
kubectl exec -it sealed-secrets-controller-65b48d9b89-ffjmw -n kube-system -- cat /etc/sealed-secrets/tls.crt > mycert.pem
```


Cifrar tu Secret con kubeseal

```bash
kubectl create -f martianbank-helm-chart/templates/secrets.yaml --dry-run=client -o json | kubeseal --cert mycert.pem -o yaml > martianbank-helm-chart/templates/sealed-mongodb-secret.yaml
```

### Notas:

- Borrar el secrets.yaml? ya no hace falta al tenerlo encryptado. O ponerlo en el .gitignore
- No hace falta usar el values si tenemos el seal y las variables definidas ahi
- Verificar cada Deployment y el uso de las variables
- Comprobar los nombre usados para el secreto
- error al usar:
```bash
{{ .Release.Name }}-mongodb-secret
```
y al tener en secrets.yaml esto:
```bash
data:
  mongodb-root-username: {{ .Values.mongodb.rootUsername | b64enc | quote }}
  mongodb-root-password: {{ .Values.mongodb.rootPassword | b64enc | quote }}
```
- Al al final tener el seal-mongodb-screts.yaml no hace falta referenciar los valores desde values?

# Resumen del Proyecto

## Configuración de MongoDB con Sealed Secrets

1. **Creación del Secret**:
   - Se creó un Secret en Kubernetes que almacena las credenciales de MongoDB, incluyendo el nombre de usuario, la contraseña y el host.

2. **Implementación de Sealed Secrets**:
   - Se implementó **Sealed Secrets** para cifrar los secretos sensibles, lo que permite almacenar de forma segura las credenciales en un repositorio de código.

3. **Generación del SealedSecret**:
   - Se generó un archivo `sealed-mongodb-secret.yaml`, que contiene el SealedSecret cifrado, asegurando que las credenciales no se expongan en texto claro.

4. **Aplicación del SealedSecret**:
   - El SealedSecret se aplicó al clúster de Kubernetes, creando automáticamente un Secret normal a partir de él.

5. **Verificación del Funcionamiento**:
   - Se verificó que el pod de MongoDB se inició correctamente y está escuchando en el puerto adecuado, lo que indica que está operativo.

6. **Configuración de Helm**:
   - Se mantuvieron los valores de configuración (nombre de usuario, contraseña y host) en el archivo `values.yaml`, permitiendo una gestión más fácil y flexible de las credenciales.

## Resultados

- La instancia de MongoDB está funcionando correctamente y lista para aceptar conexiones.
- Se ha implementado una solución segura para la gestión de secretos utilizando Sealed Secr
