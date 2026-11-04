# Reglas del Proyecto - Note Manager

## Alcance
Este archivo define las reglas, estructura y convenciones del proyecto **Note Manager**. Todo el código fuente reside exclusivamente dentro de la carpeta del proyecto (`note_manager/`). No se deben tocar, modificar ni crear archivos fuera de este directorio.

## Stack Tecnológico
### Frontend
- **Framework:** Angular 21 (standalone components)
- **Lenguaje:** TypeScript 5.9+
- **Estilos:** Tailwind CSS v4 + CSS global
- **Build:** Angular CLI v21 con `@angular/build` (vite/esbuild)
- **Tests:** Vitest con jsdom
- **Formato:** Prettier

### Backend
- **Framework:** NestJS 11
- **Lenguaje:** TypeScript 5.9+
- **ORM:** Prisma 7 (con MySQL)
- **Auth:** JWT (passport) + bcryptjs
- **API:** REST con prefijo `/api`
- **Docs:** Swagger en `/api/docs`
- **Validación:** class-validator + ValidationPipe

## Estructura del Proyecto

```
note_manager/
├── public/                  # Archivos estáticos (favicon, etc.)
├── src/
│   ├── index.html           # Entry point HTML
│   ├── main.ts              # Bootstrap de la aplicación
│   ├── styles.css           # Estilos globales (Tailwind)
│   └── app/
│       ├── app.ts           # Componente raíz
│       ├── app.config.ts    # Configuración global (providers)
│       ├── app.routes.ts    # Rutas principales
│       ├── app.html         # Template del componente raíz
│       ├── app.css          # Estilos del componente raíz
│       ├── app.spec.ts      # Tests del componente raíz
│       └── src/app/         # Código funcional de la aplicación
│           ├── environment/         # Configuración por entorno
│           │   ├── environment.ts        # Desarrollo
│           │   └── environment.prod.ts   # Producción
│           ├── interfaces/         # Interfaces TypeScript
│           ├── pages/              # Componentes de página
│           │   ├── documentos/
│           │   ├── recordatorios/
│           │   └── tareas/
│           │       ├── equipos/
│           │       ├── kanban/
│           │       └── tableros/
│           ├── services/           # Servicios (inyección de dependencias)
│           └── shared/             # Componentes reutilizables
│               ├── cronograma/
│               ├── dashboard/      # Sistema de gráficos (11 tipos)
│               ├── formulario/
│               ├── helpers/
│               ├── loading/
│               └── tablas/
├── angular.json              # Configuración de Angular CLI
├── package.json              # Dependencias y scripts
├── tsconfig.json             # TypeScript configuración base
├── tsconfig.app.json         # TypeScript para la app
├── tsconfig.spec.json        # TypeScript para tests
└── .postcssrc.json           # Configuración PostCSS (Tailwind)
```

## Backend — Estructura

```
backend/
├── prisma/
│   ├── schema.prisma          # Modelos de base de datos (Prisma)
│   └── prisma.config.ts       # Configuración de conexión
├── uploads/                   # Archivos subidos
│   ├── documentos/
│   └── tareas/
├── src/
│   ├── main.ts                # Entry point (CORS, validación, Swagger)
│   ├── app.module.ts          # Módulo raíz
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── auth/                  # JWT login/registro
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── jwt.strategy.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── dto/
│   ├── documentos/            # Documentos markdown
│   │   ├── documentos.module.ts
│   │   ├── documentos.service.ts
│   │   ├── documentos.controller.ts
│   │   └── dto/
│   ├── tareas/                # Kanban, tableros, equipos, cronograma
│   │   ├── tareas.module.ts
│   │   ├── tareas.service.ts
│   │   ├── tareas.controller.ts
│   │   └── dto/
│   ├── recordatorios/         # Recordatorios
│   │   ├── recordatorios.module.ts
│   │   ├── recordatorios.service.ts
│   │   ├── recordatorios.controller.ts
│   │   └── dto/
│   ├── colaboradores/         # Usuarios
│   │   ├── colaboradores.module.ts
│   │   ├── colaboradores.service.ts
│   │   ├── colaboradores.controller.ts
│   │   └── dto/
│   ├── reuniones/             # Gestión de reuniones
│   │   ├── reuniones.module.ts
│   │   ├── reuniones.service.ts
│   │   ├── reuniones.controller.ts
│   │   └── dto/
│   └── common/
│       └── helpers.ts
```

## Convenciones de Código

### Componentes
- **Standalone:** Todos los componentes son standalone (`standalone: true`)
- **Selector:** Prefijo `app-` (ej: `app-documentos`, `app-kanban`)
- **Archivos:** Un componente por carpeta con nombre en kebab-case
  - `nombre.component.ts`
  - `nombre.component.html`
  - `nombre.component.css` (opcional)
- **templateUrl/styleUrl:** Usar rutas relativas (`./`)
- **Change Detection:** Default (por referencia)

### Servicios
- **providedIn:** `'root'` para singleton services
- **HTTP:** Usar `inject(HttpClient)` o constructor injection
- **Nomenclatura:** `kebab-case.service.ts`
- **Métodos:** Verbos en español (obtener, crear, actualizar, eliminar)

### Interfaces
- Definir en `interfaces/` archivos con nombres en kebab-case
- Usar `interface` en lugar de `class`
- Tipos estrictos habilitados

### Estilos
- Tailwind CSS v4 para estilos utilitarios
- CSS variables para colores del dashboard
- `@import 'tailwindcss'` en styles.css

### Routing
- Rutas definidas en `app.routes.ts`
- Lazy loading de páginas según crezca el proyecto

### Testing
- Archivos `*.spec.ts` junto al componente
- Vitest con jsdom
- Tests básicos de creación y renderizado

### Dependencias Externas
- `@angular/cdk` → Drag & drop (kanban)
- `sweetalert2` → Alertas/modales
- `marked`, `html2canvas`, `jspdf` → Exportación PDF (documentos)
- `ngx-markdown` → Preview de markdown

## Reglas de Importación
- Usar `inject()` en lugar de constructor injection cuando sea posible
- Rutas relativas para imports dentro del proyecto
- Los servicios de API deben usar `environment.apiUrl` como base

## Proveedores Globales (app.config.ts)
Todos los providers globales se configuran en `app.config.ts`:
- `provideRouter(routes)`
- `provideHttpClient()` (para servicios HTTP)
- `provideBrowserGlobalErrorListeners()`
