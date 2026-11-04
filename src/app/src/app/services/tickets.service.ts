import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environment/environment';
import { SelectOption } from '../interfaces/formulario';

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface TicketApi {
  id_ticket:      number;
  numero_ticket:  string;
  detalle:        string;
  prioridad:      string;
  prioridad_color: string;
  estado:         string;
  estado_color:   string;
  categoria:      string;
  empresa:        string;
  usuario_nombre: string;
  fecha_creacion: string;
  fecha_cierre?:  string | null;
  // Solo en historial
  horas_resolucion?: number;
}

export interface TicketsPage {
  data:         TicketApi[];
  total:        number;
  per_page:     number;
  current_page: number;
  last_page:    number;
}

export interface ResumenEstado {
  id:     number;
  estado: string;
  color:  string;
  total:  number;
}

export interface ResumenPrioridad {
  id:        number;
  prioridad: string;
  color:     string;
  total:     number;
}

export interface ResumenData {
  total_tickets:  number;
  total_abiertos: number;
  total_cerrados: number;
  por_estado:    ResumenEstado[];
  por_prioridad: ResumenPrioridad[];
}

export interface EvolucionItem {
  /** Clave de período, ej. "2026-W19" */
  periodo:   string;
  /** Etiqueta legible, ej. "19 May" */
  label:     string;
  creados:   number;
  resueltos: number;
}

export interface CategoriaApi {
  id_categoria: number;
  nombre:       string;
}

export interface EstadoApi {
  id_estado: number;
  nombre:    string;
  color:     string;
}

export interface PrioridadApi {
  id_prioridad: number;
  nombre:       string;
  color:        string;
}

export interface ComentarioApi {
  id_comentario: number;
  comentario:    string;
  fecha:         string;
  autor_nombre:  string;
  es_interno?:   boolean;
}

