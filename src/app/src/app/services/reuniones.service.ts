import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environment/environment';
import {
  Reunion,
  AsistenciaReunion,
  TipoReunion,
  LugarReunion,
  ProcesoReunion,
  CrearReunionDto,
} from '../interfaces/reuniones';
import { SelectOption } from '../interfaces/formulario';

// Mapa local — el backend devuelve tipo_evento como número
const TIPOS_EVENTO: Record<number, string> = {
  1: 'Reunión',
  2: 'Capacitación',
  3: 'Actividad de bienestar',
};

// Mapa local — el backend devuelve estado como número
const ESTADOS_REUNION: Record<number, string> = {
  1: 'ACTIVA',
  2: 'FINALIZADA',
  3: 'CANCELADA',
};

@Injectable({ providedIn: 'root' })
export class ReunionesService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}reuniones`;

  private unwrap<T>(r: any): T {
    return r?.data ?? r;
  }

  /** Resuelve campos calculados: tipo_evento_nombre, estado_label, porcentaje_asistencia, roles_texto */
  private resolverCampos(reunion: any): Reunion {
    const convocados = reunion.num_convocados ?? 0;
    const asistentes = reunion.num_asistentes ?? 0;
    const porcentaje = convocados > 0 ? Math.round((asistentes / convocados) * 100) : 0;

    // roles es un array de objetos {tipo, codigo, nombre}
    const rolesArr: { tipo: string; codigo: string; nombre: string }[] = reunion.roles ?? [];
    const rolesTipos = rolesArr.map(r => r.tipo);

    return {
      ...reunion,
      tipo_evento_nombre: TIPOS_EVENTO[reunion.tipo_evento] ?? '—',
      estado_label: ESTADOS_REUNION[reunion.estado] ?? '—',
      porcentaje_asistencia: `${porcentaje}%`,
      roles_texto: rolesTipos.join(', ') || '—',
    };
  }

  misReuniones(): Observable<Reunion[]> {
    return this.http.get<any>(`${this.api}/mis-reuniones`).pipe(
      map(r => (this.unwrap<Reunion[]>(r) ?? []).map(x => this.resolverCampos(x)))
    );
  }

  reunionesActivas(): Observable<Reunion[]> {
    return this.http.get<any>(`${this.api}/activas`).pipe(
      map(r => (this.unwrap<Reunion[]>(r) ?? []).map(x => this.resolverCampos(x)))
    );
  }

  obtener(codigo: string): Observable<Reunion> {
    return this.http.get<any>(`${this.api}/${codigo}`).pipe(
      map(r => this.resolverCampos(this.unwrap<any>(r)))
    );
  }

  crear(datos: CrearReunionDto): Observable<Reunion> {
    return this.http.post<any>(this.api, datos).pipe(map(r => this.unwrap<Reunion>(r)));
  }

  actualizar(codigo: string, datos: Partial<CrearReunionDto>): Observable<any> {
    return this.http.put<any>(`${this.api}/${codigo}`, datos).pipe(map(r => this.unwrap(r)));
  }

  registrarAsistencia(codigo: string, confirmacion: 'S' | 'N', observacion = ''): Observable<any> {
    return this.http.post<any>(`${this.api}/${codigo}/asistencia`, { confirmacion, observacion });
  }

  obtenerAsistencia(codigo: string): Observable<AsistenciaReunion[]> {
    return this.http.get<any>(`${this.api}/${codigo}/asistencia`).pipe(
      map(r => this.unwrap<AsistenciaReunion[]>(r) ?? [])
    );
  }

  registrarConvocados(codigo: string, convocados: string[]): Observable<any> {
    return this.http.post<any>(`${this.api}/${codigo}/convocados`, { convocados });
  }

  tiposReunion(): Observable<TipoReunion[]> {
    return this.http.get<any>(`${this.api}/catalogos/tipos-reunion`).pipe(
      map(r => this.unwrap<TipoReunion[]>(r) ?? [])
    );
  }

  lugares(empresa?: string): Observable<LugarReunion[]> {
    const params = empresa ? `?empresa=${empresa}` : '';
    return this.http.get<any>(`${this.api}/catalogos/lugares${params}`).pipe(
      map(r => this.unwrap<LugarReunion[]>(r) ?? [])
    );
  }

  procesos(): Observable<ProcesoReunion[]> {
    return this.http.get<any>(`${this.api}/catalogos/procesos`).pipe(
      map(r => this.unwrap<ProcesoReunion[]>(r) ?? [])
    );
  }

  /** Opciones fijas de tipo_evento para formularios */
  opcionesTipoEvento(): SelectOption[] {
    return Object.entries(TIPOS_EVENTO).map(([value, label]) => ({ value: Number(value), label }));
  }

  /** Para apiConfig — tipos de reunión (modalidades) */
  getTiposReunionOpciones(): Observable<SelectOption[]> {
    return this.tiposReunion().pipe(
      map(tipos => tipos.map(t => ({ value: t.id, label: t.nombre })))
    );
  }

  /** Para apiConfig — lugares (todos, sin filtro de empresa) */
  getLugaresOpciones(): Observable<SelectOption[]> {
    return this.lugares().pipe(
      map(locs => locs.map(l => ({ value: l.id, label: l.nombre })))
    );
  }

  /** Para apiConfig — procesos */
  getProcesosOpciones(): Observable<SelectOption[]> {
    return this.procesos().pipe(
      map(procs => procs.map(p => ({ value: p.id, label: p.nombre + ' - ' + p.empresa })))
    );
  }

  formatHora(hora: string): string {
    return hora?.substring(0, 5) ?? '';
  }

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }
}
