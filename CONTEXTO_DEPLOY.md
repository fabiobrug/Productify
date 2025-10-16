# 🚀 CONTEXTO DEPLOY - PRODUCTIFY

## 📋 RESUMO DO PROJETO

**Productify** é um sistema full-stack completo de gestão de produtos e pedidos:

- **Backend**: NestJS + TypeScript + Sequelize + PostgreSQL
- **Frontend**: Angular 19 + Tailwind CSS + Material Design
- **Database**: PostgreSQL (produção) / SQLite (desenvolvimento)
- **Containerização**: Docker + Docker Compose
- **Deploy Target**: Railway (configurado)

## 🎯 OBJETIVO PRINCIPAL
**FAZER O DEPLOY DO PROJETO NO RAILWAY** - O projeto está 100% pronto e funcional localmente.

## 📁 ESTRUTURA DO PROJETO

```
Productify/
├── backend/crud-api/           # API NestJS
│   ├── src/                   # Código fonte
│   ├── Dockerfile             # Container backend
│   └── package.json           # Dependências backend
├── frontend/productify-frontend/ # App Angular
│   ├── src/                   # Código fonte
│   ├── Dockerfile             # Container frontend
│   ├── nginx.conf             # Configuração Nginx
│   └── package.json           # Dependências frontend
├── database/init/             # Scripts SQL
├── docker-compose.yml         # Produção
├── docker-compose.dev.yml     # Desenvolvimento
├── railway-backend.toml       # Config Railway Backend
├── railway-frontend.toml      # Config Railway Frontend
├── railway.env                # Variáveis Railway
└── deploy-railway.sh          # Script de deploy
```

## 🔧 CONFIGURAÇÕES DE DEPLOY

### Railway Backend (railway-backend.toml)
```toml
RAILWAY_BUILD_COMMAND="cd backend/crud-api && npm ci && npm run build"
RAILWAY_START_COMMAND="cd backend/crud-api && npm run start:prod"
RAILWAY_ROOT_DIRECTORY="backend/crud-api"
```

### Railway Frontend (railway-frontend.toml)
```toml
RAILWAY_BUILD_COMMAND="cd frontend/productify-frontend && npm ci && npm run build"
RAILWAY_START_COMMAND="nginx -g 'daemon off;'"
RAILWAY_ROOT_DIRECTORY="frontend/productify-frontend"
RAILWAY_SPA_OUTPUT_DIR="dist/productify-frontend"
```

### Variáveis de Ambiente (railway.env)
```env
DATABASE_HOST=${DATABASE_HOST}
DATABASE_PORT=${DATABASE_PORT}
DATABASE_NAME=${DATABASE_NAME}
DATABASE_USER=${DATABASE_USER}
DATABASE_PASSWORD=${DATABASE_PASSWORD}
DATABASE_URL=${DATABASE_URL}
NODE_ENV=production
PORT=${PORT}
CORS_ORIGINS=${CORS_ORIGINS}
API_URL=${API_URL}
```

## 🐳 CONFIGURAÇÃO DOCKER

### Backend Dockerfile
- Multi-stage build (builder + production)
- Node.js 18 Alpine
- Usuário não-root (nestjs)
- Health check configurado
- Porta 3000

### Frontend Dockerfile
- Multi-stage build (builder + nginx)
- Node.js 18 Alpine + Nginx Alpine
- Build Angular para produção
- Configuração Nginx customizada
- Porta 80

## 🚀 PROCESSO DE DEPLOY

### 1. Pré-requisitos
- Railway CLI instalado
- Conta Railway criada
- Projeto conectado ao Railway

### 2. Configuração Railway
- Criar projeto no Railway
- Adicionar PostgreSQL
- Configurar variáveis de ambiente
- Conectar repositório Git

### 3. Deploy Backend
- Build: `cd backend/crud-api && npm ci && npm run build`
- Start: `cd backend/crud-api && npm run start:prod`
- Porta: 3000

### 4. Deploy Frontend
- Build: `cd frontend/productify-frontend && npm ci && npm run build`
- Start: `nginx -g 'daemon off;'`
- Porta: 80

## 🔍 STATUS ATUAL

### ✅ PRONTO PARA DEPLOY
- [x] Código backend completo e testado
- [x] Código frontend completo e testado
- [x] Dockerfiles configurados
- [x] Configurações Railway criadas
- [x] Script de deploy criado
- [x] Documentação completa

### 🎯 PRÓXIMOS PASSOS
1. Instalar Railway CLI
2. Fazer login no Railway
3. Criar projeto Railway
4. Configurar banco PostgreSQL
5. Deploy backend
6. Deploy frontend
7. Configurar variáveis de ambiente
8. Testar aplicação online

## 📊 INFORMAÇÕES TÉCNICAS

### Backend (NestJS)
- **Porta**: 3000
- **Health Check**: `/health`
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Build**: `npm run build`
- **Start**: `npm run start:prod`

### Frontend (Angular)
- **Porta**: 80 (Nginx)
- **Health Check**: `/health`
- **Build**: `npm run build`
- **Output**: `dist/productify-frontend`
- **Server**: Nginx

### Database (PostgreSQL/Neon)
- **Local**: PostgreSQL na porta 5432
- **Produção**: Neon DB (via DATABASE_URL)
- **Configuração**: Suporte automático para DATABASE_URL
- **SSL**: Habilitado em produção

## 🛠️ COMANDOS ÚTEIS

### Railway CLI
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Criar projeto
railway project create productify

# Adicionar PostgreSQL
railway add postgresql

# Deploy
railway up
```

### Docker Local (para testes)
```bash
# Build e start completo
docker-compose up --build -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

## 🎯 FOCO DO ASSISTENTE

**SEMPRE BUSCAR CHEGAR NO DEPLOY** - Cada interação deve:
1. Verificar o status atual do deploy
2. Identificar próximos passos
3. Executar comandos necessários
4. Resolver problemas encontrados
5. Avançar para o próximo passo do deploy

**OBJETIVO FINAL**: Aplicação Productify rodando online no Railway com:
- Backend API funcionando
- Frontend Angular funcionando
- Banco PostgreSQL conectado
- Domínio público acessível

---

*Este contexto deve ser lido antes de cada prompt para manter o foco no objetivo de deploy.*
