# ===== Builder (build TypeScript) =====
FROM node:20 AS builder
WORKDIR /app

# Copiamos package.json y package-lock (si existe) para aprovechar cache
COPY package*.json ./
# Instalamos todas las dependencias (incl. dev needed para compilar)
RUN npm ci

# Copiamos el resto y construimos
COPY . .
RUN npm run build

# ===== Runtime (solo prod deps + dist) =====
FROM node:20-alpine AS runner
WORKDIR /app

# Instalamos solo deps de producción (si hay package-lock, se usa)
COPY package*.json ./
RUN npm ci --omit=dev

# Instalar curl para el health check
RUN apk add --no-cache curl

# Copiamos archivos generados por el builder
COPY --from=builder /app/dist ./dist
# Copiamos vistas/otros assets si los hay (opcional)
# COPY --from=builder /app/public ./public

# Crear usuario no root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Cambiar permisos
RUN chown -R nextjs:nodejs /app
USER nextjs

ENV NODE_ENV=production
EXPOSE 4000

# Health check más robusto
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/api/health || exit 1

CMD ["node", "dist/index.js"]