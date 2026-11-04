import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

type NavItem = {
  label: string;
  route: string;
  icon: string;
  children?: NavItem[];
};

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <aside class="sidebar" [class.closed]="!sidebarOpen()">
        <div class="sidebar-header">
          <i class="logo fas fa-sticky-note"></i>
          <span class="app-name">Note Manager</span>
          <button class="sidebar-toggle" (click)="sidebarOpen.set(!sidebarOpen())">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <nav class="nav">
          @for (item of navItems; track item.label) {
            @if (item.children) {
              <div class="nav-group">
                <button class="nav-link" (click)="toggleGroup(item.label)">
                  <i class="nav-icon {{ item.icon }}"></i>
                  <span class="label">{{ item.label }}</span>
                  <i class="arrow fas fa-chevron-right" [class.open]="expandedGroups().has(item.label)"></i>
                </button>
                @if (expandedGroups().has(item.label)) {
                  <div class="nav-children">
                    @for (child of item.children; track child.label) {
                      <a class="nav-link child"
                         [routerLink]="[child.route]"
                         routerLinkActive="active"
                         [routerLinkActiveOptions]="{exact: true}">
                        <i class="nav-icon {{ child.icon }}"></i>
                        <span class="label">{{ child.label }}</span>
                      </a>
                    }
                  </div>
                }
              </div>
            } @else {
              <a class="nav-link"
                 [routerLink]="[item.route]"
                 routerLinkActive="active"
                 [routerLinkActiveOptions]="{exact: true}">
                <i class="nav-icon {{ item.icon }}"></i>
                <span class="label">{{ item.label }}</span>
              </a>
            }
          }
        </nav>

        <div class="sidebar-footer">
          <a class="nav-link" routerLink="/auth/login">
            <i class="nav-icon fas fa-sign-out-alt"></i>
            <span class="label">Cerrar sesión</span>
          </a>
        </div>
      </aside>

      <div class="main">
        <header class="navbar">
          <button class="menu-btn" (click)="sidebarOpen.set(!sidebarOpen())">
            <i class="fas fa-bars"></i>
          </button>
          <span class="page-title">{{ pageTitle() }}</span>
        </header>

        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { --sidebar-w: 260px; }

    .layout { display: flex; height: 100dvh; overflow: hidden; background: #f1f5f9; }

    .sidebar {
      width: var(--sidebar-w); background: #0f172a; color: #e2e8f0;
      display: flex; flex-direction: column; transition: width .25s ease;
      overflow: hidden; flex-shrink: 0; z-index: 50;
    }
    .sidebar.closed { width: 0; }

    .sidebar-header {
      display: flex; align-items: center; gap: .75rem;
      padding: 1rem 1.25rem; border-bottom: 1px solid #1e293b;
      min-height: 64px;
    }
    .logo {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: #fff; font-size: 1.15rem;
      width: 34px; height: 34px; display: flex; align-items: center;
      justify-content: center; border-radius: 10px; flex-shrink: 0;
    }
    .app-name { font-weight: 700; font-size: 1rem; flex: 1; white-space: nowrap; letter-spacing: -.3px; }
    .sidebar-toggle { background: none; border: none; color: #64748b; cursor: pointer; font-size: .9rem; padding: 6px; border-radius: 6px; }
    .sidebar-toggle:hover { background: #1e293b; color: #e2e8f0; }

    .nav { flex: 1; overflow-y: auto; padding: .75rem .5rem; }

    .nav-link {
      display: flex; align-items: center; gap: .75rem;
      padding: .55rem .75rem; margin-bottom: 2px; border-radius: 8px; cursor: pointer;
      color: #94a3b8; text-decoration: none; font-size: .875rem;
      transition: all .15s; border: none; background: none; width: 100%; text-align: left;
    }
    .nav-link:hover { background: #1e293b; color: #e2e8f0; }
    .nav-link.active { background: rgba(59, 130, 246, .15); color: #60a5fa; font-weight: 500; }
    .nav-link .nav-icon { width: 20px; text-align: center; font-size: .9rem; flex-shrink: 0; }
    .nav-link .label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .nav-link .arrow { margin-left: auto; font-size: .6rem; transition: transform .2s; color: #64748b; }
    .nav-link .arrow.open { transform: rotate(90deg); }

    .nav-children { padding-left: .25rem; margin-top: 2px; margin-bottom: 4px; }
    .nav-link.child { padding-left: 2.5rem; font-size: .82rem; }
    .nav-group { margin-bottom: 2px; }

    .sidebar-footer {
      padding: .5rem; border-top: 1px solid #1e293b;
    }
    .sidebar-footer .nav-link { color: #64748b; }
    .sidebar-footer .nav-link:hover { color: #f87171; background: rgba(239,68,68,.08); }

    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

    .navbar {
      display: flex; align-items: center; gap: 1rem;
      padding: 0 1.5rem; height: 64px; background: #fff;
      border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,.04);
    }
    .menu-btn {
      background: none; border: none; font-size: 1.2rem;
      cursor: pointer; color: #64748b; padding: 8px; border-radius: 8px;
    }
    .menu-btn:hover { background: #f1f5f9; color: #0f172a; }
    .page-title { font-weight: 600; color: #1e293b; font-size: 1.05rem; }

    .content {
      flex: 1; overflow-y: auto; padding: 1.5rem;
      background: #f8fafc;
    }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
  `],
})
export class LayoutComponent {
  protected readonly sidebarOpen = signal(true);
  protected readonly expandedGroups = signal(new Set<string>());

  private router = inject(Router);

  protected readonly pageTitle = computed(() => {
    const url = this.router.url;
    const active = this.navItems.find(i => {
      if (i.children) return i.children.some(c => url.includes(c.route));
      return url.includes(i.route);
    });
    return active?.label ?? 'Note Manager';
  });

  protected readonly navItems: NavItem[] = [
    { label: 'Documentos', route: '/layout/documentos', icon: 'fas fa-file-alt' },
    { label: 'Recordatorios', route: '/layout/recordatorios', icon: 'fas fa-bell' },
    {
      label: 'Tareas', route: '/layout/tareas', icon: 'fas fa-tasks',
      children: [
        { label: 'Tableros', route: '/layout/tareas', icon: 'fas fa-columns' },
        { label: 'Equipos', route: '/layout/equipos', icon: 'fas fa-users' },
      ],
    },
    { label: 'Cronograma', route: '/layout/cronograma', icon: 'fas fa-calendar-alt' },
    { label: 'Dashboard', route: '/layout/dashboard', icon: 'fas fa-chart-bar' },
    { label: 'Reuniones', route: '/layout/reuniones', icon: 'fas fa-handshake' },
  ];

  protected toggleGroup(label: string): void {
    const s = new Set(this.expandedGroups());
    if (s.has(label)) s.delete(label); else s.add(label);
    this.expandedGroups.set(s);
  }
}
