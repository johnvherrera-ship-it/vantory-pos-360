# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vantory POS 360 is a React-based Point of Sale (POS) system built with Vite and TypeScript. It's an AI Studio app that integrates with Google Gemini API for AI capabilities. The application manages sales, inventory, users, cash registers, and provides analytics dashboards for retail operations.

## Comunicación y Eficiencia

**Preferencias de trabajo:**
- Responder siempre en español
- Comunicación concisa: evitar explicaciones innecesarias
- No mostrar contenido redundante
- Asumir comprensión del proyecto (no releer todo el historial)
- Ir directo al punto en tareas

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking (no emit)
npm run lint

# Clean build output
npm clean
```

### Environment Setup

1. Copy `.env.example` to `.env.local`
2. Set `GEMINI_API_KEY` with your Google Gemini API key
3. Set `APP_URL` with the deployed application URL (auto-injected by AI Studio)

## Code Architecture

### Entry Point & Main App
- **src/main.tsx** - React app initialization
- **src/App.tsx** - Main application component (contains most of the app logic - very large file ~400KB)
  - Implements routing and state management for the entire POS system
  - Contains all major feature components and views
  - State-driven navigation between pages/modules
  - Handles all data operations and API interactions

### Component Structure
```
src/components/
├── auth/           # Login and authentication flows
├── layout/         # Shared layout (SideNavBar, Logo)
├── dashboard/      # Main dashboard view
├── sales/          # Sales dashboard, history, fiados management
├── inventory/      # Stock management and inventory dashboards
├── users/          # User management and permissions
├── kpis/          # KPI and analytics dashboards
├── analytics/      # Analytics visualizations
├── superadmin/     # SaaS client and super admin features
├── common/         # Shared components
└── landing/        # Landing page, blog, features, legal
```

### Core Concepts

**Page Navigation**: The app uses a page-based architecture. The `currentPage` state in App.tsx drives which component renders. Users navigate via `setCurrentPage()` calls.

**User Roles & Permissions**: User objects have a `modules` array that controls which pages they can access. Always check `currentUser.modules.includes(pageName)` before rendering navigation items for specific features.

**Data Model**: Core entities defined in `src/types.ts`:
- **User** - App users with role-based access control
- **Store** - Retail locations (one client can have multiple stores)
- **POS** - Point of sale terminals within a store
- **Product** - Inventory items with cost, price, stock, and images
- **Sale** - Completed transactions with cart details
- **StockEntry** - Inventory adjustments
- **Fiado** - Credit/deferred payment customer accounts
- **CashRegister** - Terminal cash tracking
- **SaaSClient** - Multi-tenant client accounts

**Authentication Flow**: The app differentiates between regular users and super admin. Login determines available modules and accessible data (scoped by `clientId`).

### Styling
- **Tailwind CSS** with typography plugin for component styling
- **Lucide React** for icons throughout the UI
- **Motion** (framer-motion equivalent) for animations and transitions
- Custom CSS in `src/index.css`

### Data Handling & API
- All API interactions appear to be handled within App.tsx
- Data is managed via React state (useState)
- No Redux, Context API, or other global state management visible in the current structure
- Some data operations use Express backend endpoints

### Key Dependencies
- **React 19** - UI framework
- **Vite 6** - Build tool and dev server
- **TypeScript 5.8** - Type safety
- **Tailwind 4** - CSS styling
- **Recharts** - Chart/graph visualizations
- **Lucide React** - Icon library
- **Motion** - Animation library
- **XLSX** - Excel file handling for exports/imports
- **Google GenAI SDK** - Gemini API integration
- **Express** - Backend server (minimal usage in frontend)

### Development Notes

**Code Organization**: The monolithic App.tsx handles most routing and logic. When adding features:
1. Add type definitions to `src/types.ts`
2. Create feature components in appropriate `src/components/` subdirectory
3. Integrate into App.tsx routing and state management
4. Add navigation in SideNavBar for new pages

**Styling Patterns**: Components use utility classes with consistent patterns:
- Secondary color (`bg-secondary`) for main branding
- Hover and active states with opacity transitions
- Rounded corners (`rounded-xl`, `rounded-2xl`)
- Shadow elevation for depth
- Animation utilities for motion effects

**Build Configuration**: Vite is configured to:
- Use React Fast Refresh plugin
- Apply Tailwind CSS via Vite plugin
- Expose `GEMINI_API_KEY` and `APP_URL` via environment variables to the client
- Disable HMR in AI Studio environment (respects `DISABLE_HMR` env var)
- Use path alias `@` pointing to project root
