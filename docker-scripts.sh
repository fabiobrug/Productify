#!/bin/bash

# Scripts de gerenciamento Docker para Productify
# Uso: ./docker-scripts.sh [comando]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Função para verificar se Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker não está rodando. Por favor, inicie o Docker e tente novamente."
        exit 1
    fi
}

# Função para build das imagens
build_images() {
    print_header "BUILD DAS IMAGENS DOCKER"
    check_docker
    
    print_message "Construindo imagem do backend..."
    sudo docker build -t productify-backend -f backend/crud-api/Dockerfile.dev backend/crud-api/
    
    print_message "Construindo imagem do frontend..."
    sudo docker build -t productify-frontend ./frontend/productify-frontend
    
    print_message "Imagens construídas com sucesso!"
}

# Função para iniciar em modo desenvolvimento
start_dev() {
    print_header "INICIANDO AMBIENTE DE DESENVOLVIMENTO"
    check_docker
    
    print_message "Iniciando containers de desenvolvimento..."
    sudo docker compose -f docker-compose.dev.yml up -d
    
    print_message "Aguardando serviços ficarem prontos..."
    sleep 10
    
    print_message "Verificando status dos containers..."
    sudo docker compose -f docker-compose.dev.yml ps
    
    print_message "Ambiente de desenvolvimento iniciado!"
    print_message "Backend: http://localhost:3000"
    print_message "Database: localhost:5432"
}

# Função para iniciar em modo produção
start_prod() {
    print_header "INICIANDO AMBIENTE DE PRODUÇÃO"
    check_docker
    
    print_message "Construindo imagens..."
    build_images
    
    print_message "Iniciando containers de produção..."
    sudo docker compose up -d
    
    print_message "Aguardando serviços ficarem prontos..."
    sleep 15
    
    print_message "Verificando status dos containers..."
    sudo docker compose ps
    
    print_message "Ambiente de produção iniciado!"
    print_message "Frontend: http://localhost"
    print_message "Backend: http://localhost:3000"
    print_message "Database: localhost:5432"
}

# Função para parar todos os containers
stop_all() {
    print_header "PARANDO TODOS OS CONTAINERS"
    check_docker
    
    print_message "Parando containers de desenvolvimento..."
    sudo docker compose -f docker-compose.dev.yml down 2>/dev/null || true
    
    print_message "Parando containers de produção..."
    sudo docker compose down 2>/dev/null || true
    
    print_message "Todos os containers foram parados!"
}

# Função para limpar recursos Docker
cleanup() {
    print_header "LIMPEZA DE RECURSOS DOCKER"
    check_docker
    
    print_warning "Isso irá remover todos os containers, volumes e imagens do Productify!"
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message "Parando e removendo containers..."
        sudo docker compose down -v 2>/dev/null || true
        sudo docker compose -f docker-compose.dev.yml down -v 2>/dev/null || true
        
        print_message "Removendo imagens..."
        sudo docker rmi productify-backend productify-frontend 2>/dev/null || true
        
        print_message "Removendo volumes não utilizados..."
        sudo docker volume prune -f
        
        print_message "Limpeza concluída!"
    else
        print_message "Operação cancelada."
    fi
}

# Função para mostrar logs
show_logs() {
    print_header "LOGS DOS CONTAINERS"
    check_docker
    
    if [ "$2" = "dev" ]; then
        sudo docker compose -f docker-compose.dev.yml logs -f
    else
        sudo docker compose logs -f
    fi
}

# Função para executar comandos no container
exec_command() {
    print_header "EXECUTANDO COMANDO NO CONTAINER"
    check_docker
    
    if [ -z "$2" ]; then
        print_error "Por favor, especifique o container e o comando."
        print_message "Uso: $0 exec [container] [comando]"
        print_message "Containers disponíveis: backend, frontend, database"
        exit 1
    fi
    
    CONTAINER=$2
    COMMAND=${3:-bash}
    
    case $CONTAINER in
        "backend")
            sudo docker compose exec backend $COMMAND
            ;;
        "frontend")
            sudo docker compose exec frontend $COMMAND
            ;;
        "database")
            sudo docker compose exec database $COMMAND
            ;;
        *)
            print_error "Container '$CONTAINER' não encontrado."
            exit 1
            ;;
    esac
}

