# ============================================================
# Dockerfile - K8s Demo App
# Auteur: KHLIFI HOUCEM / FORMATEUR DEVSECOPS & CLOUD
# Multi-stage build optimisé pour production
# ============================================================

FROM node:20-alpine AS base
LABEL maintainer="KHLIFI HOUCEM / FORMATEUR DEVSECOPS & CLOUD"
LABEL description="Application de démonstration Kubernetes"

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copier les fichiers de dépendances en premier (cache Docker)
COPY app/package.json app/package-lock.json* ./

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev && npm cache clean --force

# Copier le code applicatif
COPY app/ .

# Créer le répertoire de données
RUN mkdir -p /data/uploads && chown -R appuser:appgroup /data

# Changer vers l'utilisateur non-root
USER appuser

# Exposer le port applicatif
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production \
    PORT=3000 \
    STORAGE_PATH=/data

# Health check intégré au container
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Démarrer l'application
CMD ["node", "server.js"]
