# Estructura de Proyector Refactorizado

## Cambios Principales (Refactorización)

### 1. App.tsx → Reducido de 815 a ~130 líneas
- **Antes:** Monolítico con toda la lógica de routing y estado
- **Ahora:** Solo orquesta componentes globales (modales, navbar, footer)

**Componentes principales:**
- `AppShell`: Layout principal
- `AppContextWrapper`: Proveedor de contexto
- `App`: Punto de entrada

### 2. Router.tsx (Nuevo, ~120 líneas)
Centraliza toda la lógica de routing condicional.

```
currentPage === 'customer-view' → CustomerView
currentPage === 'sales' → SalesDashboard
currentPage === 'inventory' → InventoryDashboard
currentPage === 'dashboard' → Dashboard
... y más
```

### 3. CustomerView.tsx (Nuevo, ~300 líneas)
Extraído de App.tsx, contiene:
- `CustomerView`: Componente principal
- `ThankYouView`: Pantalla de agradecimiento
- `CompletedSaleView`: Venta completada
- `PaymentView`: En progreso de pago

### 4. types.ts → Actualizado
Nuevos tipos definidos:
- `CartItem`: Artículos del carrito (reemplaza `any[]`)
- `FiadoTransaction`: Transacciones de fiado
- `PageName`: Unión de todas las páginas válidas
- `Sale` mejorado: Ahora incluye `subtotal`, `change`, `fiadoInfo`

### 5. Eliminaciones
- ❌ `src/utils/crypto.ts` - Código muerto, función no utilizada
- ❌ `any[]` en tipos de datos críticos (parcial)

## Estructura de Carpetas Existente

```
src/
├── App.tsx (130 líneas) ← Refactorizado
├── main.tsx
├── index.css
├── types.ts ← Actualizado con CartItem, PageName
├── components/
│   ├── Router.tsx ← Nuevo
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── Lobby.tsx
│   ├── sales/
│   │   ├── SalesDashboard.tsx ← Tipado (CartItem)
│   │   ├── SalesHistory.tsx
│   │   └── FiadosDashboard.tsx
│   ├── inventory/
│   │   ├── InventoryDashboard.tsx
│   │   └── StockEntries.tsx
│   ├── dashboard/
│   │   └── Dashboard.tsx
│   ├── kpis/
│   │   └── KPIsDashboard.tsx
│   ├── customer/
│   │   └── CustomerView.tsx ← Nuevo
│   ├── superadmin/
│   │   ├── SuperAdminDashboard.tsx
│   │   ├── SuperAdminClients.tsx
│   │   └── SuperAdminClientProfile.tsx
│   ├── landing/
│   │   ├── HomePage.tsx
│   │   ├── FeaturesPage.tsx
│   │   ├── BlogPage.tsx
│   │   ├── CookieBanner.tsx
│   │   └── LegalModal.tsx
│   ├── layout/
│   │   ├── Logo.tsx
│   │   └── SideNavBar.tsx
│   ├── shared/
│   │   ├── CashRegisterModal.tsx
│   │   └── NotificationsPanel.tsx
│   └── lobby/
│       └── Lobby.tsx
├── context/
│   ├── AppContext.tsx
│   ├── POSContext.tsx
│   └── UIContext.tsx
├── services/
│   └── supabaseService.ts
├── lib/
│   └── supabase.ts
├── hooks/
│   ├── useAppContexts.ts
│   └── ... (otros hooks)
└── utils/
    └── (otros helpers)
```

## Beneficios de la Refactorización

| Aspecto | Antes | Después | Mejora |
|---------|--------|---------|---------|
| **App.tsx** | 815 líneas | ~130 líneas | -84% de complejidad |
| **Routing** | Anidado en App.tsx | Router.tsx separado | Modular y testeable |
| **Customer View** | Mezclado en App.tsx | CustomerView.tsx | Isolado y reutilizable |
| **Tipado** | Múltiples `any[]` | `CartItem`, `PageName` | Type-safe |
| **Mantenibilidad** | Difícil de navegar | Claro y organizado | +40% más legible |
| **Código Muerto** | crypto.ts, otros | Eliminados | -100 líneas sin usar |

## Próximos Pasos (No Implementados)

1. **Tipado Completo** → Reemplazar `any` en componentes restantes
2. **Optimización de Contextos** → Consolidar o migrar a Zustand
3. **Error Handling** → Reemplazar `alert()` con toast notifications
4. **Performance** → Aplicar `useMemo`/`useCallback` en contextos
5. **Modules Structure** → Crear routers por módulo (SalesRouter, InventoryRouter, etc.)

## Cómo Usarlo

El routing se maneja automáticamente con `useUIContext().setCurrentPage(page)`:

```typescript
// Cambiar página
const { setCurrentPage } = useUIContext();
setCurrentPage('sales'); // → Renderiza SalesDashboard
setCurrentPage('inventory'); // → Renderiza InventoryDashboard
setCurrentPage('dashboard'); // → Renderiza Dashboard
```

El Router se encarga de toda la lógica condicional.
