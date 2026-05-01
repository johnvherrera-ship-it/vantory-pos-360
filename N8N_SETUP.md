# n8n Setup - Automatización de Inventario POS 360

Guía completa para configurar y ejecutar el workflow de actualización de inventario con n8n.

---

## 📋 Requisitos Previos

- **Docker** y **Docker Compose** instalados
- **curl** (para testing)
- **jq** (para parsing JSON - opcional pero recomendado)
- Puerto **5678** disponible (n8n)
- Puertos **5432** y **5433** disponibles (PostgreSQL)

### Instalar requisitos en Windows

```powershell
# Docker Desktop desde: https://www.docker.com/products/docker-desktop

# Con winget (Windows Package Manager)
winget install jqlang.jq
```

### Instalar requisitos en macOS

```bash
brew install docker docker-compose jq curl
```

### Instalar requisitos en Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose jq curl
sudo usermod -aG docker $USER
```

---

## 🚀 Inicio Rápido

### 1. Clona o descarga los archivos

```bash
cd vantory-pos-360

# Archivos necesarios:
# - n8n-workflow-inventario.json
# - docker-compose.yml
# - init-db.sql
# - n8n-cli.sh
```

### 2. Inicia los servicios

**En Windows (PowerShell):**
```powershell
docker-compose up -d
```

**En Mac/Linux:**
```bash
chmod +x n8n-cli.sh
./n8n-cli.sh start
```

### 3. Espera a que n8n esté listo

```bash
# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f n8n
```

Cuando veas: `"n8n is now ready"` ✓

### 4. Accede a n8n

Abre en tu navegador: **http://localhost:5678**

---

## 📊 Importar el Workflow

### Opción 1: Importar vía UI (Más fácil)

1. Ve a **Workflows** → **Create workflow**
2. Haz clic en el botón **···** (tres puntos) → **Import from file**
3. Selecciona `n8n-workflow-inventario.json`
4. Haz clic en **Import**

### Opción 2: Importar vía CLI

```bash
# Primero obtén tu API key de n8n
# Settings → API → Generate API Key

export N8N_API_KEY="your_api_key_here"

# Luego importa
./n8n-cli.sh import
```

### Opción 3: Importar vía cURL

```bash
curl -X POST http://localhost:5678/api/v1/workflows \
  -H "Content-Type: application/json" \
  -H "X-N8N-API-KEY: your_api_key" \
  -d @n8n-workflow-inventario.json
```

---

## ⚙️ Configurar Credenciales

Después de importar, necesitas configurar las credenciales:

### 1. PostgreSQL (Inventario)

1. Ve a **Credentials** → **Create new**
2. Selecciona **PostgreSQL**
3. Completa:
   ```
   Host: postgres-pos (nombre del servicio Docker)
   Port: 5432
   Database: pos_360
   User: pos_user
   Password: pos_password
   ```
4. Guarda y llama `postgres_creds`

### 2. Slack (Opcional - para notificaciones)

1. Ve a **Credentials** → **Create new**
2. Selecciona **Slack**
3. Conecta tu workspace de Slack
4. Autoriza la aplicación
5. Guarda como `slack_creds`

---

## 🧪 Testear el Workflow

### Opción 1: Vía UI

1. Abre el workflow
2. Haz clic en **Test** (arriba a la derecha)
3. Haz clic en **Webhook** → **Test Webhook**
4. Copia la URL del webhook
5. En otra terminal, envía datos:

```bash
curl -X POST http://localhost:5678/webhook/venta \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 1,
    "cantidad_vendida": 5
  }'
```

### Opción 2: Vía CLI

```bash
./n8n-cli.sh test
```

### Opción 3: Vía Postman

1. Importa esta colección:
```json
{
  "request": {
    "method": "POST",
    "url": "http://localhost:5678/webhook/venta",
    "body": {
      "producto_id": 1,
      "cantidad_vendida": 3
    }
  }
}
```

---

## 📊 Ver Datos del Inventario

### Conectarse a PostgreSQL

```bash
# Desde terminal
docker-compose exec postgres-pos psql -U pos_user -d pos_360

# Dentro de psql:
SELECT * FROM inventario;
SELECT * FROM historial_ventas;
SELECT * FROM alertas_inventario;
```

### O usando una UI (DataGrip, pgAdmin)

```
Host: localhost
Port: 5433
User: pos_user
Password: pos_password
Database: pos_360
```

---

## 🔄 Flujo Completo de Datos

```
Usuario/API
    ↓
