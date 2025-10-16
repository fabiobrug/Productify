# Railway Deploy Script
# Script para automatizar o deploy no Railway

#!/bin/bash

echo "🚀 Iniciando deploy do Productify no Railway..."

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não encontrado. Instalando..."
    npm install -g @railway/cli
fi

# Login no Railway
echo "🔐 Fazendo login no Railway..."
railway login

# Criar projeto se não existir
echo "📁 Criando projeto no Railway..."
railway project create productify

# Adicionar PostgreSQL
echo "🗄️ Adicionando PostgreSQL..."
railway add postgresql

# Deploy do Backend
echo "🔧 Fazendo deploy do backend..."
cd backend/crud-api
railway up --service backend

# Deploy do Frontend
echo "🎨 Fazendo deploy do frontend..."
cd ../../frontend/productify-frontend
railway up --service frontend

echo "✅ Deploy concluído!"
echo "🌐 Acesse seu projeto em: https://railway.app/dashboard"
