# Dockerfile para produção - Frontend Angular
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar package files primeiro (para cache)
COPY package*.json ./

# Instalar dependências
RUN npm ci && npm cache clean --force

# Copiar código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build

# Estágio de produção com Nginx
FROM nginx:alpine AS production

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar build do estágio anterior
COPY --from=builder /app/dist/productify-frontend /usr/share/nginx/html

# Criar arquivo de health check
RUN echo "OK" > /usr/share/nginx/html/health

# Expor porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Comando para produção
CMD ["nginx", "-g", "daemon off;"]
