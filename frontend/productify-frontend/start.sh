#!/bin/sh

# Debug: Listar arquivos no diretório nginx
echo "=== Arquivos em /usr/share/nginx/html ==="
ls -la /usr/share/nginx/html/

# Verificar se index.html existe
if [ ! -f "/usr/share/nginx/html/index.html" ]; then
    echo "ERRO: index.html não encontrado!"
    echo "Conteúdo do diretório:"
    find /usr/share/nginx/html -type f
    # Não sair com erro, apenas mostrar warning
    echo "Continuando mesmo sem index.html..."
fi

# Corrigir permissões se necessário
echo "=== Corrigindo permissões ==="
chown -R nginx:nginx /usr/share/nginx/html 2>/dev/null || true
chmod -R 755 /usr/share/nginx/html 2>/dev/null || true

# Substituir a porta no nginx.conf pela variável PORT do Railway
echo "=== Configurando porta $PORT ==="
sed -i "s/listen 80;/listen $PORT;/" /etc/nginx/nginx.conf

# Debug: Mostrar configuração do nginx
echo "=== Configuração do Nginx ==="
cat /etc/nginx/nginx.conf | grep listen

# Testar configuração do nginx
echo "=== Testando configuração do Nginx ==="
nginx -t || {
    echo "ERRO na configuração do Nginx!"
    echo "Usando configuração padrão..."
    # Usar configuração padrão se a customizada falhar
    cp /etc/nginx/nginx.conf.default /etc/nginx/nginx.conf 2>/dev/null || true
    sed -i "s/listen 80;/listen $PORT;/" /etc/nginx/nginx.conf
}

# Iniciar o Nginx
echo "=== Iniciando Nginx ==="
exec nginx -g "daemon off;"
