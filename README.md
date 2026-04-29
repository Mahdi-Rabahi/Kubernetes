# ☸ K8s Demo Notes — Application de Démonstration Kubernetes

> **Auteur : KHLIFI HOUCEM / FORMATEUR DEVSECOPS & CLOUD**

Application web complète conçue pour démontrer et manipuler les principaux objets Kubernetes dans un cas concret et pédagogique.

![Node.js](https://img.shields.io/badge/Node.js-20-green) ![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table des matières

1. [Fonctionnalités](#-fonctionnalités)
2. [Architecture](#-architecture)
3. [Structure du projet](#-structure-du-projet)
4. [Lancement local](#-lancement-local)
5. [Build Docker](#-build-docker)
6. [Déploiement Kubernetes](#-déploiement-kubernetes)
7. [Vérifications](#-vérifications)
8. [Objets Kubernetes expliqués](#-objets-kubernetes-expliqués)
9. [Exercices pratiques](#-exercices-pratiques)

---

## 🚀 Fonctionnalités

| Fonctionnalité | Endpoint | Description |
|---|---|---|
| CRUD Notes | `GET/POST/PUT/DELETE /api/notes` | Créer, lire, modifier, supprimer des notes |
| Upload fichiers | `POST /api/upload` | Uploader des fichiers (max 5 MB) |
| Liste fichiers | `GET /api/files` | Lister les fichiers uploadés |
| Santé | `GET /health` | Health check (readiness/liveness) |
| Version | `GET /version` | Version de l'application |
| Configuration | `GET /config` | Variables de configuration (secrets masqués) |
| Info Runtime | `GET /info` | Informations runtime complètes |
| Statistiques | `GET /api/stats` | Stats notes et fichiers |

---

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Browser   │────▶│     Ingress      │────▶│   Service    │
│             │     │   (demo.local)   │     │  (ClusterIP) │
└─────────────┘     └──────────────────┘     └──────┬───────┘
                                                     │
                         ┌───────────────────────────┼────────────────┐
                         │                           │                │
                    ┌────▼────┐              ┌───────▼───┐     ┌─────▼─────┐
                    │  Pod 1  │              │   Pod 2   │     │  Init Job │
                    │ Express │              │  Express  │     │  (Seeds)  │
                    └────┬────┘              └─────┬─────┘     └───────────┘
                         │                         │
                    ┌────▼─────────────────────────▼────┐
                    │      PVC → PV (hostPath /data)    │
                    │    notes.json + uploads/           │
                    └───────────────────────────────────┘
                         │                    │
                    ConfigMap            Secret
                 (APP_NAME, ENV...)   (APP_SECRET, ADMIN_PWD)
```

---

## 📁 Structure du projet

```
tp-k8s/
├── app/
│   ├── package.json          # Dépendances Node.js
│   ├── server.js             # Backend Express
│   └── public/
│       ├── index.html        # Interface web
│       ├── style.css         # Styles (dark theme)
│       └── app.js            # Logique frontend
├── Dockerfile                # Image Docker
├── .dockerignore
├── README.md
└── k8s/
    ├── namespace.yaml        # Namespace demo-app
    ├── configmap.yaml        # Variables non sensibles
    ├── secret.yaml           # Variables sensibles (base64)
    ├── pv.yaml               # PersistentVolume (hostPath)
    ├── pvc.yaml              # PersistentVolumeClaim
    ├── deployment.yaml       # Deployment (2 replicas)
    ├── service.yaml          # Service ClusterIP
    ├── ingress.yaml          # Ingress (demo.local)
    ├── job-init.yaml         # Job d'initialisation (bonus)
    ├── networkpolicy.yaml    # NetworkPolicy (bonus)
    ├── hpa.yaml              # HorizontalPodAutoscaler (bonus)
    └── kustomization.yaml    # Kustomize (bonus)
```

---

## 💻 Lancement local (sans Docker)

```bash
cd app
npm install
npm start
# Ouvrir http://localhost:3000
```

Variables d'environnement optionnelles :
```bash
APP_NAME="Mon App" APP_ENV=dev LOG_LEVEL=debug npm start
```

---

## 🐳 Build Docker

### Build de l'image

```bash
# Depuis la racine du projet
docker build -t k8s-demo-app:latest .

# Test local
docker run -p 3000:3000 -e APP_NAME="Docker Test" k8s-demo-app:latest
```

### Push vers un registry (optionnel)

```bash
# Docker Hub
docker tag k8s-demo-app:latest votre-user/k8s-demo-app:latest
docker push votre-user/k8s-demo-app:latest

# Registry privé
docker tag k8s-demo-app:latest registry.example.com/k8s-demo-app:latest
docker push registry.example.com/k8s-demo-app:latest
```

### Pour Minikube (pas besoin de push)

```bash
eval $(minikube docker-env)
docker build -t k8s-demo-app:latest .
```

---

## ☸ Déploiement Kubernetes

### Méthode 1 : Fichier par fichier (recommandé pour apprendre)

```bash
# 1. Créer le namespace
kubectl apply -f k8s/namespace.yaml

# 2. Créer la ConfigMap
kubectl apply -f k8s/configmap.yaml

# 3. Créer le Secret
kubectl apply -f k8s/secret.yaml

# 4. Créer le PersistentVolume
kubectl apply -f k8s/pv.yaml

# 5. Créer le PersistentVolumeClaim
kubectl apply -f k8s/pvc.yaml

# 6. Déployer l'application
kubectl apply -f k8s/deployment.yaml

# 7. Exposer via Service
kubectl apply -f k8s/service.yaml

# 8. Configurer l'Ingress
kubectl apply -f k8s/ingress.yaml

# 9. (Optionnel) Initialiser les données
kubectl apply -f k8s/job-init.yaml

# 10. (Optionnel) NetworkPolicy
kubectl apply -f k8s/networkpolicy.yaml

# 11. (Optionnel) HPA
kubectl apply -f k8s/hpa.yaml
```

### Méthode 2 : Kustomize (tout d'un coup)

```bash
kubectl apply -k k8s/
```

### Méthode 3 : Tout le dossier

```bash
kubectl apply -f k8s/
```

---

## ✅ Vérifications

### État des ressources

```bash
# Tout voir dans le namespace
kubectl get all -n demo-app

# Détails spécifiques
kubectl get pods -n demo-app -o wide
kubectl get svc -n demo-app
kubectl get ingress -n demo-app
kubectl get configmap -n demo-app
kubectl get secret -n demo-app
kubectl get pv
kubectl get pvc -n demo-app

# Logs de l'application
kubectl logs -n demo-app -l app=k8s-demo --tail=50 -f

# Décrire un pod
kubectl describe pod -n demo-app -l app=k8s-demo
```

### Test de l'Ingress

```bash
# Ajouter l'entrée DNS locale
echo "$(minikube ip) demo.local" | sudo tee -a /etc/hosts

# Activer l'addon Ingress (Minikube)
minikube addons enable ingress

# Tester
curl http://demo.local/health
curl http://demo.local/version
curl http://demo.local/config

# Ou ouvrir dans le navigateur
open http://demo.local
```

### Alternative sans Ingress (port-forward)

```bash
kubectl port-forward -n demo-app svc/demo-app-service 8080:80
# Ouvrir http://localhost:8080
```

---

## 📚 Objets Kubernetes expliqués

| Objet | Fichier | Rôle dans ce projet |
|---|---|---|
| **Namespace** | `namespace.yaml` | Isolation logique : toutes les ressources vivent dans `demo-app`, séparées du reste du cluster |
| **ConfigMap** | `configmap.yaml` | Stocke les variables non sensibles (APP_NAME, LOG_LEVEL, etc.) injectées dans les pods |
| **Secret** | `secret.yaml` | Stocke les variables sensibles (APP_SECRET, ADMIN_PASSWORD) en base64, injectées via `env` |
| **PersistentVolume** | `pv.yaml` | Réserve un espace de stockage sur le nœud (hostPath pour la démo) |
| **PersistentVolumeClaim** | `pvc.yaml` | Demande de stockage liée au PV, montée dans le container sur `/data` |
| **Deployment** | `deployment.yaml` | Gère 2 replicas du pod, rolling updates, probes de santé, injection ConfigMap/Secret/PVC |
| **Service** | `service.yaml` | Expose les pods en interne via ClusterIP, load-balance entre les replicas |
| **Ingress** | `ingress.yaml` | Point d'entrée HTTP externe via le host `demo.local` |
| **Job** | `job-init.yaml` | (Bonus) Initialise des données de démo via l'API au premier déploiement |
| **NetworkPolicy** | `networkpolicy.yaml` | (Bonus) Restreint le trafic réseau entrant aux sources autorisées |
| **HPA** | `hpa.yaml` | (Bonus) Scale automatiquement entre 2 et 5 replicas selon le CPU |

---

## 🧪 Exercices pratiques

### 1. Modifier la ConfigMap et redéployer

```bash
# Modifier le ConfigMap
kubectl edit configmap demo-app-config -n demo-app
# Changer APP_NAME en "Mon App Modifiée"

# Redémarrer les pods pour prendre en compte
kubectl rollout restart deployment demo-app -n demo-app

# Vérifier
kubectl get pods -n demo-app -w
curl http://demo.local/config
```

### 2. Scaler le Deployment

```bash
# Passer à 3 replicas
kubectl scale deployment demo-app -n demo-app --replicas=3

# Observer
kubectl get pods -n demo-app -w

# Vérifier que chaque requête peut aller sur un pod différent
for i in $(seq 1 5); do curl -s http://demo.local/version | jq .hostname; done
```

### 3. Vérifier la persistance des données

```bash
# Créer une note via l'API
curl -X POST http://demo.local/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Persistance","content":"Cette note doit survivre au redémarrage","category":"important"}'

# Supprimer tous les pods
kubectl delete pods -n demo-app -l app=k8s-demo

# Attendre le redémarrage automatique
kubectl get pods -n demo-app -w

# Vérifier que la note existe toujours
curl http://demo.local/api/notes | jq
```

### 4. Consulter les données persistées sur le nœud

```bash
# Sur Minikube, accéder au nœud
minikube ssh

# Voir les données
cat /tmp/demo-app-data/notes.json
ls -la /tmp/demo-app-data/uploads/
```

### 5. Modifier un Secret

```bash
# Encoder la nouvelle valeur
echo -n "NouveauMotDePasse!" | base64

# Éditer le secret
kubectl edit secret demo-app-secret -n demo-app

# Redémarrer
kubectl rollout restart deployment demo-app -n demo-app
```

### 6. Observer les probes de santé

```bash
# Décrire un pod et voir les events liés aux probes
kubectl describe pod -n demo-app -l app=k8s-demo | grep -A 5 "Conditions"

# Voir les endpoints du Service
kubectl get endpoints demo-app-service -n demo-app
```

---

## 🔧 Dépannage

| Problème | Solution |
|---|---|
| ImagePullBackOff | Vérifier que l'image est buildée dans le contexte Docker de minikube |
| PVC Pending | Vérifier que le PV existe et que le storageClassName correspond |
| CrashLoopBackOff | Consulter les logs : `kubectl logs -n demo-app <pod-name>` |
| Ingress 404 | Vérifier l'addon ingress : `minikube addons enable ingress` |
| Pas de résolution DNS | Vérifier `/etc/hosts` pour `demo.local` |

---

## 📝 Licence

MIT — **KHLIFI HOUCEM / FORMATEUR DEVSECOPS & CLOUD**
