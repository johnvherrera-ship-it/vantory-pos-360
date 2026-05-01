# 🎨 Guía de Diseño - Vantory POS 360

## Sistema de Diseño Moderno

Rediseño visual completo con enfoque en usabilidad, modernidad y consistencia.

---

## 📐 Paleta de Colores

### Primarios (Azul Cielo)
- **Cielo 500** (`#0ea5e9`) - Color principal, CTAs, estados activos
- **Cielo 600** (`#0284c7`) - Hover, énfasis
- **Cielo 700** (`#0369a1`) - Presionado, estados oscuros

### Neutros (Slate)
- **Slate 900** (`#111827`) - Textos principales, encabezados
- **Slate 700** (`#374151`) - Textos secundarios
- **Slate 500** (`#6b7280`) - Textos terciarios, placeholders
- **Slate 200** (`#e5e7eb`) - Bordes, separadores
- **Slate 50** (`#f9fafb`) - Fondos claros, hover suave

### Estados
- **Verde** - Éxito, ganancias, valores positivos
- **Naranja** - Advertencia, stock bajo
- **Rojo** - Error, alertas críticas

---

## 🧩 Componentes Reutilizables

### Button
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md">Acción</Button>
<Button variant="secondary">Secundario</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Peligroso</Button>
<Button variant="success">Éxito</Button>
```

**Variantes:**
- `primary` - Azul cielo, para acciones principales
- `secondary` - Gris, para acciones secundarias
- `ghost` - Sin fondo, para acciones menos prominentes
- `danger` - Rojo, para acciones destructivas
- `success` - Verde, para confirmaciones

**Tamaños:**
- `sm` - Pequeño (px-3 py-1.5)
- `md` - Mediano (px-4 py-2.5) - **Recomendado**
- `lg` - Grande (px-6 py-3)

### Card
```tsx
import { Card, CardHeader, CardBody } from '@/components/ui';

<Card variant="default">
  <CardHeader 
    title="Mi Tarjeta"
    subtitle="Descripción"
    action={<Icon />}
  />
  <CardBody>
    Contenido aquí
  </CardBody>
</Card>
```

**Variantes:**
- `default` - Blanco con borde suave
- `interactive` - Efecto hover, interactiva
- `elevated` - Sombra mayor, más prominente
- `outlined` - Solo borde, sin relleno

### Stat (para métricas/KPIs)
```tsx
import { Stat } from '@/components/ui';

<Stat
  icon={<TrendingUp className="w-6 h-6" />}
  label="Ventas Totales"
  value="$1,234,567"
  sublabel="Información adicional"
  variant="primary"
  tooltip="Información del hover"
/>
```

**Variantes:**
- `primary` - Azul cielo
- `success` - Verde
- `warning` - Naranja
- `error` - Rojo

### Badge
```tsx
import { Badge } from '@/components/ui';

<Badge variant="success" size="md">Exitoso</Badge>
<Badge variant="warning">Advertencia</Badge>
<Badge variant="error" icon={<AlertCircle />}>Error</Badge>
```

---

## 🎯 Cambios Principales

### 1. **Sidebar/Navegación**
- ✅ Fondo degradado oscuro moderno (slate-900 a slate-950)
- ✅ Botones de navegación con estilo cielo-500 cuando están activos
- ✅ Secciones claras con tipografía actualizada
- ✅ Card de sucursal/terminal con gradiente azul

### 2. **Header**
- ✅ Blanco con borde inferior suave
- ✅ Botones de icono redondeados pequeños
- ✅ Avatar con borde slate-200
- ✅ Mejor contraste y legibilidad

### 3. **Dashboard**
- ✅ Fondo gris claro (slate-50)
- ✅ Cards con sombra suave y bordes slate-200
- ✅ Componentes Stat modernos con iconos coloreados
- ✅ Gráficos con colores coordinados (azul cielo)
- ✅ Cards interactivas con mejor espaciado

### 4. **Tipografía**
- ✅ Font: Inter (ya instalada)
- ✅ Pesos: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- ✅ Escala clara: h1/h2/h3, base, sm, xs

### 5. **Espaciado**
- ✅ Padding consistente en cards (p-6)
- ✅ Gaps coherentes (gap-4, gap-6, gap-8)
- ✅ Bordes redondeados modernos (rounded-lg, rounded-xl, rounded-2xl)

---

## 🔄 Variables Tailwind Disponibles

### Colores Personalizados
```css
/* Usar los colores en Tailwind */
<div className="bg-sky-500 text-slate-900">
  Ejemplo con colores del sistema
</div>
```

### Espaciado Extendido
```css
/* xs, sm, md, lg, xl, 2xl, 3xl */
<div className="p-lg gap-xl">
  Espaciado personalizado
</div>
```

### Sombras Personalizadas
```css
/* Sombras suaves y modernas */
<div className="shadow-md hover:shadow-lg">
  Sombra elegante
</div>
```

---

## 📱 Responsive Design

### Breakpoints
- `sm` - 640px
- `md` - 768px
- `lg` - 1024px
- `xl` - 1280px

### Ejemplo
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  Cards responsive
</div>
```

---

## ✨ Mejores Prácticas

1. **Siempre usar componentes UI** para consistencia
2. **Respetar la paleta de colores** - No inventar nuevos colores
3. **Mantener el espaciado coherente** - Usar valores de la escala
4. **Usar sombras sutiles** - shadow-sm, shadow-md, shadow-lg
5. **Bordes redondeados modernos** - rounded-lg mínimo
6. **Transiciones suaves** - Todos los elementos incluyen transition-all

---

## 🎬 Próximas Mejoras (Opcional)

- [ ] Componentes Select, Input, Textarea modernos
- [ ] Modales y Dialogs con animaciones
- [ ] Breadcrumbs mejorados
- [ ] Paginación moderna
- [ ] Loading states y skeletons
- [ ] Tema oscuro (dark mode)

---

**Versión:** 1.0  
**Última actualización:** 2026-04-15  
**Mantener actualizado:** Sí ✅
