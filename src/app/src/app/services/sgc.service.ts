import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environment/environment';
import { SelectOption } from '../interfaces/formulario';

// ── Catálogos ─────────────────────────────────────────────────────────────────

export interface FormatoSgc   { id_formato: number; nombre: string; }
export interface TipoAccion   { id_tipo:    number; nombre: string; }
export interface OrigenAccion { id_origen:  number; nombre: string; }

// ── Encabezado ────────────────────────────────────────────────────────────────

export interface EncabezadoSgc {
  formato:     number;
  empresa:     string;
  sgc_titulo1: string;
  sgc_titulo2: string;
  sgc_titulo3: string;
  sgc_codigo:  string;
  sgc_version: string;
  sgc_fecha:   string;
  icono:       string;  // URL del logo
  nom_empresa: string;
}

// ── Acciones de Mejora ────────────────────────────────────────────────────────

export interface AccionApi {
  consecutivo:        number;
  empresa:            string;
  numero:             number;
  tipo_accion?:       number;
  origen?:            number;
  nom_tipo:           string;
  nom_origen:         string;
  descripcion:        string;
  analisis?:          string;
  evidencia?:         string;
  fecha_deteccion:    string;
  nom_registrado_por?: string;
}

export interface ActividadApi {
  actividad:             string;
  responsable?:          string;
  nom_responsable?:      string;
  fecha_implementacion:  string;
}

export interface SeguimientoAccionApi {
  actividad:         string;
  nom_responsable:   string;
  fecha_seguimiento: string;
}

export interface AccionDetalle extends AccionApi {
  actividades:  ActividadApi[];
  seguimientos: SeguimientoAccionApi[];
}

export interface AccionesPage {
  data:         AccionApi[];
  total:        number;
  per_page:     number;
  current_page: number;
  last_page:    number;
}

// ── Planes de Mejora ──────────────────────────────────────────────────────────

export interface PlanApi {
  id:                     number;
  opt_nombre_propuesta:   string;
  opt_descripcion?:       string;
  opt_importancia?:       string;
  opt_posible_mejora?:    string;
  opt_fecha_seguimiento?: string;
  opt_pasos?:             string;
  aliado?:                string;
  nom_aliado?:            string;
  tiempo?:                string;
  valor_hora?:            string;
  opt_conclusion?:        string;
  cerrado:                number;  // 0 = abierto, 1 = cerrado
}

export interface SeguimientoPlanApi {
  seguimiento:       string;
  fecha_seguimiento: string;
  nom_responsable?:  string;
}

export interface PlanDetalle extends PlanApi {
  seguimientos: SeguimientoPlanApi[];
}

export interface PlanesPage {
  data:         PlanApi[];
  total:        number;
  per_page:     number;
  current_page: number;
  last_page:    number;
}

// ── Filtros ───────────────────────────────────────────────────────────────────

export interface FiltrosAcciones {
  empresa?:      string;
  tipo_accion?:  number | string;
  origen?:       number | string;
  buscar?:       string;
  pagina?:       number;
  por_pagina?:   number;
}

export interface FiltrosPlanes {
  cerrado?:       '' | '0' | '1';
  colaborador?:   string;
  pagina?:        number;
  por_pagina?:    number;
}

