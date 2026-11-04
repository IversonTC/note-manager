# Dashboard Widget Library — Manual de Uso

Colección de componentes Angular **standalone** para construir dashboards estilo Power BI.  
**Sin librerías externas.** Todo es SVG calculado en TypeScript + CSS + variables de tema dinámicas.

> Última actualización: Junio 2026

---

## Tabla de Contenidos

1. [Stack y requisitos](#1-stack-y-requisitos)
2. [Sistema de Grid](#2-sistema-de-grid)
3. [Sistema de Colores](#3-sistema-de-colores)
4. [Tooltips](#4-tooltips)
5. [Componentes — Referencia rápida](#5-componentes--referencia-rápida)
6. [KPI Card](#6-kpi-card)
7. [Barras Horizontales](#7-barras-horizontales)
8. [Barras Verticales + Drill-down](#8-barras-verticales--drill-down)
9. [Gráfica de Líneas](#9-gráfica-de-líneas)
10. [Dona (Donut)](#10-dona-donut)
11. [Torta (Pie)](#11-torta-pie)
12. [Mapa de Calor (Heatmap)](#12-mapa-de-calor-heatmap)
13. [Personas / Carga por responsable](#13-personas--carga-por-responsable)
14. [Tacómetro (Gauge)](#14-tacómetro-gauge)
15. [Arco de Progreso](#15-arco-de-progreso)
16. [Filtro de Fecha](#16-filtro-de-fecha)
17. [Interfaces TypeScript](#17-interfaces-typescript)
18. [Estructura JSON del Backend](#18-estructura-json-del-backend)
19. [Ejemplo completo — Dashboard de una página](#19-ejemplo-completo--dashboard-de-una-página)
20. [Estructura de archivos](#20-estructura-de-archivos)

---

## 1. Stack y requisitos

| Requisito | Versión | Notas |
|---|---|---|
| Angular | 21+ | Standalone components, control flow `@if`/`@for` |
| TypeScript | 5.x | — |
| Tailwind CSS | 3.x | Utilidades de layout |
| Font Awesome | 6.x | CDN en `index.html` |

Todos los componentes son `standalone: true`. Importar directamente en el `imports[]` del componente que los use.

```typescript
import { DashboardGridComponent }   from '../../shared/dashboard/dashboard-grid.component';
import { DashboardItemComponent }   from '../../shared/dashboard/dashboard-item.component';
import { KpiCardComponent }         from '../../shared/dashboard/kpi-card/kpi-card.component';
import { BarraChartComponent }      from '../../shared/dashboard/barra-chart/barra-chart.component';
import { BarrasVerticalesComponent } from '../../shared/dashboard/barras-verticales/barras-verticales.component';
import { LineaChartComponent }      from '../../shared/dashboard/linea-chart/linea-chart.component';
import { DonaChartComponent }       from '../../shared/dashboard/dona-chart/dona-chart.component';
import { TortaChartComponent }      from '../../shared/dashboard/torta-chart/torta-chart.component';
import { MapaCalorComponent }       from '../../shared/dashboard/mapa-calor/mapa-calor.component';
import { PersonasChartComponent }   from '../../shared/dashboard/personas-chart/personas-chart.component';
import { GaugeChartComponent }      from '../../shared/dashboard/gauge-chart/gauge-chart.component';
import { ArcProgressComponent }     from '../../shared/dashboard/arc-progress/arc-progress.component';
import { FiltroDashboardComponent } from '../../shared/dashboard/filtro-fecha/filtro-fecha.component';
```

---

## 2. Sistema de Grid

El sistema de grid es la base sobre la que se colocan todos los widgets. Funciona como un CSS Grid con columnas y filas de altura fija.

### `DashboardGridComponent` — contenedor

```html
<app-dashboard-grid [cols]="6" [mobileCols]="2" [rowHeight]="110" [gap]="14">
  <!-- widgets aquí -->
</app-dashboard-grid>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `cols` | `number` | `6` | Columnas en desktop (≥ 640 px) |
| `mobileCols` | `number` | `2` | Columnas en mobile (< 640 px) |
| `rowHeight` | `number` | `110` | Alto de cada unidad de fila en px |
| `gap` | `number` | `16` | Espacio entre celdas en px |

### `DashboardItemComponent` — celda

```html
<app-dashboard-item [cols]="2" [rows]="3">
  <!-- cualquier widget -->
</app-dashboard-item>
```

| Input | Tipo | Descripción |
|---|---|---|
| `cols` | `number` | Columnas que ocupa (1 a `cols` del grid) |
| `rows` | `number` | Filas que ocupa (la altura real = `rows × rowHeight + gaps`) |

### Ejemplo de layout

```html
<app-dashboard-grid [cols]="6" [rowHeight]="110" [gap]="14">

  <!-- 3 KPIs — cada uno ocupa 2 cols × 1 fila -->
  <app-dashboard-item [cols]="2" [rows]="1"><app-kpi-card ... /></app-dashboard-item>
  <app-dashboard-item [cols]="2" [rows]="1"><app-kpi-card ... /></app-dashboard-item>
  <app-dashboard-item [cols]="2" [rows]="1"><app-kpi-card ... /></app-dashboard-item>

  <!-- Barras jerárquicas — ancho completo × 4 filas -->
  <app-dashboard-item [cols]="6" [rows]="4"><app-barras-verticales ... /></app-dashboard-item>

  <!-- Dona + Línea lado a lado -->
  <app-dashboard-item [cols]="2" [rows]="3"><app-dona-chart ... /></app-dashboard-item>
  <app-dashboard-item [cols]="4" [rows]="3"><app-linea-chart ... /></app-dashboard-item>

</app-dashboard-grid>
```

**Tamaños recomendados por widget:**

| Widget | Mínimo | Recomendado | Máximo útil |
|---|---|---|---|
| KPI card | 2×1 | 2×1 | 3×1 |
| Barras horizontales | 2×2 | 3×3 | 4×4 |
| Barras verticales | 2×2 | 3×3 | 6×4 |
| Línea (clasica) | 3×2 | 6×2 | 6×3 |
| Dona / Torta | 2×2 | 2×3 o 4×3 | 4×4 |
| Mapa de calor | 3×2 | 4×3 | 6×4 |
| Gauge / Arc | 2×2 | 2×3 | 3×3 |
| Personas | 4×3 | 6×4 | 6×6 |

---

## 3. Sistema de Colores

**REGLA:** Nunca usar colores hardcodeados de Tailwind (`bg-blue-600`, `text-green-500`).  
Los widgets usan CSS variables que cambian según la empresa activa:

| Variable | Uso |
|---|---|
| `var(--color-primary)` | Color de acento principal de la empresa |
| `var(--color-text)` | Texto principal |
| `var(--color-bg)` | Fondo de la página |
| `var(--color-bg-sidebar)` | Fondo de cards y panels |

```html
<!-- ❌ INCORRECTO -->
<div class="bg-blue-600 text-white">...</div>

<!-- ✅ CORRECTO -->
<div [style.background]="'var(--color-primary)'" class="text-white">...</div>

<!-- ✅ Tinte suave (12% de opacidad) -->
<div [style.background]="'color-mix(in srgb, var(--color-primary) 12%, transparent)'">...</div>
```

Los **colores semánticos** (estados de tickets, badges de prioridad) sí pueden ser hex fijos porque son independientes del tema:
```html
<div style="background:#22c55e">Éxito</div>   <!-- verde semántico OK -->
<div style="background:#ef4444">Error</div>    <!-- rojo semántico OK -->
```

---

## 4. Tooltips

Todos los widgets SVG muestran automáticamente un tooltip flotante al hacer hover sobre elementos interactivos (barras, segmentos, puntos, celdas). El tooltip usa `position: fixed` para que no sea recortado por el `overflow: hidden` del grid.

No se necesita configuración adicional — está integrado en cada widget.

---

## 5. Componentes — Referencia rápida

| Widget | Selector | Variantes disponibles | Descripción |
|---|---|---|---|
| Grid contenedor | `<app-dashboard-grid>` | — | CSS Grid con `cols`/`rowHeight`/`gap` |
| Celda grid | `<app-dashboard-item>` | — | Celda con span de cols y rows |
| KPI card | `<app-kpi-card>` | — | Número grande con ícono y tendencia |
| Barras horizontales | `<app-barra-chart>` | — | Barras con % sobre total |
| Barras verticales | `<app-barras-verticales>` | `clasica` `compacta` `minima` | SVG columnas + drill-down jerárquico |
| Gráfica de líneas | `<app-linea-chart>` | `clasica` `compacta` `minima` | Multi-serie con área rellena |
| Dona | `<app-dona-chart>` | `clasica` `compacta` `minima` | Donut SVG con texto central |
| Torta | `<app-torta-chart>` | `clasica` `compacta` `minima` | Pie SVG con slices sólidos |
| Mapa de calor | `<app-mapa-calor>` | — | Heatmap con opacidad dinámica |
| Personas | `<app-personas-chart>` | — | Tarjetas de carga por responsable |
| Tacómetro | `<app-gauge-chart>` | — | Aguja animada con zonas de color |
| Arco de progreso | `<app-arc-progress>` | — | Semicírculo estilo Power BI |
| Filtro de fecha | `<app-filtro-fecha>` | — | Presets + rango personalizado |

### Sistema de variantes

Los widgets con variantes se adaptan al tamaño de la celda:

```html
<!-- Variante por defecto — para celdas grandes -->
<app-dona-chart variante="clasica" layout="row" ... />

<!-- Variante compacta — para celdas medianas -->
<app-dona-chart variante="compacta" ... />

<!-- Variante mínima — para celdas pequeñas, todo por tooltip -->
<app-dona-chart variante="minima" ... />
```

---

## 6. KPI Card

Muestra un número grande con ícono, color y tendencia opcional.

```html
<app-kpi-card
  titulo="Total solicitudes"
  [valor]="1284"
  icono="fa-solid fa-ticket"
  color="#22c55e"
  subtitulo="registros activos"
  [tendencia]="12"
  [cargando]="false" />
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `titulo` | `string` | `''` | Etiqueta de la métrica |
| `valor` | `number \| string` | `0` | Número o texto a mostrar grande |
| `icono` | `string` | `''` | Clase Font Awesome |
| `color` | `string` | `''` | Hex (`#22c55e`) o `var(--color-primary)` |
| `subtitulo` | `string` | `''` | Texto pequeño adicional |
| `tendencia` | `number \| null` | `null` | Positivo → ↑ verde · Negativo → ↓ rojo |
| `cargando` | `boolean` | `false` | Skeleton animado |

```typescript
// Datos típicos de API → KPI
kpis = [
  { titulo: 'Total',       valor: 1284,  icono: 'fa-solid fa-ticket',      color: 'var(--color-primary)', tendencia: 12  },
  { titulo: 'Resueltos',   valor: 342,   icono: 'fa-solid fa-circle-check', color: '#22c55e',             tendencia: 18  },
  { titulo: 'Pendientes',  valor: 56,    icono: 'fa-solid fa-clock',        color: '#f59e0b',             tendencia: -8  },
  { titulo: 'SLA',         valor: '84%', icono: 'fa-solid fa-shield',       color: '#8b5cf6',             tendencia: 5   },
];
```

```html
@for (k of kpis; track k.titulo) {
  <app-dashboard-item [cols]="2" [rows]="1">
    <app-kpi-card [titulo]="k.titulo" [valor]="k.valor" [icono]="k.icono"
                  [color]="k.color" [tendencia]="k.tendencia" />
  </app-dashboard-item>
}
```

---

## 7. Barras Horizontales

Barras animadas con porcentaje. Scroll automático cuando hay muchos ítems.

```html
<app-barra-chart
  titulo="Distribución por área"
  icono="fa-solid fa-bars"
  [items]="barraItems"
  [cargando]="false" />
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `titulo` | `string` | `''` | Título del card |
| `icono` | `string` | `'fa-solid fa-chart-bar'` | Ícono del header |
| `items` | `BarraItem[]` | `[]` | Datos |
| `total` | `number \| null` | `null` | Denominador para %. `null` → suma todos los ítems |
| `cargando` | `boolean` | `false` | Skeleton |
| `msgVacio` | `string` | `'Sin datos'` | Mensaje vacío |

```typescript
import { BarraItem } from '../../interfaces/dashboard';

barraItems: BarraItem[] = [
  { label: 'Tecnología',  valor: 312, color: '#3b82f6' },
  { label: 'Operaciones', valor: 276, color: '#22c55e' },
  { label: 'Comercial',   valor: 198, color: '#f59e0b' },
  { label: 'RRHH',        valor: 143, color: '#8b5cf6' },
];
```

---

## 8. Barras Verticales + Drill-down

Diagrama SVG de barras verticales. Soporta drill-down jerárquico de N niveles y 3 variantes.

### Variantes

| `variante` | Visual | Ideal para |
|---|---|---|
| `clasica` (default) | Guías, labels, %, breadcrumb, drill-down completo | 3×3, 4×3 |
| `compacta` | Línea base, valores en negrita, sin guías | 2×2, 3×2 |
| `minima` | Solo barras de color + label corto, todo vía tooltip | 2×1, 2×2 |

### Modo plano

```html
<app-barras-verticales
  titulo="Solicitudes por área"
  variante="compacta"
  [items]="barraItems" />
```

### Modo jerárquico con drill-down

```html
<app-barras-verticales
  titulo="Tickets por área → colaborador → detalle"
  variante="clasica"
  [jerarquia]="jerarquiaTickets"
  (hojaSeleccionada)="onHoja($event)" />
```

```typescript
import { BarraJerarquica } from '../../interfaces/dashboard';

jerarquiaTickets: BarraJerarquica[] = [
  {
    label: 'Tecnología', valor: 312, color: '#3b82f6',
    hijos: [
      {
        label: 'Ana Martínez', valor: 89, color: '#3b82f6',
        detalle: [
          { label: 'TK-001', descripcion: 'Error módulo login — en proceso', color: '#f59e0b' },
          { label: 'TK-002', descripcion: 'Dashboard lento al cargar gráficas', color: '#3b82f6' },
        ],
      },
      {
        label: 'Carlos López', valor: 124, color: '#6366f1',
        detalle: [
          { label: 'TK-011', descripcion: 'Migración base de datos', color: '#ef4444' },
        ],
      },
    ],
  },
  {
    label: 'Operaciones', valor: 276, color: '#22c55e',
    hijos: [/* ... */],
  },
];
```

**Comportamiento drill-down (solo `variante="clasica"`):**
1. Clic en barra con `hijos` → navega al siguiente nivel (fade 200 ms)
2. Clic en barra sin `hijos` → muestra la lista `detalle` + emite `hojaSeleccionada`
3. Breadcrumb clickeable: `Inicio › Tecnología › Ana Martínez`

| Input / Output | Tipo | Descripción |
|---|---|---|
| `variante` | `'clasica' \| 'compacta' \| 'minima'` | Estilo visual (default `'clasica'`) |
| `[items]` | `BarraItem[]` | Modo plano |
| `[jerarquia]` | `BarraJerarquica[]` | Modo jerárquico |
| `[alto]` | `number` | Alto del viewBox SVG (default 180) |
| `[cargando]` | `boolean` | Skeleton |
| `(hojaSeleccionada)` | `EventEmitter<BarraJerarquica>` | Emite el nodo hoja al seleccionar |

---

## 9. Gráfica de Líneas

Multi-serie con área rellena. Puntos interactivos con tooltip. Soporta 3 variantes.

### Variantes

| `variante` | Visual | Ideal para |
|---|---|---|
| `clasica` (default) | Líneas + área rellena, leyenda en header, grid horizontal, labels eje X | 4×2, 6×2 |
| `compacta` | Sin área, chips de leyenda debajo del SVG, con labels X | 3×2 |
| `minima` | Sparklines puros: solo líneas, sin área, sin labels, sin leyenda | 3×1, 2×2 |

```html
<app-linea-chart
  titulo="Evolución mensual de solicitudes"
  variante="clasica"
  [series]="lineaSeries"
  [alto]="160"
  [cargando]="false" />
```

```typescript
import { LineaSerie } from '../../interfaces/dashboard';

lineaSeries: LineaSerie[] = [
  {
    nombre: 'Solicitudes abiertas',
    color: '#3b82f6',
    puntos: [
      { label: 'Ene', valor: 98  },
      { label: 'Feb', valor: 120 },
      { label: 'Mar', valor: 87  },
      { label: 'Abr', valor: 145 },
      { label: 'May', valor: 132 },
      { label: 'Jun', valor: 109 },
    ],
  },
  {
    nombre: 'Solicitudes resueltas',
    color: '#22c55e',
    puntos: [
      { label: 'Ene', valor: 75  },
      { label: 'Feb', valor: 104 },
      { label: 'Mar', valor: 93  },
      { label: 'Abr', valor: 118 },
      { label: 'May', valor: 140 },
      { label: 'Jun', valor: 127 },
    ],
  },
];
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `variante` | `'clasica' \| 'compacta' \| 'minima'` | `'clasica'` | Estilo visual |
| `[series]` | `LineaSerie[]` | `[]` | Series de datos |
| `[alto]` | `number` | `160` | Alto del viewBox SVG en px |
| `[cargando]` | `boolean` | `false` | Skeleton |

> Pueden pasarse N series. Todas las series deben tener el mismo número de puntos.

---

## 10. Dona (Donut)

Donut SVG usando `stroke-dasharray` / `stroke-dashoffset`. Tiene texto central y leyenda. Soporta 3 variantes y 2 layouts.

### Variantes y layouts

| `variante` | `layout` | Visual | Ideal para |
|---|---|---|---|
| `clasica` | `row` | Donut izquierda + leyenda con mini-barras derecha | 3×2, 4×2, 4×3 |
| `clasica` | `col` | Donut arriba + leyenda en grid abajo | 2×2, 2×4, 3×3 |
| `compacta` | — | Donut + % inline en arcos grandes + chips abajo | 2×2, 2×3 |
| `minima` | — | Solo el donut, sin leyenda | 2×1 |

```html
<!-- Clásica con donut izquierda y leyenda derecha -->
<app-dona-chart
  titulo="Estado actual"
  variante="clasica"
  layout="row"
  [segmentos]="donaSegmentos"
  centroLabel="531"
  centroSub="total"
  [cargando]="false" />

<!-- Compacta con porcentajes inline -->
<app-dona-chart
  titulo="Distribución compacta"
  variante="compacta"
  [segmentos]="donaSegmentos"
  centroLabel="531"
  centroSub="tickets" />

<!-- Mínima solo gráfica -->
<app-dona-chart variante="minima" titulo="Estado" [segmentos]="donaSegmentos" />
```

```typescript
import { DonaSegmento } from '../../interfaces/dashboard';

donaSegmentos: DonaSegmento[] = [
  { label: 'Terminado',  valor: 342, color: '#22c55e' },
  { label: 'En proceso', valor: 87,  color: '#3b82f6' },
  { label: 'Pendiente',  valor: 56,  color: '#f59e0b' },
  { label: 'En espera',  valor: 34,  color: '#94a3b8' },
  { label: 'Rechazado',  valor: 12,  color: '#ef4444' },
];
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `variante` | `'clasica' \| 'compacta' \| 'minima'` | `'clasica'` | Estilo visual |
| `layout` | `'row' \| 'col'` | `'row'` | Disposición en variante `clasica` |
| `centroLabel` | `string` | `''` | Texto grande en el centro del donut |
| `centroSub` | `string` | `''` | Texto pequeño bajo el label central |
| `[segmentos]` | `DonaSegmento[]` | `[]` | Datos |
| `[cargando]` | `boolean` | `false` | Skeleton |

---

## 11. Torta (Pie)

Pie chart con slices sólidos usando `<path>` SVG con comandos de arco. A diferencia de la dona, no tiene hueco central. Mismos inputs, mismas variantes.

### Diferencia dona vs. torta

| | Dona | Torta |
|---|---|---|
| Tipo SVG | `circle` con `stroke-dasharray` | `path` con arco (`A`) |
| Centro | Sí — texto `centroLabel` + `centroSub` | No — relleno sólido |
| Visual | Anillo | Pastel completo |
| Mismos inputs | ✅ | ✅ |

### Variantes (idénticas a la dona)

| `variante` | `layout` | Visual | Ideal para |
|---|---|---|---|
| `clasica` | `row` | Torta izq + leyenda con mini-barras dcha | 3×2, 4×2 |
| `clasica` | `col` | Torta arriba + leyenda grid abajo | 2×2, 3×3 |
| `compacta` | — | Torta + % inline en slices grandes + chips | 2×2, 2×3 |
| `minima` | — | Solo la torta, sin leyenda | 1×2, 2×2 |

```html
<app-torta-chart
  titulo="Distribución por estado"
  variante="clasica"
  layout="row"
  [segmentos]="donaSegmentos" />
```

Reutiliza la misma interfaz `DonaSegmento`.

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `variante` | `'clasica' \| 'compacta' \| 'minima'` | `'clasica'` | Estilo visual |
| `layout` | `'row' \| 'col'` | `'row'` | Disposición en variante `clasica` |
| `[segmentos]` | `DonaSegmento[]` | `[]` | Datos — misma interfaz que dona |
| `[cargando]` | `boolean` | `false` | Skeleton |

---

## 12. Mapa de Calor (Heatmap)

Grid CSS donde cada celda tiene una opacidad proporcional a su valor relativo al máximo de la matriz. Incluye barra de escala Bajo → Alto y scroll para grids grandes.

```html
<app-mapa-calor
  titulo="Tickets por área × mes"
  icono="fa-solid fa-border-all"
  unidad="tickets"
  [mostrarValor]="true"
  [filas]="mapaFilas"
  [columnas]="mapaCols"
  [datos]="mapaDatos" />
```

```typescript
// Datos: tickets por área (fila) × mes (columna)
mapaFilas    = ['Tecnología', 'Operaciones', 'Comercial', 'RRHH', 'Finanzas'];
mapaCols     = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
mapaDatos: number[][] = [      // datos[fila][columna]
  [48, 62, 55, 71, 60, 52],   // Tecnología
  [35, 44, 50, 41, 58, 48],   // Operaciones
  [28, 32, 45, 39, 42, 35],   // Comercial
  [22, 18, 30, 27, 25, 21],   // RRHH
  [15, 20, 18, 22, 19, 17],   // Finanzas
];
```

**Fórmula de opacidad:** `opacity = (valor / maxVal) × 0.82 + 0.06` → rango 6 %–88 %.

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `filas` | `string[]` | `[]` | Etiquetas de filas (eje Y) |
| `columnas` | `string[]` | `[]` | Etiquetas de columnas (eje X) |
| `datos` | `number[][]` | `[]` | Matriz `datos[fila][columna]` |
| `unidad` | `string` | `''` | Texto en tooltip (ej. `'tickets'`) |
| `mostrarValor` | `boolean` | `false` | Muestra el número dentro de cada celda |
| `color` | `string` | `'var(--color-primary)'` | Color base de las celdas |
| `icono` | `string` | `'fa-solid fa-border-all'` | Ícono del header |
| `[cargando]` | `boolean` | `false` | Skeleton |

> **Casos de uso:** actividad por hora × día de la semana, métricas por área × mes, calidad por proceso × período.

---

## 13. Personas / Carga por responsable

Tarjetas de personas con barra de progreso, badges por estado y filtro por selección.

```html
<app-personas-chart
  titulo="Carga por responsable"
  icono="fa-solid fa-users"
  labelProgreso="Completadas"
  [personas]="personas"
  [seleccionado]="filtroAsignado"
  [cargando]="false"
  (seleccionar)="filtroAsignado = $event" />
```

```typescript
import { PersonaResumen } from '../../interfaces/dashboard';

personas: PersonaResumen[] = [
  {
    nombre: 'Ana Martínez', iniciales: 'AM',
    total: 48, completadas: 38, pctCompletadas: 79,
    badges: [
      { label: 'Completadas', valor: 38, color: '#22c55e', icono: 'fa-solid fa-check'    },
      { label: 'En proceso',  valor: 7,  color: '#3b82f6', icono: 'fa-solid fa-spinner'  },
      { label: 'Pendientes',  valor: 3,  color: '#f59e0b', icono: 'fa-solid fa-clock'    },
    ],
  },
];
```

| Input / Output | Tipo | Descripción |
|---|---|---|
| `[personas]` | `PersonaResumen[]` | Datos de personas |
| `labelProgreso` | `string` | Etiqueta de la barra de progreso |
| `[seleccionado]` | `string` | Nombre de la persona seleccionada (filtro) |
| `[cargando]` | `boolean` | Skeleton |
| `(seleccionar)` | `EventEmitter<string>` | Emite el nombre al hacer clic (vacío = limpiar filtro) |

---

## 14. Tacómetro (Gauge)

SVG con aguja animada, arco de progreso con degradado, zonas de color y porcentaje central.

```html
<app-gauge-chart
  titulo="Tasa de resolución"
  subtitulo="Resueltas vs total"
  [valor]="342"
  [maximo]="531"
  unidad="solicitudes"
  color="#22c55e"
  [cargando]="false" />
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `titulo` | `string` | `''` | Título del card |
| `subtitulo` | `string` | `''` | Subtexto bajo el título |
| `[valor]` | `number` | `0` | Valor actual |
| `[maximo]` | `number` | `100` | Valor máximo de la escala |
| `unidad` | `string` | `''` | Texto junto al valor (ej. `'solicitudes'`) |
| `color` | `string` | `'var(--color-primary)'` | Color del arco y la aguja |
| `[cargando]` | `boolean` | `false` | Skeleton |

**Zonas automáticas de fondo:**
- 0–50 % → verde claro
- 50–75 % → amarillo claro
- 75–100 % → rojo claro

---

## 15. Arco de Progreso

Semicírculo grueso estilo Power BI. Más simple y llamativo que el tacómetro — sin aguja.

```html
<app-arc-progress
  titulo="SLA cumplido"
  subtitulo="Dentro del tiempo límite"
  [valor]="448"
  [maximo]="531"
  unidad="sol."
  color="#8b5cf6"
  [cargando]="false" />
```

Mismos inputs que `gauge-chart` pero sin aguja y con un marcador en el extremo del arco.

---

## 16. Filtro de Fecha

Barra con presets rápidos (7d / Mes / Trimestre / Año / Todo) + rango personalizado.

```html
<app-filtro-fecha
  [cargando]="cargando"
  (cambio)="onFiltroChange($event)" />
```

```typescript
import { RangoFecha } from '../../interfaces/dashboard';

onFiltroChange(rango: RangoFecha): void {
  this.desde = rango.desde;  // formato YYYY-MM-DD, '' si es "Todo"
  this.hasta = rango.hasta;
  this.cargarDatos();
}
```

| Output | Tipo | Descripción |
|---|---|---|
| `(cambio)` | `EventEmitter<RangoFecha>` | `{ desde: string, hasta: string }` en formato `YYYY-MM-DD` |

---

## 17. Interfaces TypeScript

```typescript
// src/app/interfaces/dashboard.ts

interface BarraItem {
  label: string;
  valor: number;
  color?: string;
}

interface BarraJerarquica {
  label:   string;
  valor:   number;
  color?:  string;
  hijos?:  BarraJerarquica[];
  detalle?: { label: string; descripcion?: string; color?: string }[];
}

interface LineaPunto { label: string; valor: number; }
interface LineaSerie { nombre: string; color: string; puntos: LineaPunto[]; }

interface DonaSegmento { label: string; valor: number; color: string; }
// DonaSegmento se reutiliza en TortaChartComponent

interface RangoFecha { desde: string; hasta: string; }  // YYYY-MM-DD, '' = sin límite

interface PersonaBadge   { label: string; valor: number; color: string; icono: string; }
interface PersonaResumen {
  nombre:          string;
  iniciales:       string;
  total:           number;
  completadas:     number;
  pctCompletadas:  number;
  badges:          PersonaBadge[];
}

// MapaCalor — no tiene interfaz wrapper; los inputs son directos:
// filas: string[], columnas: string[], datos: number[][] (datos[fila][columna])
```

---

## 18. Estructura JSON del Backend

El frontend **no transforma datos crudos** — el backend debe devolver la estructura que el widget espera directamente. El frontend calcula porcentajes, posiciones SVG, opacidades, etc.

### `app-kpi-card`
```json
{
  "titulo": "Total solicitudes",
  "valor": 1284,
  "icono": "fa-solid fa-ticket",
  "color": "#3b82f6",
  "tendencia": 12
}
```
`tendencia`: entero, positivo → ↑ verde, negativo → ↓ rojo.

---

### `app-barra-chart` / `app-barras-verticales` (modo plano)
```json
[
  { "label": "Tecnología",  "valor": 312, "color": "#3b82f6" },
  { "label": "Operaciones", "valor": 276, "color": "#22c55e" },
  { "label": "Comercial",   "valor": 198, "color": "#f59e0b" }
]
```

---

### `app-barras-verticales` (modo jerárquico drill-down)
```json
[
  {
    "label": "Tecnología", "valor": 312, "color": "#3b82f6",
    "hijos": [
      {
        "label": "Ana Martínez", "valor": 89, "color": "#3b82f6",
        "detalle": [
          { "label": "TK-001", "descripcion": "Error módulo login", "color": "#f59e0b" },
          { "label": "TK-002", "descripcion": "Dashboard lento",    "color": "#3b82f6" }
        ]
      },
      {
        "label": "Carlos López", "valor": 124, "color": "#6366f1",
        "detalle": [
          { "label": "TK-011", "descripcion": "Migración BD producción", "color": "#ef4444" }
        ]
      }
    ]
  }
]
```
Hasta 3 niveles: agrupador → responsable → ítem.

---

### `app-dona-chart` / `app-torta-chart`
```json
[
  { "label": "Terminado",  "valor": 342, "color": "#22c55e" },
  { "label": "En proceso", "valor": 87,  "color": "#3b82f6" },
  { "label": "Pendiente",  "valor": 56,  "color": "#f59e0b" },
  { "label": "Rechazado",  "valor": 12,  "color": "#ef4444" }
]
```
Solo valores absolutos — el frontend calcula los % y geometrías SVG.

---

### `app-linea-chart`
```json
[
  {
    "nombre": "Solicitudes abiertas",
    "color": "#3b82f6",
    "puntos": [
      { "label": "Ene", "valor": 98 },
      { "label": "Feb", "valor": 120 },
      { "label": "Mar", "valor": 87 }
    ]
  },
  {
    "nombre": "Solicitudes resueltas",
    "color": "#22c55e",
    "puntos": [
      { "label": "Ene", "valor": 75 },
      { "label": "Feb", "valor": 104 },
      { "label": "Mar", "valor": 93 }
    ]
  }
]
```
Todos los arrays `puntos` deben tener el mismo número de elementos.

---

### `app-mapa-calor`
```json
{
  "filas":    ["Tecnología", "Operaciones", "Comercial"],
  "columnas": ["Ene", "Feb", "Mar", "Abr"],
  "datos": [
    [48, 62, 55, 71],
    [35, 44, 50, 41],
    [28, 32, 45, 39]
  ]
}
```
`datos[i][j]` corresponde a `filas[i]` × `columnas[j]`.

---

### `app-gauge-chart` / `app-arc-progress`
```json
{
  "titulo":    "SLA cumplido",
  "subtitulo": "Dentro del tiempo límite",
  "valor":     448,
  "maximo":    531,
  "color":     "#8b5cf6"
}
```

---

### `app-personas-chart`
```json
[
  {
    "nombre":         "Ana Martínez",
    "iniciales":      "AM",
    "total":          48,
    "completadas":    38,
    "pctCompletadas": 79,
    "badges": [
      { "label": "Completadas", "valor": 38, "color": "#22c55e", "icono": "fa-solid fa-check"   },
      { "label": "En proceso",  "valor": 7,  "color": "#3b82f6", "icono": "fa-solid fa-spinner" },
      { "label": "Pendientes",  "valor": 3,  "color": "#f59e0b", "icono": "fa-solid fa-clock"   }
    ]
  }
]
```

---

### Patrón de servicio Angular para conectar la API

```typescript
// En el servicio — mapear la respuesta del backend al tipo esperado
getDashboardEstados(): Observable<DonaSegmento[]> {
  return this.http.get<any>(`${this.api}dashboard/estados`)
    .pipe(map(r => r.data ?? r));
  // r.data ya viene con { label, valor, color }[] — sin transformación adicional
}

getMapaCalor(): Observable<{ filas: string[], columnas: string[], datos: number[][] }> {
  return this.http.get<any>(`${this.api}dashboard/mapa-calor`)
    .pipe(map(r => r.data ?? r));
}
```

```typescript
// En el componente
ngOnInit(): void {
  this.svc.getDashboardEstados().subscribe(seg => this.segmentos = seg);
  this.svc.getMapaCalor().subscribe(mc => {
    this.mapaFilas  = mc.filas;
    this.mapaCols   = mc.columnas;
    this.mapaDatos  = mc.datos;
  });
}
```

---

## 19. Ejemplo completo — Dashboard de una página

```typescript
// resumen-dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardGridComponent }    from '../../shared/dashboard/dashboard-grid.component';
import { DashboardItemComponent }    from '../../shared/dashboard/dashboard-item.component';
import { KpiCardComponent }          from '../../shared/dashboard/kpi-card/kpi-card.component';
import { BarrasVerticalesComponent } from '../../shared/dashboard/barras-verticales/barras-verticales.component';
import { LineaChartComponent }       from '../../shared/dashboard/linea-chart/linea-chart.component';
import { DonaChartComponent }        from '../../shared/dashboard/dona-chart/dona-chart.component';
import { MapaCalorComponent }        from '../../shared/dashboard/mapa-calor/mapa-calor.component';
import { FiltroDashboardComponent }  from '../../shared/dashboard/filtro-fecha/filtro-fecha.component';
import { BarraItem, BarraJerarquica, LineaSerie, DonaSegmento, RangoFecha } from '../../interfaces/dashboard';
import { forkJoin } from 'rxjs';
import { MiServicio } from '../../services/mi.service';

@Component({
  selector: 'app-resumen-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardGridComponent, DashboardItemComponent,
    KpiCardComponent, BarrasVerticalesComponent,
    LineaChartComponent, DonaChartComponent,
    MapaCalorComponent, FiltroDashboardComponent,
  ],
  templateUrl: './resumen-dashboard.component.html',
})
export class ResumenDashboardComponent implements OnInit {
  private svc = inject(MiServicio);

  cargando = true;

  // KPIs
  kpis = [
    { titulo: 'Total',      valor: 0,   icono: 'fa-solid fa-ticket',      color: 'var(--color-primary)' },
    { titulo: 'Resueltos',  valor: 0,   icono: 'fa-solid fa-circle-check', color: '#22c55e' },
    { titulo: 'Pendientes', valor: 0,   icono: 'fa-solid fa-clock',        color: '#f59e0b' },
  ];

  jerarquia: BarraJerarquica[] = [];
  series: LineaSerie[] = [];
  segmentos: DonaSegmento[] = [];
  mapaFilas: string[] = [];
  mapaCols: string[] = [];
  mapaDatos: number[][] = [];

  ngOnInit(): void { this.cargar(); }

  onFiltro(rango: RangoFecha): void { this.cargar(rango.desde, rango.hasta); }

  cargar(desde = '', hasta = ''): void {
    this.cargando = true;
    forkJoin({
      kpis:      this.svc.getKpis(desde, hasta),
      jerarquia: this.svc.getJerarquia(desde, hasta),
      series:    this.svc.getSeries(desde, hasta),
      estados:   this.svc.getEstados(desde, hasta),
      mapa:      this.svc.getMapaCalor(desde, hasta),
    }).subscribe({
      next: ({ kpis, jerarquia, series, estados, mapa }) => {
        this.kpis[0].valor = kpis.total;
        this.kpis[1].valor = kpis.resueltos;
        this.kpis[2].valor = kpis.pendientes;
        this.jerarquia = jerarquia;
        this.series    = series;
        this.segmentos = estados;
        this.mapaFilas = mapa.filas;
        this.mapaCols  = mapa.columnas;
        this.mapaDatos = mapa.datos;
        this.cargando  = false;
      },
      error: () => { this.cargando = false; },
    });
  }
}
```

```html
<!-- resumen-dashboard.component.html -->
<div class="p-6">

  <!-- Filtro de fecha -->
  <app-filtro-fecha [cargando]="cargando" (cambio)="onFiltro($event)" />

  <app-dashboard-grid [cols]="6" [mobileCols]="2" [rowHeight]="110" [gap]="14" class="mt-4">

    <!-- KPIs -->
    @for (k of kpis; track k.titulo) {
      <app-dashboard-item [cols]="2" [rows]="1">
        <app-kpi-card [titulo]="k.titulo" [valor]="k.valor"
                      [icono]="k.icono" [color]="k.color" [cargando]="cargando" />
      </app-dashboard-item>
    }

    <!-- Barras jerárquicas (ancho completo) -->
    <app-dashboard-item [cols]="6" [rows]="4">
      <app-barras-verticales
        titulo="Tickets por área → responsable → ítem"
        variante="clasica"
        [jerarquia]="jerarquia"
        [cargando]="cargando" />
    </app-dashboard-item>

    <!-- Dona + Línea -->
    <app-dashboard-item [cols]="2" [rows]="3">
      <app-dona-chart
        titulo="Estado actual"
        variante="clasica" layout="col"
        [segmentos]="segmentos"
        [cargando]="cargando" />
    </app-dashboard-item>

    <app-dashboard-item [cols]="4" [rows]="3">
      <app-linea-chart
        titulo="Evolución mensual"
        variante="clasica"
        [series]="series"
        [cargando]="cargando" />
    </app-dashboard-item>

    <!-- Mapa de calor -->
    <app-dashboard-item [cols]="6" [rows]="3">
      <app-mapa-calor
        titulo="Actividad por área × mes"
        unidad="tickets"
        [mostrarValor]="true"
        [filas]="mapaFilas"
        [columnas]="mapaCols"
        [datos]="mapaDatos"
        [cargando]="cargando" />
    </app-dashboard-item>

  </app-dashboard-grid>
</div>
```

---

## 20. Estructura de archivos

```
shared/dashboard/
│
├── MANUAL_USO_DASHBOARD.md          ← Este archivo
├── index.ts                         ← Barrel de exportaciones
│
├── dashboard-grid.component.ts      ← Contenedor CSS Grid
├── dashboard-item.component.ts      ← Celda con span cols/rows
├── chart-tooltip.component.ts       ← Tooltip flotante position:fixed compartido
│
├── filtro-fecha/
│   ├── filtro-fecha.component.ts
│   └── filtro-fecha.component.html
│
├── kpi-card/
│   ├── kpi-card.component.ts
│   └── kpi-card.component.html
│
├── barra-chart/                     ← Barras horizontales
│   ├── barra-chart.component.ts
│   └── barra-chart.component.html
│
├── barras-verticales/               ← Barras verticales SVG + drill-down + variantes
│   ├── barras-verticales.component.ts
│   └── barras-verticales.component.html
│
├── linea-chart/                     ← Línea multi-serie + área + variantes
│   ├── linea-chart.component.ts
│   └── linea-chart.component.html
│
├── dona-chart/                      ← Donut (stroke-dasharray) + variantes
│   ├── dona-chart.component.ts
│   └── dona-chart.component.html
│
├── torta-chart/                     ← Pie (path arc) + variantes
│   ├── torta-chart.component.ts
│   └── torta-chart.component.html
│
├── mapa-calor/                      ← Heatmap CSS grid + opacidad dinámica
│   ├── mapa-calor.component.ts
│   └── mapa-calor.component.html
│
├── personas-chart/                  ← Tarjetas de carga por responsable
│   ├── personas-chart.component.ts
│   └── personas-chart.component.html
│
├── gauge-chart/                     ← Tacómetro SVG con aguja animada
│   ├── gauge-chart.component.ts
│   └── gauge-chart.component.html
│
└── arc-progress/                    ← Arco de progreso semicírculo
    ├── arc-progress.component.ts
    └── arc-progress.component.html
```
