#!/bin/bash

# Script para configurar variáveis de ambiente no Railway
# Execute este script após fazer deploy do backend e frontend

echo "🚀 Configurando variáveis de ambiente no Railway..."

# Configurar CORS para o frontend
echo "📡 Configurando CORS para frontend..."
railway variables set CORS_ORIGINS="https://comfortable-solace-production.up.railway.app,https://productify-frontend-production.up.railway.app" --service backend

# Configurar API URL para o frontend
echo "🔗 Configurando API URL..."
railway variables set API_URL="https://productify-backend-production.up.railway.app/api" --service frontend

echo "✅ Configuração concluída!"
echo ""
echo "📋 URLs configuradas:"
echo "Frontend: https://comfortable-solace-production.up.railway.app"
echo "Backend: https://productify-backend-production.up.railway.app/api"
echo ""
echo "🔄 Faça redeploy dos serviços para aplicar as mudanças:"
echo "railway redeploy --service backend"
echo "railway redeploy --service frontend"
