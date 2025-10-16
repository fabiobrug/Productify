# 🚀 Productify - Sistema de Gestão de Produtos e Pedidos

> **Sistema Full-Stack Completo** desenvolvido com **NestJS** e **Angular 19** para demonstração de habilidades em desenvolvimento web moderno.

## 📋 Visão Geral

O **Productify** é uma aplicação web completa de gestão de produtos e pedidos que demonstra competências em:

- **Backend**: API RESTful com NestJS, TypeScript, Sequelize ORM e PostgreSQL
- **Frontend**: SPA responsiva com Angular 19, RxJS, Tailwind CSS e Material Design
- **DevOps**: Containerização com Docker, Docker Compose e scripts de automação
- **Arquitetura**: Clean Architecture, SOLID principles e padrões de design

## 🎯 Funcionalidades Principais

### 📦 Gestão de Produtos
- **CRUD Completo**: Criar, visualizar, editar e excluir produtos
- **Busca Inteligente**: Pesquisa em tempo real com debounce
- **Filtros Avançados**: Filtro por faixa de preço e categorias
- **Ordenação**: Por nome, preço ou data (ascendente/descendente)
- **Validação**: Formulários com validação em tempo real

### 🛒 Sistema de Pedidos
- **Criação de Pedidos**: Carrinho de compras com múltiplos produtos
- **Gestão de Status**: Pedidos pendentes, confirmados e cancelados
- **Cálculo Automático**: Totalização automática dos valores
- **Histórico**: Visualização completa do histórico de pedidos

### 🎨 Interface do Usuário
- **Design Responsivo**: Mobile-first com breakpoints otimizados
- **UX Moderna**: Loading states, toast notifications e feedback visual
- **Acessibilidade**: Componentes acessíveis e navegação por teclado
- **Performance**: Lazy loading, OnPush change detection e otimizações

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: NestJS 10+ (Node.js)
- **Linguagem**: TypeScript 5.7+
- **ORM**: Sequelize com Sequelize-TypeScript
- **Database**: PostgreSQL 15 (desenvolvimento) / SQLite (testes)
- **Validação**: Class Validator + Class Transformer
- **Testes**: Jest com cobertura de código

### Frontend
- **Framework**: Angular 19+ com TypeScript
- **Styling**: Tailwind CSS 3.4+ com componentes customizados
- **State Management**: RxJS Observables e BehaviorSubjects
- **UI Components**: Angular Material + componentes customizados
- **Forms**: Angular Reactive Forms com validação
- **Routing**: Angular Router com lazy loading

### DevOps & Infraestrutura
- **Containerização**: Docker + Docker Compose
- **Scripts**: Automação com shell scripts (`docker-scripts.sh`)
- **Database**: PostgreSQL com health checks
- **Cache**: Redis (opcional)
- **Deploy**: Railway configurado e funcionando
- **Variáveis**: Configuração por ambiente (`env.example`)

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Angular 19)  │◄──►│   (NestJS)      │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • Components    │    │ • Controllers   │    │ • Products      │
│ • Services      │    │ • Services      │    │ • Orders        │
│ • Models        │    │ • DTOs          │    │ • Relations     │
│ • Routing       │    │ • Entities      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Padrões Implementados
- **Repository Pattern**: Abstração da camada de dados
- **DTO Pattern**: Transferência de dados tipada
- **Dependency Injection**: Inversão de controle
- **Observer Pattern**: RxJS para reatividade
- **Factory Pattern**: Criação de componentes Angular

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Docker** e **Docker Compose** instalados
- **Node.js 18+** (para desenvolvimento local)
- **npm 9+** ou **yarn**

### 🐳 Execução com Docker (Recomendado)

#### 1. Clone o repositório
```bash
git clone <repository-url>
cd Productify
```

#### 2. Execute o script de inicialização
```bash
# Dar permissão ao script (primeira execução)
chmod +x docker-scripts.sh

# Iniciar todos os serviços
./docker-scripts.sh start-dev
```

#### 3. Acesse a aplicação
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

### 💻 Desenvolvimento Local

#### Backend + Database (Docker)
```bash
# Iniciar apenas backend e database
docker compose -f docker-compose.dev.yml up -d
```