// ── Servicio ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class SgcService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // ── Catálogos ───────────────────────────────────────────────────────────────

  getFormatos(): Observable<FormatoSgc[]> {
    return this.http.get<{ data: FormatoSgc[] }>(`${this.api}/sgc/formatos`)
      .pipe(map(r => r.data ?? []));
  }

  getTiposAccion(): Observable<TipoAccion[]> {
    return this.http.get<{ data: TipoAccion[] }>(`${this.api}/sgc/tipos-accion`)
      .pipe(map(r => r.data ?? []));
  }

  getOrigenesAccion(): Observable<OrigenAccion[]> {
    return this.http.get<{ data: OrigenAccion[] }>(`${this.api}/sgc/origenes-accion`)
      .pipe(map(r => r.data ?? []));
  }

  /** Para uso en apiConfig de FormularioComponent */
  getTiposAccionOpciones(): Observable<SelectOption[]> {
    return this.getTiposAccion().pipe(
      map(ts => ts.map(t => ({ value: t.id_tipo, label: t.nombre })))
    );
  }

  getOrigenesAccionOpciones(): Observable<SelectOption[]> {
    return this.getOrigenesAccion().pipe(
      map(os => os.map(o => ({ value: o.id_origen, label: o.nombre })))
    );
  }

  getFormatosOpciones(): Observable<SelectOption[]> {
    return this.getFormatos().pipe(
      map(fs => fs.map(f => ({ value: f.id_formato, label: f.nombre })))
    );
  }

  // ── Encabezado ──────────────────────────────────────────────────────────────

  getEncabezado(empresa: string, formato: number): Observable<EncabezadoSgc> {
    return this.http.get<{ data: EncabezadoSgc }>(
      `${this.api}/sgc/encabezado?empresa=${empresa}&formato=${formato}`
    ).pipe(map(r => r.data));
  }

  getEncabezados(empresa: string): Observable<EncabezadoSgc[]> {
    return this.http.get<{ data: EncabezadoSgc[] }>(
      `${this.api}/sgc/encabezados?empresa=${empresa}`
    ).pipe(map(r => r.data ?? []));
  }

  actualizarEncabezado(dto: Partial<EncabezadoSgc> & { empresa: string; formato: number }): Observable<void> {
    return this.http.put<void>(`${this.api}/sgc/encabezado`, dto);
  }

  // ── Acciones de Mejora ──────────────────────────────────────────────────────

  getAcciones(filtros: FiltrosAcciones = {}): Observable<AccionesPage> {
    const p = new URLSearchParams();
    if (filtros.empresa)     p.set('empresa',     filtros.empresa);
    if (filtros.tipo_accion) p.set('tipo_accion', String(filtros.tipo_accion));
    if (filtros.origen)      p.set('origen',      String(filtros.origen));
    if (filtros.buscar)      p.set('buscar',       filtros.buscar);
    if (filtros.pagina)      p.set('pagina',       String(filtros.pagina));
    if (filtros.por_pagina)  p.set('por_pagina',   String(filtros.por_pagina));
    const qs = p.toString();
    return this.http.get<{ data: AccionesPage }>(`${this.api}/sgc/acciones${qs ? '?' + qs : ''}`)
      .pipe(map(r => r.data));
  }

  getAccion(consecutivo: number): Observable<AccionDetalle> {
    return this.http.get<{ data: AccionDetalle }>(`${this.api}/sgc/acciones/${consecutivo}`)
      .pipe(map(r => r.data));
  }

  crearAccion(dto: Partial<AccionApi>): Observable<AccionApi> {
    return this.http.post<{ data: AccionApi }>(`${this.api}/sgc/acciones`, dto)
      .pipe(map(r => r.data));
  }

  actualizarAccion(consecutivo: number, dto: Partial<AccionApi>): Observable<void> {
    return this.http.put<void>(`${this.api}/sgc/acciones/${consecutivo}`, dto);
  }

  // ── Actividades de acción ───────────────────────────────────────────────────

  getActividades(consecutivo: number): Observable<ActividadApi[]> {
    return this.http.get<{ data: ActividadApi[] }>(
      `${this.api}/sgc/acciones/${consecutivo}/actividades`
    ).pipe(map(r => r.data ?? []));
  }

  actualizarActividades(consecutivo: number, actividades: Omit<ActividadApi, 'nom_responsable'>[]): Observable<void> {
    return this.http.put<void>(`${this.api}/sgc/acciones/${consecutivo}/actividades`, { actividades });
  }

  // ── Seguimientos de acción ──────────────────────────────────────────────────

  getSeguimientosAccion(consecutivo: number): Observable<SeguimientoAccionApi[]> {
    return this.http.get<{ data: SeguimientoAccionApi[] }>(
      `${this.api}/sgc/acciones/${consecutivo}/seguimientos`
    ).pipe(map(r => r.data ?? []));
  }

  agregarSeguimientoAccion(
    consecutivo: number,
    dto: { actividad: string; responsable: string; fecha_seguimiento: string }
  ): Observable<void> {
    return this.http.post<void>(`${this.api}/sgc/acciones/${consecutivo}/seguimientos`, dto);
  }

  // ── Planes de Mejora ────────────────────────────────────────────────────────

  getPlanes(filtros: FiltrosPlanes = {}): Observable<PlanesPage> {
    const p = new URLSearchParams();
    if (filtros.cerrado !== undefined && filtros.cerrado !== '') p.set('cerrado', filtros.cerrado);
    if (filtros.colaborador) p.set('colaborador', filtros.colaborador);
    if (filtros.pagina)      p.set('pagina',      String(filtros.pagina));
    if (filtros.por_pagina)  p.set('por_pagina',  String(filtros.por_pagina));
    const qs = p.toString();
    return this.http.get<{ data: PlanesPage }>(`${this.api}/sgc/planes${qs ? '?' + qs : ''}`)
      .pipe(map(r => r.data));
  }

  getPlan(id: number): Observable<PlanDetalle> {
    return this.http.get<{ data: PlanDetalle }>(`${this.api}/sgc/planes/${id}`)
      .pipe(map(r => r.data));
  }

  crearPlan(dto: Partial<PlanApi>): Observable<PlanApi> {
    return this.http.post<{ data: PlanApi }>(`${this.api}/sgc/planes`, dto)
      .pipe(map(r => r.data));
  }

  cerrarPlan(id: number, opt_conclusion: string): Observable<void> {
    return this.http.put<void>(`${this.api}/sgc/planes/${id}/cerrar`, { opt_conclusion });
  }

  // ── Seguimientos de plan ────────────────────────────────────────────────────

  getSeguimientosPlan(id: number): Observable<SeguimientoPlanApi[]> {
    return this.http.get<{ data: SeguimientoPlanApi[] }>(
      `${this.api}/sgc/planes/${id}/seguimientos`
    ).pipe(map(r => r.data ?? []));
  }

  agregarSeguimientoPlan(
    id: number,
    dto: { seguimiento: string; fecha_seguimiento: string }
  ): Observable<void> {
    return this.http.post<void>(`${this.api}/sgc/planes/${id}/seguimientos`, dto);
  }
}
