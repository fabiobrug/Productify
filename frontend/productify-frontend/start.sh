#!/bin/sh

# Debug: Listar arquivos no diretório nginx
echo "=== Arquivos em /usr/share/nginx/html ==="
ls -la /usr/share/nginx/html/

# Substituir a porta no nginx.conf pela variável PORT do Railway
echo "=== Configurando porta $PORT ==="
sed -i "s/listen 80;/listen $PORT;/" /etc/nginx/nginx.conf

# Debug: Mostrar configuração do nginx
echo "=== Configuração do Nginx ==="
cat /etc/nginx/nginx.conf | grep listen

# Iniciar o Nginx
echo "=== Iniciando Nginx ==="
nginx -g "daemon off;"
