import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'layout',
    loadComponent: () => import('./src/app/pages/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: 'documentos', loadComponent: () => import('./src/app/pages/documentos/documentos.component').then(m => m.DocumentosComponent) },
      { path: 'recordatorios', loadComponent: () => import('./src/app/pages/recordatorios/recordatorios.component').then(m => m.RecordatoriosComponent) },
      { path: 'tareas', loadComponent: () => import('./src/app/pages/tareas/tableros/tableros.component').then(m => m.TablerosComponent) },
      { path: 'tareas-kanban/:id', loadComponent: () => import('./src/app/pages/tareas/kanban/kanban.component').then(m => m.KanbanComponent) },
      { path: 'equipos', loadComponent: () => import('./src/app/pages/tareas/equipos/equipos.component').then(m => m.EquiposComponent) },
      { path: 'cronograma', loadComponent: () => import('./src/app/shared/cronograma/cronograma.component').then(m => m.CronogramaComponent) },
      { path: 'dashboard', loadComponent: () => import('./src/app/shared/dashboard/dashboard-grid.component').then(m => m.DashboardGridComponent) },
      { path: '', redirectTo: 'tareas', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/layout', pathMatch: 'full' },
];