#### Frontend (Local)
```bash
cd frontend/productify-frontend
npm install
npm start
```

## 📁 Estrutura Detalhada do Projeto

```
Productify/
├── 📁 backend/crud-api/                 # Backend NestJS
│   ├── 📁 src/
│   │   ├── 📁 products/                 # Módulo de produtos
│   │   │   ├── 📁 dto/                  # Data Transfer Objects
│   │   │   ├── 📁 entities/             # Entidades Sequelize
│   │   │   ├── products.controller.ts   # Controller REST
│   │   │   ├── products.service.ts      # Lógica de negócio
│   │   │   └── products.module.ts       # Módulo NestJS
│   │   ├── 📁 orders/                   # Módulo de pedidos
│   │   │   ├── 📁 dto/
│   │   │   ├── 📁 entities/
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   └── orders.module.ts
│   │   ├── app.module.ts                # Módulo principal
│   │   ├── database.module.ts           # Configuração DB
│   │   └── main.ts                      # Bootstrap
│   ├── Dockerfile                       # Docker para produção
│   ├── Dockerfile.dev.fast             # Docker para desenvolvimento
│   ├── package.json                     # Dependências backend
│   └── coverage/                        # Relatórios de teste
├── 📁 frontend/productify-frontend/      # Frontend Angular
│   ├── 📁 src/app/
│   │   ├── 📁 components/               # Componentes Angular
│   │   │   ├── 📁 product-list/         # Lista de produtos
│   │   │   ├── 📁 product-form/         # Formulário de produtos
│   │   │   ├── 📁 product-card/         # Card de produto
│   │   │   ├── 📁 filter-section/       # Filtros e busca
│   │   │   ├── 📁 order-form/           # Formulário de pedidos
│   │   │   ├── 📁 order-list/           # Lista de pedidos
│   │   │   └── 📁 notification-toast/   # Sistema de notificações
│   │   ├── 📁 services/                 # Serviços Angular
│   │   │   ├── product.service.ts       # Serviço de produtos
│   │   │   ├── order.service.ts         # Serviço de pedidos
│   │   │   └── notification.service.ts  # Serviço de notificações
│   │   ├── 📁 models/                   # Interfaces TypeScript
│   │   │   ├── product.model.ts
│   │   │   └── order.model.ts
│   │   ├── app.component.ts             # Componente raiz
│   │   ├── app.routes.ts                # Configuração de rotas
│   │   └── app.config.ts                # Configuração da app
│   ├── Dockerfile                       # Docker para produção
│   ├── package.json                     # Dependências frontend
│   └── tailwind.config.js               # Configuração Tailwind
├── 📁 database/init/                    # Scripts de inicialização
│   └── 01-init.sql                      # Schema inicial
├── docker-compose.yml                   # Produção
├── docker-compose.dev.yml              # Desenvolvimento
├── docker-scripts.sh                    # Scripts de automação Docker
├── env.example                          # Variáveis de ambiente exemplo
├── railway-backend.toml                 # Configuração Railway Backend
├── railway-frontend.toml                # Configuração Railway Frontend
├── railway.env                          # Variáveis Railway
├── deploy-railway.sh                    # Script de deploy Railway
├── configure-railway.sh                 # Script de configuração Railway
└── CONTEXTO_DEPLOY.md                   # Documentação de deploy
```

## 🔧 Comandos Úteis

### 🐳 Scripts Docker Automatizados
```bash
# Dar permissão ao script (primeira execução)
chmod +x docker-scripts.sh

# Iniciar ambiente de desenvolvimento
./docker-scripts.sh start-dev

# Iniciar ambiente de produção
./docker-scripts.sh start-prod

# Parar todos os containers
./docker-scripts.sh stop

# Ver logs (desenvolvimento)
./docker-scripts.sh logs dev

# Ver logs (produção)
./docker-scripts.sh logs

# Ver status dos containers
./docker-scripts.sh status

# Executar comando no container
./docker-scripts.sh exec backend npm run test
./docker-scripts.sh exec database psql -U productify_user -d productify

# Backup do banco de dados
./docker-scripts.sh backup

# Restaurar backup
./docker-scripts.sh restore backup.sql

# Limpar recursos Docker
./docker-scripts.sh cleanup

# Mostrar ajuda
./docker-scripts.sh help
```

