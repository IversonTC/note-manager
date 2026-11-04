import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaletaColoresService {

  private API_URL       = environment.apiUrl;
  private empresaActual = '';
  private usuarioActual = '';

  private readonly CACHE_PREFIX = 'paleta_';

  private logoSubject = new BehaviorSubject<string>('');
  logo$ = this.logoSubject.asObservable();

  constructor(private http: HttpClient) {}

  applyThemeByEmpresa(empresa: string): void {
    if (!empresa) return;

    // ── 1. Aplicar caché inmediatamente si existe ─────────────────────────
    const cached = this.getCachedTheme(empresa);
    if (cached) {
      this.empresaActual = empresa;
      this.logoSubject.next(cached.logo);
      this.applyTheme(cached);
      return;   // no consulta el backend hasta la próxima sesión
    }

    // ── 2. Primera vez: cargar del backend y guardar en caché ─────────────
    this.http.get<any>(`${this.API_URL}paleta-colores/${empresa}`).subscribe({
      next: (response) => {
        const data  = response.data || response;
        const theme = this.mapBackendToTheme(data);

        this.empresaActual = empresa;
        this.logoSubject.next(theme.logo);
        this.applyTheme(theme);
        this.cacheTheme(empresa, theme);
      },
      error: () => {},
    });
  }

  /** Fuerza recarga desde el backend (por si cambia la paleta) */
  invalidarCache(empresa?: string): void {
    if (empresa) {
      sessionStorage.removeItem(this.CACHE_PREFIX + empresa);
    } else {
      Object.keys(sessionStorage)
        .filter(k => k.startsWith(this.CACHE_PREFIX))
        .forEach(k => sessionStorage.removeItem(k));
    }
  }

  getEmpresaActual(): string { return this.empresaActual; }
  setUsuarioActual(u: string): void { this.usuarioActual = u; }
  getUsuarioActual(): string { return this.usuarioActual; }

  // ── Caché ────────────────────────────────────────────────────────────────

  private getCachedTheme(empresa: string): any | null {
    try {
      const raw = sessionStorage.getItem(this.CACHE_PREFIX + empresa);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  private cacheTheme(empresa: string, theme: any): void {
    try {
      sessionStorage.setItem(this.CACHE_PREFIX + empresa, JSON.stringify(theme));
    } catch {}
  }

  // ── Mapeo y aplicación ───────────────────────────────────────────────────

  private mapBackendToTheme(data: any) {
    return {
      primary:     data.primary_color  || data.color_primario        || '',
      primaryHover:data.primary_hover  || data.color_primario_hover  || '',
      bg:          data.bg             || data.color_fondo            || '',
      accent:      data.accent         || data.color_acento           || '',
      secondary:   data.secondary      || data.color_secundario       || '',
      text:        data.text           || data.color_texto            || '',
      sidebarBg:   data.sidebarBg      || data.sidebar_bg             || '',
      sidebarText: data.siderbarText   || data.sidebar_text           || '',
      navbarBg:    data.navbarBg       || data.navbar_bg              || '',
      navbarText:  data.navbarText     || data.navbar_text            || '',
      logo:        data.logo           || data.logo_url               || '',
    };
  }

  private applyTheme(theme: any): void {
    const root = document.documentElement;
    root.style.setProperty('--color-primary',       theme.primary);
    root.style.setProperty('--color-primary-hover', theme.primaryHover);
    root.style.setProperty('--color-bg',            theme.bg);
    root.style.setProperty('--color-bg-sidebar',    theme.sidebarBg);
    root.style.setProperty('--color-text-sidebar',  theme.sidebarText);
    root.style.setProperty('--color-bg-navbar',     theme.navbarBg);
    root.style.setProperty('--color-text-navbar',   theme.navbarText);
    root.style.setProperty('--color-accent',        theme.accent);
    root.style.setProperty('--color-secondary',     theme.secondary);
    root.style.setProperty('--color-text',          theme.text);
  }
}
