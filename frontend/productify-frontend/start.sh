#!/bin/sh

# Substituir a porta no nginx.conf pela variável PORT do Railway
sed -i "s/listen 80;/listen $PORT;/" /etc/nginx/nginx.conf

# Iniciar o Nginx
nginx -g "daemon off;"