┌─────────────────────────┐
│ Webhook POST /venta     │  ← Recibe {producto_id, cantidad}
├─────────────────────────┤
│ PostgreSQL SELECT       │  ← Lee stock actual
├─────────────────────────┤
│ Code Node               │  ← Calcula: nuevo_stock = actual - vendido
├─────────────────────────┤
│ IF Condition            │  ← ¿stock_nuevo >= 0?
├─────────────────────────┤
│ PostgreSQL UPDATE       │  ← Actualiza inventario
├─────────────────────────┤
│ Slack Notification      │  ← Notifica éxito/error
└─────────────────────────┘
    ↓
Database Updated ✓
```

---

## 📈 Monitorear Ejecuciones

### En la UI de n8n

1. Abre el workflow
2. Ve a la pestaña **Executions**
3. Haz clic en una ejecución para ver detalles
4. Expande cada nodo para ver inputs/outputs

### En los logs de Docker

```bash
# Logs en tiempo real
docker-compose logs -f n8n

# Logs de PostgreSQL
docker-compose logs -f postgres-pos
```

---

## 🛠️ Comandos Útiles CLI

```bash
# Ver estado de servicios
./n8n-cli.sh status

# Ver logs en tiempo real
./n8n-cli.sh logs

# Listar workflows
./n8n-cli.sh list

# Exportar un workflow (requiere ID)
./n8n-cli.sh export 1

# Detener servicios
./n8n-cli.sh stop

# Iniciar servicios
./n8n-cli.sh start

# Limpiar base de datos
./n8n-cli.sh clear-db
```

---

## 🔍 Troubleshooting

### n8n no inicia

```bash
# Ver logs
docker-compose logs n8n

# Reiniciar
docker-compose restart n8n

# Resetear
docker-compose down
docker-compose up -d
```

### Error: "Database connection failed"

```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps

# Reiniciar PostgreSQL
docker-compose restart postgres-pos

# Reiniciar n8n
docker-compose restart n8n
```

### Webhook no funciona

1. Verifica que el webhook esté **activo** en el workflow
2. Verifica la **ruta** correcta: `/venta`
3. Revisa los **logs** del webhook

```bash
# Ver logs del webhook
docker-compose logs n8n | grep -i webhook
```

### PostgreSQL: "Database does not exist"

```bash
# Recrear base de datos
docker-compose down -v  # ADVERTENCIA: Elimina datos
docker-compose up -d
```

---

## 📝 Estructura de Archivos

```
vantory-pos-360/
├── n8n-workflow-inventario.json   ← Workflow (JSON)
├── docker-compose.yml              ← Configuración Docker
├── init-db.sql                     ← Script SQL inicial
├── n8n-cli.sh                      ← Herramientas CLI
└── N8N_SETUP.md                    ← Esta guía
```

---

## 🚀 Próximos Pasos

### 1. Personalizar el Workflow

- **Cambiar canales de Slack**: Edita en el nodo "Slack"
- **Cambiar cantidad mínima de alerta**: Edita en el Code Node
- **Agregar más operaciones**: Añade nodos antes de Slack

### 2. Automaciones Adicionales

```
Opciones:
├─ Alertar si stock < cantidad_minima
├─ Registrar en Google Sheets
├─ Enviar email al proveedor
├─ Actualizar API externa
└─ Crear reporte diario
```

### 3. Desplegar en Producción

```bash
# 1. Cambiar variables de entorno en docker-compose.yml
# 2. Usar dominio real en vez de localhost
# 3. Configurar SSL/TLS
# 4. Hacer backup de datos
# 5. Monitorear con Sentry o similar
```

---

## 📞 Soporte

### Recursos

- **n8n Docs**: https://docs.n8n.io
- **n8n Community**: https://community.n8n.io
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Docker Docs**: https://docs.docker.com

### Común Issues

**¿El webhook no dispara?**
- Asegúrate de que esté **active** en el workflow
- Verifica que el método sea **POST**
- Usa la URL correcta con `/webhook/` prefijo

**¿Los datos no se guardan?**
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en el nodo PostgreSQL
- Mira los logs para ver errores SQL

**¿Slack no notifica?**
- Verifica que el token de Slack sea válido
- Verifica que el canal exista
- Revisa que tengas permisos en el workspace

---

## 📊 Dashboard de Ejemplo

Después de unas cuantas ejecuciones, verás en n8n:

```
Dashboard
├─ Workflows: 1
├─ Executions: 12
│  ├─ Success: 11 ✓
│  └─ Failed: 1 ✗
├─ Avg Execution Time: 245ms
└─ Data Processed: 55 items
```

---

## 🎉 ¡Listo!

Tu automatización de inventario con n8n está funcionando.

Ahora puedes:
- ✅ Recibir ventas vía webhook
- ✅ Actualizar inventario automáticamente
- ✅ Recibir notificaciones en Slack
- ✅ Registrar historial en PostgreSQL

¿Siguiente paso? Agrega más automatizaciones o integra con otros sistemas.

