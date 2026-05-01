# 🚀 Guía de Inicio Rápido - Componentes Modernos

## Importaciones

```tsx
import { Button, Card, CardHeader, CardBody, Badge, Stat } from '@/components/ui';
import { TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
```

---

## Ejemplos Rápidos

### 1. Botones

```tsx
// Primario
<Button variant="primary" size="md">Guardar</Button>

// Secundario
<Button variant="secondary">Cancelar</Button>

// Peligroso
<Button variant="danger">Eliminar</Button>

// Con icono
<Button icon={<Download className="w-5 h-5" />}>Descargar</Button>

// Ancho completo
<Button fullWidth>Registrar</Button>

// Loading
<Button loading>Enviando...</Button>
```

**Variantes:** `primary`, `secondary`, `ghost`, `danger`, `success`  
**Tamaños:** `sm`, `md`, `lg`

---

### 2. Cards

```tsx
// Simple
<Card>
  <div className="p-6">Mi contenido</div>
</Card>

// Con header
<Card variant="elevated">
  <CardHeader title="Título" subtitle="Subtítulo" />
  <CardBody>
    <p>Mi contenido aquí</p>
  </CardBody>
</Card>

// Con acción
<Card variant="elevated">
  <CardHeader 
    title="Últimas Transacciones"
    action={<RefreshCw className="w-5 h-5" />}
  />
  <CardBody>
    {/* Contenido */}
  </CardBody>
</Card>
```

**Variantes:** `default`, `interactive`, `elevated`, `outlined`

---

### 3. Badges

```tsx
// Simple
<Badge>Por defecto</Badge>

// Con variante
<Badge variant="success">Completado</Badge>
<Badge variant="warning">En progreso</Badge>
<Badge variant="error">Error</Badge>

// Con icono
<Badge variant="success" icon={<CheckCircle className="w-4 h-4" />}>
  Éxito
</Badge>

// Tamaños
<Badge size="sm">Pequeño</Badge>
<Badge size="md">Mediano</Badge>
```

**Variantes:** `default`, `success`, `warning`, `error`, `info`  
**Tamaños:** `sm`, `md`

---

### 4. Stats (KPIs)

```tsx
<Stat
  icon={<TrendingUp className="w-6 h-6" />}
  label="Ventas Hoy"
  value="$12,345"
  sublabel="Incremento de 12% vs ayer"
  variant="success"
  tooltip="Ingresos totales de hoy"
/>
```

**Variantes:** `primary`, `success`, `warning`, `error`

---

## Casos de Uso

### Dashboard de Vendedor

```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
  <Stat
    icon={<DollarSign className="w-6 h-6" />}
    label="Ingresos Hoy"
    value="$5,234"
    variant="success"
  />
  <Stat
    icon={<ShoppingCart className="w-6 h-6" />}
    label="Transacciones"
    value="45"
    variant="primary"
  />
  <Stat
    icon={<Users className="w-6 h-6" />}
    label="Clientes Nuevos"
    value="12"
    variant="primary"
  />
  <Stat
    icon={<AlertCircle className="w-6 h-6" />}
    label="Stock Bajo"
    value="3"
    variant="warning"
  />
</div>
```

### Formulario Modal

```tsx
<Card variant="elevated" className="max-w-md">
  <CardHeader title="Nueva Venta" />
  <CardBody>
    <input 
      type="text" 
      placeholder="Buscar producto"
      className="w-full px-4 py-2 border border-slate-200 rounded-lg"
    />
    <div className="mt-4 space-y-2">
      <Button fullWidth variant="primary">Agregar al Carrito</Button>
      <Button fullWidth variant="secondary">Cancelar</Button>
    </div>
  </CardBody>
</Card>
```

### Listado con Estados

