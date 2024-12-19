
# ¿Qué es GitOps?  
GitOps es una **metodología de DevOps** que utiliza **Git como fuente única de verdad** para gestionar la infraestructura y las aplicaciones. La idea principal es que cualquier cambio en la infraestructura o en las aplicaciones se define como **código declarativo** (YAML, JSON, etc.) y se almacena en un repositorio de Git.  

## Principales principios de GitOps:
1. **Repositorio central (Single Source of Truth):** Todo lo necesario para desplegar y gestionar un sistema está en Git.
2. **Automatización:** Los cambios en Git desencadenan procesos automáticos para aplicar el estado deseado en el clúster.
3. **Auditoría:** Git actúa como un registro histórico de todos los cambios, facilitando auditorías y recuperación ante desastres.
4. **Estado deseado:** Las herramientas de GitOps aseguran que el entorno real coincida con lo declarado en Git.



## ¿Qué es ArgoCD?  
**ArgoCD** es una herramienta de **entrega continua (CD)** diseñada específicamente para implementar GitOps en clústeres de Kubernetes.  

#### Características clave de ArgoCD:
1. **Sincronización de estados:** ArgoCD asegura que el estado actual de Kubernetes coincida con el estado definido en los archivos de configuración en Git.
2. **Monitoreo en tiempo real:** Detecta automáticamente desviaciones entre el clúster y los manifiestos de Git.
3. **Deployments automáticos:** Cuando haces un `git push` de un cambio, ArgoCD puede aplicar esos cambios al clúster de Kubernetes.
4. **Interfaz visual:** Ofrece una interfaz gráfica que permite ver y gestionar el estado del clúster.



## ¿Cómo funciona GitOps + ArgoCD?  
1. **Definición del estado deseado:** Escribes manifiestos de Kubernetes (o Helm Charts, Kustomize, etc.) que describen tus aplicaciones e infraestructura, y los guardas en un repositorio de Git.  
2. **Conexión con ArgoCD:** Configuras ArgoCD para que observe tu repositorio de Git.  
3. **Sincronización automática:** Cuando haces cambios en Git, ArgoCD los detecta y aplica automáticamente esos cambios al clúster.
4. **Monitoreo continuo:** ArgoCD verifica constantemente que el estado del clúster coincida con el repositorio. Si alguien realiza un cambio manual en el clúster, ArgoCD lo marcará como **desviado** y podrá corregirlo automáticamente.

💡 **Beneficios combinados:**  
- **Automatización extrema:** Los procesos manuales desaparecen.  
- **Consistencia y confiabilidad:** El repositorio Git se convierte en la única fuente de verdad.  
- **Auditoría clara:** Todo está versionado y documentado en Git.  


