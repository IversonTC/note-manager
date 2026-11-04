import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { environment } from '../environment/environment';
import {
  RolApi,
  RolDetalle,
  ModuloApi,
  ModuloRol,
  PermisosColaborador,
  MiPermiso,
  UsuarioAcceso,
} from '../interfaces/permisos';
import { SelectOption } from '../interfaces/formulario';

@Injectable({ providedIn: 'root' })
export class PermisosService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  private h() {
    return { headers: this.headers };
  }

  // ── Módulos ────────────────────────────────────────────────────
  getModulos(todos = false): Observable<ModuloApi[]> {
    const url = todos ? `${this.api}modulos?todos=1` : `${this.api}modulos`;
    return this.http.get<any>(url, this.h()).pipe(map((r) => r.data ?? []));
  }

  /** Versión para usar con apiConfig en FormularioComponent — retorna SelectOption[] */
  getModulosOpciones(): Observable<SelectOption[]> {
    return this.getModulos(true).pipe(
      map((mods) => mods.map((m) => ({ value: m.modulo, label: m.nombre }))),
    );
  }

  crearModulo(modulo: Partial<ModuloApi>): Observable<ModuloApi> {
    return this.http
      .post<any>(`${this.api}modulos`, modulo, this.h())
      .pipe(map((r) => r.data));
  }

  actualizarModulo(id: number, modulo: Partial<ModuloApi>): Observable<void> {
    return this.http
      .put<any>(`${this.api}modulos/${id}`, modulo, this.h())
      .pipe(map(() => {}));
  }

  eliminarModulo(id: number): Observable<void> {
    return this.http
      .delete<any>(`${this.api}modulos/${id}`, this.h())
      .pipe(map(() => {}));
  }

  // ── Roles ──────────────────────────────────────────────────────
  getRoles(): Observable<RolApi[]> {
    return this.http
      .get<any>(`${this.api}roles`, this.h())
      .pipe(map((r) => r.data ?? []));
  }

  getRol(id: number): Observable<RolDetalle> {
    return this.http
      .get<any>(`${this.api}roles/${id}`, this.h())
      .pipe(map((r) => r.data));
  }

  crearRol(nombre: string): Observable<{ id_rol: number }> {
    return this.http
      .post<any>(`${this.api}roles`, { nombre }, this.h())
      .pipe(map((r) => r.data));
  }

  actualizarRolModulos(
    id: number,
    modulos: Partial<ModuloRol>[],
  ): Observable<void> {
    return this.http
      .put<any>(`${this.api}roles/${id}/modulos`, { modulos }, this.h())
      .pipe(map(() => {}));
  }

  eliminarRol(id: number): Observable<void> {
    return this.http
      .delete<any>(`${this.api}roles/${id}`, this.h())
      .pipe(map(() => {}));
  }

  // ── Permisos colaborador ───────────────────────────────────────
  // Ambos endpoints devuelven { codigo, efectivos, asignados } — ver interfaces/permisos.ts
  getMisPermisos(): Observable<MiPermiso[]> {
    return this.http
      .get<any>(`${this.api}permisos/mis-permisos`, this.h())
      .pipe(map((r) => r.data?.efectivos ?? []));
  }

  getPermisosColaborador(codigo: string): Observable<PermisosColaborador> {
    return this.http
      .get<any>(`${this.api}colaboradores/${codigo}/permisos`, this.h())
      .pipe(map((r) => r.data));
  }

  actualizarPermisosColaborador(
    codigo: string,
    payload: { modulos: Partial<ModuloRol>[] },
  ): Observable<void> {
    return this.http
      .put<any>(
        `${this.api}colaboradores/${codigo}/permisos`,
        payload,
        this.h(),
      )
      .pipe(map(() => {}));
  }

  // ── Accesos por empresa ────────────────────────────────────────
  // TODO: conectar al endpoint real cuando esté disponible
  getUsuariosConAccesos(): Observable<UsuarioAcceso[]> {
    return of([]);
  }

  guardarAccesos(cedula: string, empresas: string[]): Observable<void> {
    return of(void 0);
  }

  // ── Sesión: guardar/leer mis-permisos ─────────────────────────
  guardarPermisosEnSesion(permisos: MiPermiso[]): void {
    sessionStorage.setItem('mis_permisos', JSON.stringify(permisos));
  }

  leerPermisosEnSesion(): MiPermiso[] {
    try {
      return JSON.parse(sessionStorage.getItem('mis_permisos') ?? '[]');
    } catch {
      return [];
    }
  }

  puedeVer(modulo: string): boolean {
    const permisos = this.leerPermisosEnSesion();
    // eslint-disable-next-line eqeqeq
    return permisos.some((p) => p.puede_ver == 1 && p.modulo === modulo);
  }
}