### Gerenciamento Manual de Containers
```bash
# Verificar status dos containers
docker compose -f docker-compose.dev.yml ps

# Ver logs do backend
docker logs productify-backend-dev

# Reconstruir imagens
docker compose -f docker-compose.dev.yml up --build -d

# Parar todos os serviços
docker compose -f docker-compose.dev.yml down

# Limpar volumes e containers
docker compose -f docker-compose.dev.yml down -v
docker system prune -f
```

### Desenvolvimento Frontend
```bash
cd frontend/productify-frontend

# Instalar dependências
npm install

# Servidor de desenvolvimento
npm start

# Build para produção
npm run build

# Executar testes
npm test

# Linting
npm run lint
```

### Desenvolvimento Backend
```bash
cd backend/crud-api

# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run start:dev

# Executar testes
npm test

# Testes com cobertura
npm run test:cov

# Build para produção
npm run build
```

## 🌐 Deploy em Produção

### ✅ **DEPLOY FUNCIONANDO NO RAILWAY**

O projeto está **100% funcional em produção** com:

- **Frontend**: https://comfortable-solace-production.up.railway.app/products
- **Backend API**: https://productify-production.up.railway.app/api/products
- **Health Check**: https://productify-production.up.railway.app/api/health

### Configuração de Produção Implementada

- ✅ **Railway** configurado e funcionando
- ✅ **PostgreSQL** em produção via Railway
- ✅ **CORS** configurado para produção
- ✅ **Variáveis de ambiente** configuradas
- ✅ **Deploy automático** via Git
- ✅ **Health checks** funcionando

### 🚀 Scripts de Deploy Railway

```bash
# Deploy automático completo
./deploy-railway.sh

# Configurar variáveis de ambiente
./configure-railway.sh

# Deploy manual do backend
railway up --service backend

# Deploy manual do frontend
railway up --service frontend
```

### 📋 Arquivos de Configuração Railway

- **`railway-backend.toml`**: Configuração do backend
- **`railway-frontend.toml`**: Configuração do frontend
- **`railway.env`**: Variáveis de ambiente
- **`deploy-railway.sh`**: Script de deploy automatizado
- **`configure-railway.sh`**: Script de configuração

### 🔧 Configuração de Variáveis de Ambiente

Copie o arquivo `env.example` para `.env` e configure as variáveis:

```bash
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=productify
DATABASE_USER=productify_user
DATABASE_PASSWORD=productify_password
DATABASE_URL=postgresql://productify_user:productify_password@localhost:5432/productify

# Application Configuration
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# Security
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:4200
```

## 🧪 Testes e Qualidade

### Backend
- **Cobertura**: Jest com relatórios detalhados
- **Testes Unitários**: Services e Controllers
- **Validação**: DTOs com Class Validator
- **Linting**: ESLint com Prettier

### Frontend
- **Testes**: Jasmine + Karma
- **Linting**: ESLint + Prettier
- **Type Safety**: TypeScript strict mode
- **Performance**: OnPush change detection

## 📊 Métricas de Qualidade

- **Cobertura de Testes**: >72% (Backend)
- **TypeScript**: Strict mode habilitado
- **Linting**: Zero warnings
- **Performance**: Lighthouse score >90
- **Acessibilidade**: WCAG 2.1 AA compliance

## 🎯 Demonstração de Habilidades

### Backend Development
- ✅ **NestJS**: Framework moderno com decorators
- ✅ **TypeScript**: Tipagem estática e interfaces
- ✅ **Sequelize ORM**: Mapeamento objeto-relacional
- ✅ **RESTful API**: Endpoints padronizados
- ✅ **Dependency Injection**: Arquitetura modular
- ✅ **Validation**: DTOs com validação automática
- ✅ **Error Handling**: Tratamento robusto de erros

### Frontend Development
- ✅ **Angular 19**: Framework SPA moderno
- ✅ **RxJS**: Programação reativa
- ✅ **Tailwind CSS**: Styling utilitário
- ✅ **Angular Material**: Componentes UI
- ✅ **Reactive Forms**: Formulários reativos
- ✅ **Lazy Loading**: Otimização de performance
- ✅ **State Management**: Gerenciamento de estado

