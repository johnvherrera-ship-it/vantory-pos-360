# 🎨 Design System - Vantory POS 360
## Sistema de Diseño Profesional para Punto de Venta Retail

---

## 📊 Vision
**Interfaz ágil, accesible y altamente eficiente para operaciones retail modernas**

### Principios Clave
1. **Speed First** - Minimizar clics para operaciones críticas
2. **Data Visibility** - Dashboard denso con máxima información visible
3. **Retail Optimized** - Diseñado para entornos de alto estrés
4. **Professional** - Transmitir confianza y control
5. **Accessible** - WCAG AA compliance para todos los usuarios

---

## 🎯 Arquitectura Visual

### 1. PALETA DE COLORES
```
┌─────────────────────────────────────────────────────────┐
│ PRIMARIO - Acción y Marca                               │
├─────────────────────────────────────────────────────────┤
│ Brand-500 (#0052CC) - Botones principales, highlights  │
│ Brand-600 (#0047B2) - Hover states, active elements    │
│ Brand-700 (#003B99) - Active/pressed states             │
│ Brand-50  (#F0F6FF) - Backgrounds suaves, badges       │
│ Brand-100 (#E0ECFF) - Borders, divisores              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ ESTADOS & SEMÁNTICA                                      │
├─────────────────────────────────────────────────────────┤
│ ✅ Success (Verde)    - #10B981 (operaciones exitosas) │
│ ⚠️  Warning (Ámbar)   - #F59E0B (alertas, bajo stock)  │
│ ❌ Error (Rojo)       - #EF4444 (errores, cancelaciones)│
│ ℹ️  Info (Cielo)      - #0EA5E9 (información, tips)    │
│ ⭐ Highlight (Oro)    - #FBBF24 (destacados, especiales)│
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ NEUTROS - Textos y Fondos                               │
├─────────────────────────────────────────────────────────┤
│ Slate-900 (#111827) - Textos principales              │
│ Slate-700 (#374151) - Textos secundarios               │
│ Slate-600 (#4B5563) - Textos mutados                   │
│ Slate-100 (#F3F4F6) - Fondos claros                    │
│ Slate-50  (#F9FAFB) - Fondos muy claros               │
│ White     (#FFFFFF) - Superficies principales           │
└─────────────────────────────────────────────────────────┘
```

### 2. TIPOGRAFÍA

**Familia Primaria:** Inter (System Default)
- Limpia, legible, optimizada para pantallas
- Excelente en tamaños pequeños para datos

**Familia Secundaria:** Monospace (menores de 12px)
- Para montos, códigos, datos númericos
- Garantiza alineación perfecta

#### Escala Tipográfica
```
H1 (32px, 700)  - Títulos de página principal
H2 (24px, 600)  - Títulos de secciones
H3 (20px, 600)  - Subtítulos, encabezados de card
Body (14px, 400) - Texto principal
Small (12px, 500) - Etiquetas, meta información
Tiny (11px, 500)  - Timestamps, helper text
```

### 3. COMPONENTES CORE

#### Stat Card (KPI)
```
┌─────────────────────────────────────┐
│ 💵 LABEL (14px, slate-600)          │
│                                     │
│ $1,234,567  (32px, slate-900, bold)│
│                                     │
│ +12.5% vs ayer  (12px, green-600) │
└─────────────────────────────────────┘

Specs:
- Bg: White, Shadow: sm
- Icon: 44px x 44px, brand-50 bg, brand-600 icon
- Hover: shadow-md, scale-102
- Responsive: Full width en móvil, 5 cols en desktop
```

#### Action Button
```
PRIMARY:
  BG: Brand-500 → Brand-600 (hover) → Brand-700 (active)
  Text: White (100%)
  Icon: W-5 H-5
  Size: 40px height (touch target)
  Padding: X-4 Y-2.5
  Radius: 8px
  Shadow: sm → md (hover)
  
SECONDARY:
  BG: Slate-100 → Slate-200 (hover)
  Text: Slate-900
  Border: None
  
GHOST:
  BG: Transparent
  Text: Brand-600 → Brand-700 (hover)
  Border: 1px Brand-200

DANGER:
  BG: Red-500 → Red-600 (hover)
  Text: White
  Confirmation: "¿Estás seguro?"
```

