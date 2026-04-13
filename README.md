# Nova Salud - Sistema de Gestión de Inventario y Ventas

Sistema web completo para la gestión de inventario y ventas de la botica "Nova Salud".

## Tecnologías

- **Frontend**: Vue 3 con Vite
- **Backend**: Supabase (PostgreSQL, Auth, API REST)
- **Estado**: Pinia
- **Rutas**: Vue Router

## Requisitos Previos

1. Node.js 18+
2. Cuenta de Supabase

## Instalación

### 1. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta las consultas SQL del archivo `supabase-schema.sql` en el SQL Editor de Supabase
3. Copia la URL de tu proyecto y la clave anónima (Anon Key) de Settings > API

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env` y completa los valores:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar el Proyecto

```bash
npm run dev
```

El proyecto se ejecutará en `http://localhost:5173`

## Características

### Autenticación
- Login y registro de usuarios
- Roles: administrador y empleado
- Rutas protegidas según autenticación

### Módulo de Inventario
- CRUD completo de productos
- Campos: nombre, descripción, precio, stock, fecha_vencimiento
- Buscador en tiempo real
- Alertas visuales cuando stock < 5

### Módulo de Ventas
- Selección de productos
- Control de cantidades
- Cálculo automático de total
- Descuenta stock al confirmar venta

### Dashboard
- Ventas del día
- Total vendido
- Productos más vendidos
- Alertas de stock bajo

## Estructura del Proyecto

```
botica/
├── src/
│   ├── supabase/      # Configuración de Supabase
│   ├── router/       # Configuración de rutas
│   ├── stores/       # Stores de Pinia
│   │   ├── auth.js
│   │   ├── inventario.js
│   │   └── ventas.js
│   ├── views/         # Vistas de la aplicación
│   ├── layouts/      # Layouts
│   └── components/   # Componentes reutilizables
├── supabase-schema.sql
└── README.md
```

## Licencia

MIT