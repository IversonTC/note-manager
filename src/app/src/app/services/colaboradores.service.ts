import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environment/environment';
import { SelectOption } from '../interfaces/formulario';
import { AccesosColaborador } from '../interfaces/permisos';

export interface ColaboradorApi {
  codigo: string;
  nombre: string;
  correo: string;
  cedula: string;
  celular: string;
  estado: number;
  dependencia: string;
  centro_costo?: string;
  cargo: string;
  empresa: string;
  rol: string;
  fecha_ingreso: string;
  tipo_contrato: string;
}

export interface ColaboradoresPage {
  items: ColaboradorApi[];
  lastPage: number;
  total: number;
}

/** Respuesta simplificada del endpoint GET /api/colaboradores?todos=1 */
export interface ColaboradorSimple {
  codigo: string;
  nombre: string;
  dependencia_nombre?: string;
  empresa?: string; // virtual: asignado al cargar por empresa
}

/** Respuesta simplificada del endpoint GET /api/colaboradores?paginar=0 (array plano, sin envoltorio de paginación) */
export interface ColaboradorMini {
  codigo: string;
  cedula: string;
  nombre: string;
  empresa: string;
}

@Injectable({ providedIn: 'root' })
export class ColaboradoresService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  getAliados(params: {
    empresas?: string;
    estado?: number;
    pagina?: number;
    porPagina?: number;
    buscar?: string;
    centroCosto?: string;
  } = {}): Observable<ColaboradoresPage> {
    const p = new URLSearchParams();
    if (params.empresas)  p.set('empresas',   params.empresas);
    if (params.estado !== undefined) p.set('estado', String(params.estado));
    if (params.pagina)    p.set('pagina',     String(params.pagina));
    if (params.porPagina) p.set('por_pagina', String(params.porPagina));
    if (params.buscar)    p.set('buscar',     params.buscar);
    if (params.centroCosto) p.set('centro_costo', params.centroCosto);

    return this.http.get<any>(`${this.api}colaboradores?${p.toString()}`).pipe(
      map(r => ({
        items:    r.data?.data   ?? r.data ?? [],
        lastPage: r.data?.last_page ?? 1,
        total:    r.data?.total     ?? 0,
      }))
    );
  }

  /** Todos los colaboradores activos (endpoint optimizado, solo codigo+nombre) */
  getTodos(empresa?: string): Observable<ColaboradorSimple[]> {
    const p = new URLSearchParams({ todos: '1' });
    if (empresa) p.set('empresas', empresa);
    return this.http.get<{ status: string; data: ColaboradorSimple[] }>(
      `${this.api}colaboradores?${p.toString()}`
    ).pipe(map(r => r.data ?? []));
  }

  /** Accesos de un colaborador: permisos laborales, horas extras y módulos del sistema */
  getAccesos(codigo: string): Observable<AccesosColaborador> {
    return this.http.get<any>(
      `${this.api}colaboradores/${encodeURIComponent(codigo)}/accesos`
    ).pipe(map(r => r.data));
  }

  /**
   * Versión para usar con apiConfig en FormularioComponent — retorna SelectOption[].
   * El label incluye la empresa para poder identificar al colaborador cuando
   * hay varios con el mismo nombre (ej. selects de permisos, traslado, reasignación).
   */
  getAliadosOpciones(): Observable<SelectOption[]> {
    return this.getAliados({ porPagina: 1000, estado: 1 }).pipe(
      map(r => r.items.map(c => ({
        value: c.codigo,
        label: c.empresa ? `${c.nombre} — ${c.empresa}` : c.nombre,
      })))
    );
  }

  /**
   * Búsqueda remota para selects (metodoBusqueda de apiConfig): consulta al
   * backend por el texto tecleado en vez de depender de una lista precargada,
   * que el backend limita (ej. 500 registros) y por eso no encontraba nombres
   * fuera de esa primera página.
   */
  buscarAliadosOpciones(texto: string): Observable<SelectOption[]> {
    return this.getAliados({ buscar: texto || undefined, porPagina: 50, estado: 1 }).pipe(
      map(r => r.items.map(c => ({
        value: c.codigo,
        label: c.empresa ? `${c.nombre} — ${c.empresa}` : c.nombre,
      })))
    );
  }

  /**
   * Todos los colaboradores sin paginar — array plano, no el wrapper {data:{data:[...]}}.
   * `empresas` es una lista separada por comas (ej. "ARRGE,INMAT"); sin este
   * parámetro trae todas las empresas.
   */
  getTodosSinPaginar(empresas?: string): Observable<ColaboradorMini[]> {
    const p = new URLSearchParams({ paginar: '0' });
    if (empresas) p.set('empresas', empresas);
    return this.http.get<any>(`${this.api}colaboradores?${p.toString()}`).pipe(
      map(r => Array.isArray(r?.data) ? r.data : (Array.isArray(r) ? r : []))
    );
  }

  /**
   * Versión para usar con apiConfig en FormularioComponent — trae TODOS los
   * colaboradores de una sola vez (sin paginación ni búsqueda remota por
   * teclado). Ideal para selects que necesitan el catálogo completo cargado
   * una vez y filtrado en cliente.
   *
   * TODO: hoy siempre trae todas las empresas — cuando se defina cómo derivar
   * las empresas permitidas del usuario logueado (sesión/permisos), pasar ese
   * valor como `empresas` aquí para acotar el listado según sus permisos.
   */
  getAliadosOpcionesTodas(empresas?: string): Observable<SelectOption[]> {
    return this.getTodosSinPaginar(empresas).pipe(
      map(items => items.map(c => ({
        value: c.codigo,
        label: c.empresa ? `${c.nombre} — ${c.empresa}` : c.nombre,
      })))
    );
  }
}