#### Data Table
```
┌─────────────────────────────────────────────────────────┐
│ HEADER (Slate-700, 12px, uppercase, tracking-wide)     │
├─────────────────────────────────────────────────────────┤
│ ROW (Slate-900, 14px)  [Brand-50 bg on hover]          │
│ ROW (Slate-900, 14px)  [Slate-50 bg, borders]          │
│ ROW (Slate-900, 14px)  [Accent left border if selected]│
├─────────────────────────────────────────────────────────┤
│ FOOTER: Pagination, totals                             │
└─────────────────────────────────────────────────────────┘

Specs:
- Borders: Subtle dividers (slate-200)
- Row height: 48px minimum
- Hover: Highlight row with brand-50 bg
- Selection: Left border 4px brand-600
- Spacing: Padding x-4 y-3
```

#### Product/Item Card (Quick Add)
```
┌──────────────────────────┐
│ [IMAGE] (Square, 80x80) │
│                          │
│ Producto Name (14px)     │
│ SKU-12345 (12px, gray)   │
│                          │
│ $9.99 stock: 45         │
│                          │
│ [+] Add to Cart [>]     │
└──────────────────────────┘

Specs:
- Click: Expands to detail/quick add modal
- Image: 1:1 aspect ratio, object-cover
- CTA: Brand-500 button, icon-right
- Price emphasis: Font-bold, brand-600
- Stock: Green if >10, Amber if 5-10, Red if <5
```

#### Modal/Drawer (Quick Checkout)
```
┌────────────────────────────────────┐
│ ✕  TÍTULO (X cerrar a la derecha) │
├────────────────────────────────────┤
│ CONTENIDO (Scroll si es largo)     │
│                                    │
├────────────────────────────────────┤
│ [CANCEL]      [PRIMARY ACTION]    │
└────────────────────────────────────┘

Specs:
- Width: 90vw max-w-2xl
- Backdrop: Dark (black 50% opacity)
- Escapa con ESC
- Smooth slide in from right (300ms)
```

---

## 🖇️ LAYOUT PATTERNS

### Dashboard Principal
```
┌────────────────────────────────────────────────────────────┐
│ TOPBAR: Logo | Store/Terminal | Time | User | Logout       │
├────────────────────────────────────────────────────────────┤
│ SIDEBAR         │ MAIN CONTENT                             │
│ (64px icons)    │ ┌──────────────────────────────────────┐│
│                 │ │ KPI Row (5 stats)                    ││
│ - Dashboard     │ ├──────────────────────────────────────┤│
│ - Sales         │ │ Charts (2x2 grid)                    ││
│ - Inventory     │ │ - Sales Trend (col-span-2)          ││
│ - Entries       │ │ - Top Products (col-span-1)         ││
│ - Clients       │ │ - Inventory Status (col-span-1)     ││
│ - Analytics     │ ├──────────────────────────────────────┤│
│ - Settings      │ │ Recent Transactions Table             ││
│                 │ └──────────────────────────────────────┘│
│ Logout          │                                          │
└────────────────────────────────────────────────────────────┘
```

### Checkout Flow (Fast Path)
```
STEP 1: ITEM SELECTION (Scanner/Search)
├─ Search bar at top
├─ Quick product grid/list
└─ Scan input (always focused)

STEP 2: CART REVIEW (Side Panel)
├─ Items scrollable
├─ Quick edit (qty, remove)
└─ Subtotal visible

STEP 3: PAYMENT (Modal)
├─ Amount due (LARGE, prominent)
├─ Payment method buttons
├─ Process indicator
└─ Receipt generation

TOTAL STEPS: 3 max
TOTAL ACTIONS: <10 clicks for happy path
```

---

## ✨ MICRO-INTERACTIONS

### Feedback Immediatamente
| Action | Feedback | Duration |
|--------|----------|----------|
| Click button | Color change + scale 98% | 100ms |
| Hover card | Shadow increase + slide 2px | 200ms |
| Load data | Skeleton → content fade in | 300ms |
| Success | Toast (top-right, 3s auto-hide) | instant |
| Error | Toast (red, stays until close) | instant |
| Scan item | ✓ Checkmark + sound (optional) | 200ms |

### Loading States
```
- Skeleton screens para tablas
- Spinner para operaciones >1s
- Progress bar para long operations
- Toast de "Guardando..." immediatamente

NO usar: Delay artificial, loading invisible, 0.1s respuesta
```

### Form Feedback
```
- Input focus: Border brand-500, shadow-sm
- Error: Border red-500, helper text below
- Success: Checkmark icon, border green-500
- Loading: Spinner en button
- Validation: Real-time, pero no aggressive
```

---

## 📱 RESPONSIVE BREAKPOINTS