export interface FiltrosTickets {
  estado_id?:      number | string;
  prioridad_id?:   number | string;
  categoria_id?:   number | string;
  empresa?:        string;
  usuario_codigo?: string;
  buscar?:         string;
  pagina?:         number;
  por_pagina?:     number;
}

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // ── Catálogos ───────────────────────────────────────────────────────────────

  getCategorias(): Observable<CategoriaApi[]> {
    return this.http.get<{ data: CategoriaApi[] }>(`${this.api}/tickets/categorias`)
      .pipe(map(r => r.data ?? (r as any)));
  }

  getEstados(): Observable<EstadoApi[]> {
    return this.http.get<{ data: EstadoApi[] }>(`${this.api}/tickets/estados`)
      .pipe(map(r => r.data ?? (r as any)));
  }

  getPrioridades(): Observable<PrioridadApi[]> {
    return this.http.get<{ data: PrioridadApi[] }>(`${this.api}/tickets/prioridades`)
      .pipe(map(r => r.data ?? (r as any)));
  }

  /** Para uso con apiConfig del FormularioComponent */
  getCategoriasOpciones(): Observable<SelectOption[]> {
    return this.getCategorias().pipe(
      map(cats => cats.map(c => ({ value: c.id_categoria, label: c.nombre })))
    );
  }

  getEstadosOpciones(): Observable<SelectOption[]> {
    return this.getEstados().pipe(
      map(es => es.map(e => ({ value: e.id_estado, label: e.nombre })))
    );
  }

  getPrioridadesOpciones(): Observable<SelectOption[]> {
    return this.getPrioridades().pipe(
      map(ps => ps.map(p => ({ value: p.id_prioridad, label: p.nombre })))
    );
  }

  // ── Resumen ─────────────────────────────────────────────────────────────────

  getResumen(desde?: string, hasta?: string): Observable<ResumenData> {
    const p = new URLSearchParams();
    if (desde) p.set('desde', desde);
    if (hasta) p.set('hasta', hasta);
    const qs = p.toString();
    return this.http.get<{ data: ResumenData }>(`${this.api}/tickets/resumen${qs ? '?' + qs : ''}`)
      .pipe(map(r => r.data));
  }

  getEvolucion(desde?: string, hasta?: string): Observable<EvolucionItem[]> {
    const p = new URLSearchParams();
    if (desde) p.set('desde', desde);
    if (hasta) p.set('hasta', hasta);
    const qs = p.toString();
    return this.http.get<{ data: EvolucionItem[] }>(`${this.api}/tickets/dashboard/evolucion${qs ? '?' + qs : ''}`)
      .pipe(map(r => r.data));
  }

  // ── Listados ────────────────────────────────────────────────────────────────

  getTickets(filtros: FiltrosTickets = {}): Observable<TicketsPage> {
    const p = new URLSearchParams();
    if (filtros.estado_id)      p.set('estado_id',      String(filtros.estado_id));
    if (filtros.prioridad_id)   p.set('prioridad_id',   String(filtros.prioridad_id));
    if (filtros.categoria_id)   p.set('categoria_id',   String(filtros.categoria_id));
    if (filtros.empresa)        p.set('empresa',         filtros.empresa);
    if (filtros.usuario_codigo) p.set('usuario_codigo',  filtros.usuario_codigo);
    if (filtros.buscar)         p.set('buscar',          filtros.buscar);
    if (filtros.pagina)         p.set('pagina',          String(filtros.pagina));
    if (filtros.por_pagina)     p.set('por_pagina',      String(filtros.por_pagina));
    const qs = p.toString();
    return this.http.get<{ data: TicketsPage }>(`${this.api}/tickets${qs ? '?' + qs : ''}`)
      .pipe(map(r => r.data));
  }

  getHistorial(filtros: FiltrosTickets = {}): Observable<TicketsPage> {
    const p = new URLSearchParams();
    if (filtros.empresa)      p.set('empresa',      filtros.empresa);
    if (filtros.categoria_id) p.set('categoria_id', String(filtros.categoria_id));
    if (filtros.buscar)       p.set('buscar',       filtros.buscar);
    if (filtros.pagina)       p.set('pagina',       String(filtros.pagina));
    if (filtros.por_pagina)   p.set('por_pagina',   String(filtros.por_pagina));
    const qs = p.toString();
    return this.http.get<{ data: TicketsPage }>(`${this.api}/tickets/historial${qs ? '?' + qs : ''}`)
      .pipe(map(r => r.data));
  }

  getDetalle(id: number): Observable<TicketApi> {
    return this.http.get<{ data: TicketApi }>(`${this.api}/tickets/${id}`)
      .pipe(map(r => r.data));
  }

  // ── Crear ───────────────────────────────────────────────────────────────────

  crearTicket(dto: { detalle: string; prioridad_id: number; categoria_id: number }): Observable<{ numero_ticket: string }> {
    return this.http.post<{ data: { numero_ticket: string }; message: string }>(`${this.api}/tickets`, dto)
      .pipe(map(r => r.data));
  }

  // ── Gestión admin ───────────────────────────────────────────────────────────

  cambiarEstado(id: number, estado_id: number): Observable<void> {
    return this.http.put<void>(`${this.api}/tickets/${id}/estado`, { estado_id });
  }

  agregarRespuesta(id: number, respuesta: string): Observable<void> {
    return this.http.put<void>(`${this.api}/tickets/${id}/respuesta`, { respuesta });
  }

  // ── Comentarios ─────────────────────────────────────────────────────────────

  getComentarios(id: number): Observable<ComentarioApi[]> {
    return this.http.get<{ data: ComentarioApi[] }>(`${this.api}/tickets/${id}/comentarios`)
      .pipe(map(r => r.data));
  }

  /** Admin puede pasar estado_id para cambiar el estado al mismo tiempo */
  agregarComentario(id: number, comentario: string, estado_id?: number): Observable<void> {
    return this.http.post<void>(`${this.api}/tickets/${id}/comentarios`, {
      comentario,
      ...(estado_id ? { estado_id } : {}),
    });
  }
}