### DevOps & Infrastructure
- ✅ **Docker**: Containerização completa
- ✅ **Docker Compose**: Orquestração de serviços
- ✅ **PostgreSQL**: Banco relacional robusto
- ✅ **Health Checks**: Monitoramento de saúde
- ✅ **Scripts**: Automação de tarefas
- ✅ **Environment**: Configuração por ambiente

### Software Engineering
- ✅ **Clean Architecture**: Separação de responsabilidades
- ✅ **SOLID Principles**: Princípios de design
- ✅ **Design Patterns**: Padrões implementados
- ✅ **Code Quality**: Linting e formatação
- ✅ **Documentation**: README completo
- ✅ **Version Control**: Git com commits semânticos

## 🔍 Troubleshooting

### Problemas Comuns

#### Container não inicia
```bash
# Usar script automatizado
./docker-scripts.sh logs dev

# Verificar logs manualmente
docker logs productify-backend-dev

# Reconstruir containers
./docker-scripts.sh start-dev
```

#### Porta já em uso
```bash
# Verificar processos
sudo lsof -i :3000
sudo lsof -i :4200
sudo lsof -i :5432

# Parar processos
sudo kill -9 <PID>

# Parar todos os containers
./docker-scripts.sh stop
```

#### Problemas de permissão Docker
```bash
# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
# Reiniciar sessão

# Dar permissão ao script
chmod +x docker-scripts.sh
```

#### Frontend não conecta com backend
```bash
# Verificar se backend está rodando
curl http://localhost:3000/api/health

# Verificar logs do backend
./docker-scripts.sh logs dev

# Verificar status dos containers
./docker-scripts.sh status
```

#### Problemas de CORS
```bash
# Verificar configuração CORS no backend
curl -H "Origin: http://localhost:4200" -I http://localhost:3000/api/products

# Verificar variáveis de ambiente
cat env.example
```

#### Problemas de banco de dados
```bash
# Backup do banco
./docker-scripts.sh backup

# Restaurar backup
./docker-scripts.sh restore backup.sql

# Executar comandos no banco
./docker-scripts.sh exec database psql -U productify_user -d productify
```

## 📞 Suporte e Contato

Para dúvidas ou problemas:

1. **Usar scripts automatizados**: `./docker-scripts.sh help`
2. **Verificar logs**: `./docker-scripts.sh logs dev`
3. **Confirmar portas**: Verificar se 3000, 4200 e 5432 estão livres
4. **Docker status**: Confirmar se Docker está rodando
5. **Reconstruir**: Executar `./docker-scripts.sh start-dev`
6. **Status completo**: Executar `./docker-scripts.sh status`

### 📚 Documentação Adicional

- **`CONTEXTO_DEPLOY.md`**: Documentação completa de deploy
- **`env.example`**: Exemplo de variáveis de ambiente
- **`docker-scripts.sh help`**: Ajuda dos scripts Docker
- **Logs detalhados**: Use `./docker-scripts.sh logs dev` para debug

---

## 🏆 Conclusão

Este projeto demonstra competências completas em desenvolvimento full-stack moderno, incluindo:

- **Arquitetura**: Clean Architecture com separação clara de responsabilidades
- **Tecnologias**: Stack moderna e atualizada (Angular 19, NestJS 10)
- **DevOps**: Containerização completa com Docker + Railway
- **Qualidade**: Testes, linting e documentação abrangente
- **UX/UI**: Interface responsiva e acessível
- **Performance**: Otimizações para produção
- **Deploy**: Sistema funcionando 100% em produção

### 🎯 **STATUS FINAL: PROJETO COMPLETO E FUNCIONAL**

✅ **Backend**: API RESTful funcionando perfeitamente  
✅ **Frontend**: SPA responsiva com todas as funcionalidades  
✅ **Database**: PostgreSQL configurado e conectado  
✅ **Deploy**: Railway funcionando com URLs públicas  
✅ **CORS**: Configuração resolvida e funcionando  
✅ **Documentação**: READMEs completos e atualizados  

**Desenvolvido com ❤️ usando NestJS + Angular + Docker + PostgreSQL + Railway**

---

*Este projeto foi desenvolvido como demonstração de habilidades técnicas para processos seletivos de desenvolvimento full-stack e está 100% funcional em produção.*
