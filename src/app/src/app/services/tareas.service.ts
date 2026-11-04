import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environment/environment';
import {
  Tablero, ColumnaTablero, EtiquetaTablero, MiembroTablero, KanbanData,
  Tarea, AsignadoTarea, ComentarioTarea, ChecklistTarea, ChecklistItem,
  ArchivoTarea, RecordatorioTarea, HistorialTarea, AuditoriaItem,
  Equipo, MiembroEquipo, FiltrosTareas, DashboardTareas,
  CrearTableroDto, CrearTareaDto, NotificacionTarea,
} from '../interfaces/tareas';

@Injectable({ providedIn: 'root' })
export class TareasService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  /** Desenvuelve respuestas { data: ... } y devuelve el payload. */
  private unwrap = <T>() => map((r: any): T => (r?.data ?? r) as T);

  // ════════════════════════════════════════════════════════════════════════════
  // TABLEROS
  // ════════════════════════════════════════════════════════════════════════════

  listarTableros(codigoColab?: string): Observable<Tablero[]> {
    const params: any = {};
    if (codigoColab) params['codigo_colab'] = codigoColab;
    return this.http.get<any>(`${this.api}tareas/tableros`, { params }).pipe(this.unwrap<Tablero[]>());
  }

  obtenerTablero(id: number): Observable<Tablero> {
    return this.http.get<any>(`${this.api}tareas/tableros/${id}`).pipe(this.unwrap<Tablero>());
  }

  crearTablero(dto: CrearTableroDto): Observable<Tablero> {
    return this.http.post<any>(`${this.api}tareas/tableros`, dto).pipe(this.unwrap<Tablero>());
  }

  actualizarTablero(id: number, dto: Partial<CrearTableroDto>): Observable<Tablero> {
    return this.http.put<any>(`${this.api}tareas/tableros/${id}`, dto).pipe(this.unwrap<Tablero>());
  }

  eliminarTablero(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}tareas/tableros/${id}`);
  }

  /** Vista Kanban completa: tablero + columnas con tareas + etiquetas + miembros. */
  obtenerKanban(id: number): Observable<KanbanData> {
    return this.http.get<any>(`${this.api}tareas/tableros/${id}/kanban`).pipe(this.unwrap<KanbanData>());
  }

  // ── Columnas ───────────────────────────────────────────────────────────────

  crearColumna(tableroId: number, dto: { nombre: string; color?: string; posicion?: number }): Observable<ColumnaTablero> {
    return this.http.post<any>(`${this.api}tareas/tableros/${tableroId}/columnas`, dto).pipe(this.unwrap<ColumnaTablero>());
  }

  reordenarColumnas(tableroId: number, ids: number[]): Observable<void> {
    return this.http.put<void>(`${this.api}tareas/tableros/${tableroId}/columnas/reordenar`, { columnas: ids });
  }

  actualizarColumna(tableroId: number, colId: number, dto: { nombre?: string; color?: string }): Observable<ColumnaTablero> {
    return this.http.put<any>(`${this.api}tareas/tableros/${tableroId}/columnas/${colId}`, dto).pipe(this.unwrap<ColumnaTablero>());
  }

  eliminarColumna(tableroId: number, colId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}tareas/tableros/${tableroId}/columnas/${colId}`);
  }

  // ── Etiquetas ──────────────────────────────────────────────────────────────

  listarEtiquetas(tableroId: number): Observable<EtiquetaTablero[]> {
    return this.http.get<any>(`${this.api}tareas/tableros/${tableroId}/etiquetas`).pipe(this.unwrap<EtiquetaTablero[]>());
  }

  crearEtiqueta(tableroId: number, dto: { nombre: string; color: string }): Observable<EtiquetaTablero> {
    return this.http.post<any>(`${this.api}tareas/tableros/${tableroId}/etiquetas`, dto).pipe(this.unwrap<EtiquetaTablero>());
  }

  actualizarEtiqueta(tableroId: number, etId: number, dto: { nombre?: string; color?: string }): Observable<EtiquetaTablero> {
    return this.http.put<any>(`${this.api}tareas/tableros/${tableroId}/etiquetas/${etId}`, dto).pipe(this.unwrap<EtiquetaTablero>());
  }

  eliminarEtiqueta(tableroId: number, etId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}tareas/tableros/${tableroId}/etiquetas/${etId}`);
  }

  // ── Miembros del tablero ───────────────────────────────────────────────────

  listarMiembrosTablero(tableroId: number): Observable<MiembroTablero[]> {
    return this.http.get<any>(`${this.api}tareas/tableros/${tableroId}/miembros`).pipe(this.unwrap<MiembroTablero[]>());
  }

  agregarMiembroTablero(tableroId: number, dto: { codigo: string; rol?: string }): Observable<MiembroTablero> {
    return this.http.post<any>(`${this.api}tareas/tableros/${tableroId}/miembros`, dto).pipe(this.unwrap<MiembroTablero>());
  }

  quitarMiembroTablero(tableroId: number, codigo: string): Observable<void> {
    return this.http.delete<void>(`${this.api}tareas/tableros/${tableroId}/miembros/${codigo}`);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TAREAS
  // ════════════════════════════════════════════════════════════════════════════

  /** GET /tareas devuelve paginado ({data:{data:[...],total,...}}), no un array
   *  plano — el `unwrap()` genérico se queda en el primer nivel. */
  listarTareas(filtros: FiltrosTareas = {}): Observable<Tarea[]> {
    const p = new URLSearchParams();
    if (filtros.tablero_id !== undefined) p.set('tablero_id', String(filtros.tablero_id));
    if (filtros.asignado)                 p.set('asignado',    filtros.asignado);
    if (filtros.prioridad)                p.set('prioridad',   filtros.prioridad);
    if (filtros.buscar)                   p.set('buscar',      filtros.buscar);
    if (filtros.vencidas)                 p.set('vencidas',   '1');
    if (filtros.reunion_id)               p.set('reunion_id',  filtros.reunion_id);
    if (filtros.columna_id !== undefined) p.set('columna_id',  String(filtros.columna_id));
    const qs = p.toString();
    return this.http.get<any>(`${this.api}tareas${qs ? '?' + qs : ''}`).pipe(
      map(r => r?.data?.data ?? r?.data ?? [])
    );
  }

  obtenerTarea(id: number): Observable<Tarea> {
    return this.http.get<any>(`${this.api}tareas/${id}`).pipe(this.unwrap<Tarea>());
  }

  crearTarea(dto: CrearTareaDto): Observable<Tarea> {
    return this.http.post<any>(`${this.api}tareas`, dto).pipe(this.unwrap<Tarea>());
  }

  actualizarTarea(id: number, dto: Partial<CrearTareaDto> & { fecha_completada?: string | null }): Observable<Tarea> {
    return this.http.put<any>(`${this.api}tareas/${id}`, dto).pipe(this.unwrap<Tarea>());
  }

  eliminarTarea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}tareas/${id}`);
  }

  /** Cambiar de columna y/o posición. */
  moverTarea(id: number, dto: { columna_id: number; posicion: number }): Observable<void> {
    return this.http.put<void>(`${this.api}tareas/${id}/mover`, dto);
  }

  /** Sincroniza etiquetas (reemplaza el set completo). */
  sincronizarEtiquetas(id: number, etiquetas: number[]): Observable<void> {
    return this.http.put<void>(`${this.api}tareas/${id}/etiquetas`, { etiquetas });
  }

  // ── Asignados ──────────────────────────────────────────────────────────────

  asignarUsuario(id: number, codigo: string): Observable<AsignadoTarea> {
    return this.http.post<any>(`${this.api}tareas/${id}/asignados`, { codigo }).pipe(this.unwrap<AsignadoTarea>());
  }

  quitarAsignado(id: number, codigo: string): Observable<void> {
    return this.http.delete<void>(`${this.api}tareas/${id}/asignados/${codigo}`);
  }

  // ── Comentarios ────────────────────────────────────────────────────────────

  listarComentarios(id: number): Observable<ComentarioTarea[]> {
    return this.http.get<any>(`${this.api}tareas/${id}/comentarios`).pipe(this.unwrap<ComentarioTarea[]>());
  }

  agregarComentario(id: number, comentario: string): Observable<ComentarioTarea> {
    return this.http.post<any>(`${this.api}tareas/${id}/comentarios`, { comentario }).pipe(this.unwrap<ComentarioTarea>());
  }

  editarComentario(id: number, comentarioId: number, comentario: string): Observable<ComentarioTarea> {
    return this.http.put<any>(`${this.api}tareas/${id}/comentarios/${comentarioId}`, { comentario }).pipe(this.unwrap<ComentarioTarea>());
  }

  eliminarComentario(id: number, comentarioId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}tareas/${id}/comentarios/${comentarioId}`);
  }

  // ── Archivos ───────────────────────────────────────────────────────────────

  listarArchivos(id: number): Observable<ArchivoTarea[]> {
    return this.http.get<any>(`${this.api}tareas/${id}/archivos`).pipe(this.unwrap<ArchivoTarea[]>());
  }

  /** Sube archivo (multipart/form-data). Límite backend: 20 MB. */
  subirArchivo(id: number, file: File): Observable<ArchivoTarea> {
    const form = new FormData();
    form.append('archivo', file);
    return this.http.post<any>(`${this.api}tareas/${id}/archivos`, form).pipe(this.unwrap<ArchivoTarea>());
  }

  eliminarArchivo(id: number, archivoId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}tareas/${id}/archivos/${archivoId}`);
  }

  // ── Checklists ─────────────────────────────────────────────────────────────

  listarChecklists(id: number): Observable<ChecklistTarea[]> {
    return this.http.get<any>(`${this.api}tareas/${id}/checklists`).pipe(
      map(r => r?.data?.data ?? r?.data ?? [])
    );
  }

  crearChecklist(id: number, titulo: string): Observable<ChecklistTarea> {
    return this.http.post<any>(`${this.api}tareas/${id}/checklists`, { titulo }).pipe(
      map(r => {
        const data = r?.data ?? r;
        // Nuevo formato backend: { id: N, checklists: [...] }
        if (data?.checklists && data?.id !== undefined) {
          const cl = (data.checklists as ChecklistTarea[]).find(c => c.id === data.id);
          return cl ?? (data.checklists[0] as ChecklistTarea);
        }
        // Formato anterior: objeto directo
        return data as ChecklistTarea;
      })
    );
  }

  eliminarChecklist(id: number, checklistId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}tareas/${id}/checklists/${checklistId}`);
  }

  /** Backend puede responder con el item plano o con el snapshot completo
   *  `{ id, checklists: [...] }` (mismo formato que crearChecklist) — se
   *  extrae el item real del snapshot cuando aplica. */
  private extraerItemDeRespuesta(r: any, checklistId: number, itemId: number): ChecklistItem {
    const data = r?.data ?? r;
    if (data?.checklists) {
      const cl = (data.checklists as ChecklistTarea[]).find(c => c.id === checklistId);
      const item = cl?.items?.find(i => i.id === itemId);
      if (item) return item;
    }
    return data as ChecklistItem;
  }

  agregarItemChecklist(id: number, checklistId: number, texto: string): Observable<ChecklistItem> {
    return this.http.post<any>(`${this.api}tareas/${id}/checklists/${checklistId}/items`, { texto }).pipe(
      map(r => {
        const data = r?.data ?? r;
        if (data?.checklists) {
          const cl = (data.checklists as ChecklistTarea[]).find(c => c.id === checklistId);
          const items = cl?.items ?? [];
          return items[items.length - 1] as ChecklistItem;
        }
        return data as ChecklistItem;
      })
    );
  }

  toggleItemChecklist(id: number, checklistId: number, itemId: number): Observable<ChecklistItem> {
    return this.http.put<any>(`${this.api}tareas/${id}/checklists/${checklistId}/items/${itemId}/toggle`, {}).pipe(
      map(r => this.extraerItemDeRespuesta(r, checklistId, itemId))
    );
  }

  eliminarItemChecklist(id: number, checklistId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}tareas/${id}/checklists/${checklistId}/items/${itemId}`);
  }

  // ── Recordatorios ──────────────────────────────────────────────────────────

  listarRecordatorios(id: number): Observable<RecordatorioTarea[]> {
    return this.http.get<any>(`${this.api}tareas/${id}/recordatorios`).pipe(this.unwrap<RecordatorioTarea[]>());
  }

  crearRecordatorio(id: number, dto: { codigo_colab: string; fecha: string; mensaje?: string }): Observable<RecordatorioTarea> {
    return this.http.post<any>(`${this.api}tareas/${id}/recordatorios`, dto).pipe(this.unwrap<RecordatorioTarea>());
  }

  eliminarRecordatorio(id: number, recordatorioId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}tareas/${id}/recordatorios/${recordatorioId}`);
  }

  // ── Historial ──────────────────────────────────────────────────────────────

  listarHistorial(id: number): Observable<HistorialTarea[]> {
    return this.http.get<any>(`${this.api}tareas/${id}/historial`).pipe(this.unwrap<HistorialTarea[]>());
  }

  listarAuditoria(id: number, limite = 100): Observable<AuditoriaItem[]> {
    return this.http.get<any>(`${this.api}tareas/${id}/auditoria?limite=${limite}`).pipe(this.unwrap<AuditoriaItem[]>());
  }

  // ── Notificaciones ────────────────────────────────────────────────────────

  listarNotificaciones(): Observable<NotificacionTarea[]> {
    return this.http.get<any>(`${this.api}tareas/notificaciones`).pipe(this.unwrap<NotificacionTarea[]>());
  }

  marcarNotificacionLeida(id: number): Observable<void> {
    return this.http.put<void>(`${this.api}tareas/notificaciones/${id}/leida`, {});
  }

  leerTodasNotificaciones(): Observable<void> {
    return this.http.put<void>(`${this.api}tareas/notificaciones/leer-todas`, {});
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────

  dashboard(): Observable<DashboardTareas> {
    return this.http.get<any>(`${this.api}tareas/dashboard`).pipe(this.unwrap<DashboardTareas>());
  }

  // ════════════════════════════════════════════════════════════════════════════
  // EQUIPOS
  // ════════════════════════════════════════════════════════════════════════════

  listarEquipos(): Observable<Equipo[]> {
    return this.http.get<any>(`${this.api}tareas/equipos`).pipe(this.unwrap<Equipo[]>());
  }

  crearEquipo(dto: { nombre: string; descripcion?: string; color?: string }): Observable<Equipo> {
    return this.http.post<any>(`${this.api}tareas/equipos`, dto).pipe(this.unwrap<Equipo>());
  }

  obtenerEquipo(id: number): Observable<Equipo> {
    return this.http.get<any>(`${this.api}tareas/equipos/${id}`).pipe(this.unwrap<Equipo>());
  }

  actualizarEquipo(id: number, dto: { nombre?: string; descripcion?: string; color?: string }): Observable<Equipo> {
    return this.http.put<any>(`${this.api}tareas/equipos/${id}`, dto).pipe(this.unwrap<Equipo>());
  }

  eliminarEquipo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}tareas/equipos/${id}`);
  }

  listarMiembrosEquipo(id: number): Observable<MiembroEquipo[]> {
    return this.http.get<any>(`${this.api}tareas/equipos/${id}/miembros`).pipe(this.unwrap<MiembroEquipo[]>());
  }

  agregarMiembroEquipo(id: number, dto: { codigo: string; rol?: string }): Observable<MiembroEquipo> {
    return this.http.post<any>(`${this.api}tareas/equipos/${id}/miembros`, dto).pipe(this.unwrap<MiembroEquipo>());
  }

  quitarMiembroEquipo(id: number, codigo: string): Observable<void> {
    return this.http.delete<void>(`${this.api}tareas/equipos/${id}/miembros/${codigo}`);
  }
}
