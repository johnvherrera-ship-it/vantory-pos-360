#!/bin/bash

# n8n Workflow Manager Script
# Uso: ./n8n-cli.sh [comando] [opciones]

set -e

N8N_BASE_URL="http://localhost:5678"
WORKFLOW_FILE="n8n-workflow-inventario.json"
API_KEY="${N8N_API_KEY:-}"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones auxiliares
print_header() {
    echo -e "${BLUE}=====================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=====================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Comando: help
show_help() {
    print_header "n8n Workflow Manager - Ayuda"
    cat << EOF

Comandos disponibles:

  start              Inicia los servicios Docker (n8n + PostgreSQL)
  stop               Detiene todos los servicios Docker
  status             Muestra el estado de los servicios
  logs               Muestra los logs de n8n

  import             Importa el workflow desde archivo JSON
  export ID          Exporta un workflow (requiere ID del workflow)
  list               Lista todos los workflows

  test               Ejecuta un test de venta en el workflow
  clear-db           Limpia la base de datos de n8n

  help               Muestra esta ayuda

Ejemplos:

  ./n8n-cli.sh start
  ./n8n-cli.sh import
  ./n8n-cli.sh test
  ./n8n-cli.sh list

EOF
}

# Docker commands
docker_start() {
    print_header "Iniciando servicios Docker"

    if ! command -v docker &> /dev/null; then
        print_error "Docker no está instalado"
        exit 1
    fi

    docker-compose up -d

    print_success "Servicios iniciados"
    print_info "n8n está disponible en: $N8N_BASE_URL"
    print_info "PostgreSQL (n8n): localhost:5432"
    print_info "PostgreSQL (POS): localhost:5433"

    # Esperar a que n8n esté listo
    print_info "Esperando a que n8n esté listo..."
    for i in {1..30}; do
        if curl -s "$N8N_BASE_URL/healthz" > /dev/null 2>&1; then
            print_success "n8n está listo"
            return 0
        fi
        sleep 1
    done

    print_warning "n8n tardó mucho en iniciarse, pero intentaremos continuar"
}

docker_stop() {
    print_header "Deteniendo servicios Docker"
    docker-compose down
    print_success "Servicios detenidos"
}

docker_status() {
    print_header "Estado de servicios Docker"
    docker-compose ps
}

docker_logs() {
    print_header "Logs de n8n (Ctrl+C para salir)"
    docker-compose logs -f n8n
}

# Workflow commands
import_workflow() {
    print_header "Importando workflow"

    if [ ! -f "$WORKFLOW_FILE" ]; then
        print_error "Archivo $WORKFLOW_FILE no encontrado"
        exit 1
    fi

    print_info "Leyendo archivo: $WORKFLOW_FILE"

    # Extraer datos del workflow
    WORKFLOW_NAME=$(jq -r '.name' "$WORKFLOW_FILE")

    # Crear workflow usando la API de n8n
    print_info "Creando workflow: $WORKFLOW_NAME"

    RESPONSE=$(curl -s -X POST "$N8N_BASE_URL/api/v1/workflows" \
        -H "Content-Type: application/json" \
        -H "X-N8N-API-KEY: $API_KEY" \
        -d @"$WORKFLOW_FILE")

    WORKFLOW_ID=$(echo "$RESPONSE" | jq -r '.data.id // empty')

    if [ -z "$WORKFLOW_ID" ]; then
        print_error "No se pudo crear el workflow"
        echo "$RESPONSE" | jq '.'
        exit 1
    fi

    print_success "Workflow creado con ID: $WORKFLOW_ID"
    print_info "URL: $N8N_BASE_URL/workflow/$WORKFLOW_ID"
}

export_workflow() {
    if [ -z "$1" ]; then
        print_error "Se requiere el ID del workflow"
        echo "Uso: ./n8n-cli.sh export <ID>"
        exit 1
    fi

    WORKFLOW_ID=$1
    print_header "Exportando workflow"
    print_info "ID: $WORKFLOW_ID"

    RESPONSE=$(curl -s -X GET "$N8N_BASE_URL/api/v1/workflows/$WORKFLOW_ID" \
        -H "X-N8N-API-KEY: $API_KEY")

    OUTPUT_FILE="export-workflow-$WORKFLOW_ID.json"
    echo "$RESPONSE" | jq '.data' > "$OUTPUT_FILE"

    print_success "Workflow exportado a: $OUTPUT_FILE"
}

list_workflows() {
    print_header "Listando workflows"

    RESPONSE=$(curl -s -X GET "$N8N_BASE_URL/api/v1/workflows" \
        -H "X-N8N-API-KEY: $API_KEY")

    echo "$RESPONSE" | jq '.data[] | {id, name, active}' || echo "$RESPONSE" | jq '.'
}

# Test command
test_workflow() {
    print_header "Ejecutando test de venta"

    # Datos de prueba
    PRODUCT_ID=1
    QUANTITY=5
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    print_info "Enviando venta:"
    print_info "  - Producto ID: $PRODUCT_ID"
    print_info "  - Cantidad: $QUANTITY"

    # Obtener URL del webhook desde el archivo JSON
    WEBHOOK_PATH=$(jq -r '.nodes[] | select(.name == "Webhook - Recibir Venta") | .parameters.path' "$WORKFLOW_FILE")

    if [ -z "$WEBHOOK_PATH" ]; then
        print_error "No se encontró la ruta del webhook"
        exit 1
    fi

    WEBHOOK_URL="$N8N_BASE_URL/webhook/$WEBHOOK_PATH"

    # Enviar solicitud
    RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d '{
            "producto_id": '$PRODUCT_ID',
            "cantidad_vendida": '$QUANTITY'
        }')

    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

    print_success "Test completado"
    print_info "Revisa los logs en n8n para ver el resultado"
}

# Database commands
clear_db() {
    print_header "Limpiando base de datos de n8n"
    print_warning "Esto eliminará todos los datos de n8n"
    read -p "¿Continuar? (s/n) " -n 1 -r
    echo

    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        print_info "Cancelado"
        return 0
    fi

    docker-compose exec postgres dropdb -U n8n_user n8n
    docker-compose exec postgres createdb -U n8n_user n8n

    print_success "Base de datos limpiada"
}

# Main
main() {
    if [ $# -eq 0 ]; then
        show_help
        exit 0
    fi

    case "$1" in
        start)
            docker_start
            ;;
        stop)
            docker_stop
            ;;
        status)
            docker_status
            ;;
        logs)
            docker_logs
            ;;
        import)
            import_workflow
            ;;
        export)
            export_workflow "$2"
            ;;
        list)
            list_workflows
            ;;
        test)
            test_workflow
            ;;
        clear-db)
            clear_db
            ;;
        help)
            show_help
            ;;
        *)
            print_error "Comando desconocido: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