```tsx
<Card variant="elevated">
  <CardHeader title="Órdenes Recientes" />
  <CardBody>
    {orders.map(order => (
      <div key={order.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg mb-2">
        <div>
          <p className="font-semibold">Orden #{order.id}</p>
          <Badge variant={order.status === 'completed' ? 'success' : 'warning'}>
            {order.status}
          </Badge>
        </div>
        <p className="text-lg font-bold">${order.total}</p>
      </div>
    ))}
  </CardBody>
</Card>
```

---

## Colores Disponibles

### Usar en Tailwind

```tsx
// Primario (Azul Cielo)
className="bg-sky-500 hover:bg-sky-600 text-white"

// Neutro
className="bg-slate-100 text-slate-900 border border-slate-200"

// Estados
className="bg-green-100 text-green-700"  // éxito
className="bg-amber-100 text-amber-700"  // advertencia
className="bg-red-100 text-red-700"      // error
```

---

## Espaciado Recomendado

```tsx
// Padding
<Card className="p-4">Pequeño</Card>
<Card className="p-6">Estándar (recomendado)</Card>
<Card className="p-8">Grande</Card>

// Gaps
<div className="space-y-2">Items compactos</div>
<div className="space-y-4">Items normales</div>
<div className="space-y-6">Items distanciados</div>

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  Items
</div>
```

---

## Bordes Redondeados

```tsx
className="rounded-lg"    // Botones, inputs
className="rounded-xl"    // Cards pequeñas
className="rounded-2xl"   // Cards grandes
className="rounded-full"  // Avatares, badges
```

---

## Estados y Transiciones

```tsx
// Hover
className="hover:bg-slate-100 transition-colors"

// Focus
className="focus:outline-none focus:ring-2 focus:ring-sky-500"

// Disabled
className="disabled:opacity-60 disabled:cursor-not-allowed"

// Active
className="active:scale-95 transition-transform"
```

---

## Patrones Comunes

### Card Interactiva

```tsx
<Card 
  variant="interactive"
  onClick={() => handleClick()}
  className="cursor-pointer"
>
  <CardBody>Haz clic aquí</CardBody>
</Card>
```

### Grid Responsive

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card><CardBody>Item 1</CardBody></Card>
  <Card><CardBody>Item 2</CardBody></Card>
  <Card><CardBody>Item 3</CardBody></Card>
</div>
```

### Header con Acciones

```tsx
<Card variant="elevated">
  <CardHeader
    title="Inventario"
    action={
      <Button variant="ghost" size="sm">
        <RefreshCw className="w-4 h-4" />
      </Button>
    }
  />
  <CardBody>
    {/* Lista de inventario */}
  </CardBody>
</Card>
```

---

## Checklist de Estilo

- ✅ ¿Usas componentes en lugar de HTML directo?
- ✅ ¿El espaciado es consistente (p-6, gap-6)?
- ✅ ¿Los colores están en la paleta?
- ✅ ¿Las sombras son sutiles (shadow-sm, shadow-md)?
- ✅ ¿El texto tiene buen contraste?
- ✅ ¿Los bordes redondeados son modernos (rounded-lg+)?

---

## Iconos Recomendados

De [lucide-react](https://lucide.dev):

```tsx
// Acciones
<Download />
<Upload />
<RefreshCw />
<Settings />
<X />

// Estados
<CheckCircle />
<AlertCircle />
<Clock />
<TrendingUp />
<TrendingDown />

// Categorías
<DollarSign />
<ShoppingCart />
<Package />
<Users />
<BarChart3 />
```

---

## Recursos

📖 **Guía Completa:** `DESIGN_GUIDE.md`  
📊 **Resumen Visual:** `REDISENO_RESUMEN.md`  
✅ **Cambios:** `CAMBIOS_COMPLETADOS.md`  
🎨 **Sistema:** `src/styles/design-system.ts`  
🧩 **Componentes:** `src/components/ui/`

---

## Comando Útil

Verificar sintaxis TypeScript:
```bash
npm run lint
```

Build del proyecto:
```bash
npm run build
```

Desarrollo:
```bash
npm run dev
```

---

**¡Listo para crear! 🎉**

Usa esta guía para construir interfaces modernas y consistentes.