# Função para mostrar status
show_status() {
    print_header "STATUS DOS CONTAINERS"
    check_docker
    
    print_message "Containers de desenvolvimento:"
    sudo docker compose -f docker-compose.dev.yml ps 2>/dev/null || print_warning "Nenhum container de desenvolvimento rodando"
    
    echo
    print_message "Containers de produção:"
    sudo docker compose ps 2>/dev/null || print_warning "Nenhum container de produção rodando"
    
    echo
    print_message "Imagens do Productify:"
    sudo docker images | grep productify || print_warning "Nenhuma imagem do Productify encontrada"
}

# Função para backup do banco
backup_database() {
    print_header "BACKUP DO BANCO DE DADOS"
    check_docker
    
    BACKUP_FILE="productify_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    print_message "Criando backup: $BACKUP_FILE"
    sudo docker compose exec -T database pg_dump -U productify_user productify > $BACKUP_FILE
    
    if [ $? -eq 0 ]; then
        print_message "Backup criado com sucesso: $BACKUP_FILE"
    else
        print_error "Falha ao criar backup"
        exit 1
    fi
}

# Função para restaurar backup
restore_database() {
    print_header "RESTAURAR BACKUP DO BANCO"
    check_docker
    
    if [ -z "$2" ]; then
        print_error "Por favor, especifique o arquivo de backup."
        print_message "Uso: $0 restore [arquivo.sql]"
        exit 1
    fi
    
    BACKUP_FILE=$2
    
    if [ ! -f "$BACKUP_FILE" ]; then
        print_error "Arquivo de backup não encontrado: $BACKUP_FILE"
        exit 1
    fi
    
    print_warning "Isso irá substituir todos os dados do banco!"
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message "Restaurando backup: $BACKUP_FILE"
        sudo docker compose exec -T database psql -U productify_user -d productify < $BACKUP_FILE
        
        if [ $? -eq 0 ]; then
            print_message "Backup restaurado com sucesso!"
        else
            print_error "Falha ao restaurar backup"
            exit 1
        fi
    else
        print_message "Operação cancelada."
    fi
}

# Função para mostrar ajuda
show_help() {
    print_header "AJUDA - SCRIPTS DOCKER PRODUCTIFY"
    
    echo "Uso: $0 [comando] [opções]"
    echo
    echo "Comandos disponíveis:"
    echo "  build          - Construir imagens Docker"
    echo "  start-dev      - Iniciar ambiente de desenvolvimento"
    echo "  start-prod     - Iniciar ambiente de produção"
    echo "  stop           - Parar todos os containers"
    echo "  logs [dev]     - Mostrar logs (dev para desenvolvimento)"
    echo "  exec [container] [comando] - Executar comando no container"
    echo "  status         - Mostrar status dos containers"
    echo "  cleanup        - Limpar recursos Docker"
    echo "  backup         - Fazer backup do banco de dados"
    echo "  restore [arquivo] - Restaurar backup do banco"
    echo "  help           - Mostrar esta ajuda"
    echo
    echo "Exemplos:"
    echo "  $0 start-dev"
    echo "  $0 logs dev"
    echo "  $0 exec backend npm run test"
    echo "  $0 backup"
    echo "  $0 restore backup.sql"
}

# Main script
case "$1" in
    "build")
        build_images
        ;;
    "start-dev")
        start_dev
        ;;
    "start-prod")
        start_prod
        ;;
    "stop")
        stop_all
        ;;
    "logs")
        show_logs "$@"
        ;;
    "exec")
        exec_command "$@"
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    "backup")
        backup_database
        ;;
    "restore")
        restore_database "$@"
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        print_error "Comando desconhecido: $1"
        show_help
        exit 1
        ;;
esac