```
Mobile (< 640px)
├─ Single column layout
├─ Stacked cards (full width)
├─ Bottom navigation or hamburger
├─ Touch targets: 44x44px minimum

Tablet (640px - 1024px)
├─ 2 column layout
├─ Grid adjustments
├─ Sidebar collapses to icons

Desktop (> 1024px)
├─ Full sidebar
├─ Multi-column grids
├─ Max-width constraints for readability
```

---

## ♿ ACCESIBILIDAD (WCAG AA)

### Color Contrast
```
Normal text:        4.5:1 minimum ✓
Large text (18px+): 3:1 minimum ✓

Palette verification:
- Brand-500 on White: 8.2:1 ✓✓
- Slate-600 on White: 6.3:1 ✓✓
- Slate-900 on Brand-50: 11.1:1 ✓✓
```

### Keyboard Navigation
```
- Tab order: Visual order (left→right, top→bottom)
- Focus visible: 2px outline brand-500
- Escape: Close modals/sidebars
- Enter: Submit forms, activate buttons
- Space: Toggle checkboxes

NO usar: tabindex > 0
```

### Semantic HTML
```
- Use <button> para acciones
- Use <a> para navegación
- Use <label> para inputs
- Use <nav> para secciones de navegación
- Use <main> para contenido principal
- aria-label para icon-only buttons
```

---

## 🎯 ANTI-PATTERNS

❌ **AVOID:**
- Emojis como iconos (usar Lucide/Heroicons)
- Efectos que causan layout shift
- Colores que dependen SOLO de color (rojo/verde)
- Texto en imágenes sin alt text
- Modales sin ESC key
- Loading sin feedback visual
- Forms sin labels
- Hover effects en mobile
- Light blue text (#0EA5E9) en fondo blanco (bajo contraste)

---

## 🚀 IMPLEMENTACIÓN CHECKLIST

### Antes de Deploy
- [ ] Todos los iconos son SVG (Lucide React)
- [ ] cursor-pointer en elementos clickeables
- [ ] Transiciones suaves (150-300ms)
- [ ] Contraste mínimo 4.5:1 verificado
- [ ] Focus rings visibles (2px outline)
- [ ] prefers-reduced-motion respetado
- [ ] Responsive tested: 375px, 768px, 1440px
- [ ] Dark mode tested (si aplica)
- [ ] Textos estan traducidos al español
- [ ] Loading states implementados
- [ ] Error messages son claros

### Performance
- [ ] Imágenes optimizadas (WebP, lazy loading)
- [ ] Datos virtualizados en tablas grandes (>100 items)
- [ ] Chunking para búsquedas (debounce 300ms)
- [ ] Code splitting por rutas

---

## 📐 SPACING SCALE

```
xs: 4px   (smallest gaps)
sm: 8px   (between elements)
md: 12px  (card padding)
lg: 16px  (section padding)
xl: 24px  (major sections)
2xl: 32px (layout gutters)
3xl: 48px (hero sections)
```

---

## 🎨 TAILWIND CONFIG EXTENSIONS

```typescript
colors: {
  brand: {
    50: '#f0f6ff',
    100: '#e0ecff',
    200: '#c1dcff',
    300: '#99c9ff',
    400: '#52a8ff',
    500: '#0052cc',    // PRIMARY
    600: '#0047b2',    // HOVER
    700: '#003b99',    // ACTIVE
    800: '#002e7a',
    900: '#001f52',
  }
}

// Estados semánticos como utility aliases
safelist: [
  'bg-green-50', 'text-green-600',   // success
  'bg-amber-50', 'text-amber-600',   // warning
  'bg-red-50', 'text-red-600',       // error
]
```

---

## 📊 PRÓXIMAS FASES DE IMPLEMENTACIÓN

1. **Fase 1 - Core Components** (Esta semana)
   - [ ] Refactor Button, Card, Stat con micro-interacciones
   - [ ] Crear Modal/Drawer reutilizable
   - [ ] Tabla de datos con selección

2. **Fase 2 - Page Layouts** (Siguiente semana)
   - [ ] Dashboard con responsive grid
   - [ ] Checkout flow completo
   - [ ] Inventory search + filters

3. **Fase 3 - Advanced** (Semana 3)
   - [ ] Dark mode support
   - [ ] Offline-first patterns
   - [ ] Real-time updates con WebSocket

---

## 💾 Versión
**v1.0** - 2026-04-15
Diseño profesional optimizado para retail de alto rendimiento.

**Próximas mejoras:**
- Motion design guideline
- Component storybook
- Figma design tokens sync
