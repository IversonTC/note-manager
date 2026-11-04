import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environment/environment';
import {
  Recordatorio, CrearRecordatorioDto,
  NotificacionRecordatorio, RecordatorioEstado,
} from '../interfaces/recordatorios';

@Injectable({ providedIn: 'root' })
export class RecordatoriosModuloService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  private unwrap = <T>() => map((r: any): T => (r?.data ?? r) as T);

  // ── Recordatorios CRUD ────────────────────────────────────────────────────

  listar(filtros?: {
    estado?: RecordatorioEstado;
    tipo?: string;
    alcance?: string;
  }): Observable<Recordatorio[]> {
    let params: any = {};
    if (filtros?.estado)  params['estado']  = filtros.estado;
    if (filtros?.tipo)    params['tipo']    = filtros.tipo;
    if (filtros?.alcance) params['alcance'] = filtros.alcance;
    return this.http.get<any>(`${this.api}recordatorios`, { params }).pipe(this.unwrap<Recordatorio[]>());
  }

  obtener(id: number): Observable<Recordatorio> {
    return this.http.get<any>(`${this.api}recordatorios/${id}`).pipe(this.unwrap<Recordatorio>());
  }

  crear(dto: CrearRecordatorioDto): Observable<Recordatorio> {
    return this.http.post<any>(`${this.api}recordatorios`, dto).pipe(this.unwrap<Recordatorio>());
  }

  actualizar(id: number, dto: Partial<CrearRecordatorioDto>): Observable<Recordatorio> {
    return this.http.put<any>(`${this.api}recordatorios/${id}`, dto).pipe(this.unwrap<Recordatorio>());
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<any>(`${this.api}recordatorios/${id}`).pipe(map(() => undefined));
  }

  completar(id: number): Observable<Recordatorio> {
    return this.http.put<any>(`${this.api}recordatorios/${id}/completar`, {}).pipe(this.unwrap<Recordatorio>());
  }

  reactivar(id: number): Observable<Recordatorio> {
    return this.http.put<any>(`${this.api}recordatorios/${id}/reactivar`, {}).pipe(this.unwrap<Recordatorio>());
  }

  // ── Próximas ejecuciones ──────────────────────────────────────────────────

  proximos(limite = 10): Observable<Recordatorio[]> {
    return this.http.get<any>(`${this.api}recordatorios/proximos`, { params: { limite } })
      .pipe(this.unwrap<Recordatorio[]>());
  }

  // ── Notificaciones ────────────────────────────────────────────────────────

  listarNotificaciones(): Observable<NotificacionRecordatorio[]> {
    return this.http.get<any>(`${this.api}recordatorios/notificaciones`).pipe(this.unwrap<NotificacionRecordatorio[]>());
  }

  marcarNotificacionLeida(id: number): Observable<void> {
    return this.http.put<any>(`${this.api}recordatorios/notificaciones/${id}/leida`, {}).pipe(map(() => undefined));
  }

  // ── Helper: descripción de recurrencia ────────────────────────────────────

  describir(r: Recordatorio): string {
    if (r.tipo === 'temporal') {
      return `Una vez el ${r.fecha_unica ?? '—'} a las ${r.hora}`;
    }
    switch (r.frecuencia) {
      case 'diario':
        return `Todos los días a las ${r.hora}`;
      case 'semanal':
        if (r.dias_semana?.length) {
          const dias = r.dias_semana.map(d =>
            d.charAt(0).toUpperCase() + d.slice(1, 3)
          ).join(', ');
          return `Cada semana — ${dias} a las ${r.hora}`;
        }
        return `Semanal a las ${r.hora}`;
      case 'quincenal':
        return `Cada 15 días a las ${r.hora}`;
      case 'mensual':
        return `El día ${r.dia_mes} de cada mes a las ${r.hora}`;
      case 'personalizado':
        return `Cada ${r.intervalo_dias} día(s) a las ${r.hora}`;
      default:
        return `A las ${r.hora}`;
    }
  }
}
