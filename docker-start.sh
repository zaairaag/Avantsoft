#!/bin/bash

# Script para iniciar Reino dos Brinquedos com Docker
# Uso: ./docker-start.sh [dev|prod]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[Reino dos Brinquedos]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar se Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker não está instalado!"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose não está instalado!"
        exit 1
    fi
}

# Função para desenvolvimento
start_dev() {
    print_message "🚀 Iniciando Reino dos Brinquedos em modo DESENVOLVIMENTO..."
    
    print_info "📦 Construindo containers..."
    docker-compose -f docker-compose.dev.yml build
    
    print_info "🔄 Iniciando serviços..."
    docker-compose -f docker-compose.dev.yml up -d
    
    print_info "⏳ Aguardando serviços ficarem prontos..."
    sleep 10
    
    print_message "✅ Serviços iniciados com sucesso!"
    echo ""
    echo "🌐 Acesse a aplicação:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:3001"
    echo "   Adminer:  http://localhost:8080"
    echo ""
    echo "📊 Para ver logs:"
    echo "   docker-compose -f docker-compose.dev.yml logs -f"
    echo ""
    echo "🛑 Para parar:"
    echo "   docker-compose -f docker-compose.dev.yml down"
}

# Função para produção
start_prod() {
    print_message "🚀 Iniciando Reino dos Brinquedos em modo PRODUÇÃO..."
    
    print_info "📦 Construindo containers..."
    docker-compose build
    
    print_info "🔄 Iniciando serviços..."
    docker-compose up -d
    
    print_info "⏳ Aguardando serviços ficarem prontos..."
    sleep 15
    
    print_message "✅ Serviços iniciados com sucesso!"
    echo ""
    echo "🌐 Acesse a aplicação:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:3001"
    echo ""
    echo "📊 Para ver logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 Para parar:"
    echo "   docker-compose down"
}

# Função para mostrar status
show_status() {
    print_info "📊 Status dos containers:"
    docker-compose -f docker-compose.dev.yml ps
    echo ""
    print_info "🔍 Health checks:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Função para parar tudo
stop_all() {
    print_warning "🛑 Parando todos os serviços..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose down
    print_message "✅ Todos os serviços foram parados!"
}

# Função para limpar tudo
clean_all() {
    print_warning "🧹 Limpando containers, imagens e volumes..."
    docker-compose -f docker-compose.dev.yml down -v --rmi all
    docker-compose down -v --rmi all
    docker system prune -f
    print_message "✅ Limpeza concluída!"
}

# Menu principal
show_help() {
    echo "🧸 Reino dos Brinquedos - Docker Manager"
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  dev      - Iniciar em modo desenvolvimento (recomendado)"
    echo "  prod     - Iniciar em modo produção"
    echo "  status   - Mostrar status dos containers"
    echo "  stop     - Parar todos os serviços"
    echo "  clean    - Limpar containers e volumes"
    echo "  help     - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 dev     # Inicia em desenvolvimento"
    echo "  $0 status  # Mostra status"
    echo "  $0 stop    # Para tudo"
}

# Verificar Docker
check_docker

# Processar argumentos
case "${1:-help}" in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "status")
        show_status
        ;;
    "stop")
        stop_all
        ;;
    "clean")
        clean_all
        ;;
    "help"|*)
        show_help
        ;;
esac
