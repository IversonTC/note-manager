import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environment/environment';
import { PermisoLaboral, TipoPermiso, CrearPermisoDto, Colaborador } from '../interfaces/permisos-laborales';
import { SelectOption } from '../interfaces/formulario';

@Injectable({ providedIn: 'root' })
export class PermisosLaboralesService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  private unwrap = <T>() => map((r: any): T => (r?.data ?? r) as T);

  /** Obtiene tipos de permisos disponibles */
  getTiposPermisos(): Observable<TipoPermiso[]> {
    return this.http.get<any>(`${this.api}permisos-laborales/tipos`).pipe(
      this.unwrap<TipoPermiso[]>()
    );
  }

  /** Versión para usar con apiConfig en FormularioComponent — retorna SelectOption[] */
  getTiposPermisosOpciones(): Observable<SelectOption[]> {
    return this.getTiposPermisos().pipe(
      map(tipos => tipos.map(t => ({ value: t.codigo, label: t.nombre })))
    );
  }

  /** Obtiene colaboradores activos para seleccionar.
   *  El endpoint /colaboradores devuelve paginado ({data:{data:[...],total,...}}),
   *  no un array plano — hay que bajar al segundo nivel. */
  getColaboradores(empresa?: string): Observable<Colaborador[]> {
    let url = `${this.api}colaboradores`;
    if (empresa) url += `?empresa=${empresa}`;
    return this.http.get<any>(url).pipe(
      map(r => r?.data?.data ?? r?.data ?? [])
    );
  }

  /** Crea un nuevo permiso */
  crearPermiso(dto: CrearPermisoDto): Observable<PermisoLaboral> {
    return this.http.post<any>(`${this.api}permisos-laborales`, dto).pipe(
      this.unwrap<PermisoLaboral>()
    );
  }

  /** Obtiene permisos pendientes de firmar (como solicitante) */
  getPendientesFirmarSolicitud(): Observable<PermisoLaboral[]> {
    return this.http.get<any>(`${this.api}permisos-laborales/pendientes/firmar-solicitud`).pipe(
      this.unwrap<PermisoLaboral[]>()
    );
  }

  /** Obtiene permisos pendientes de autorizar (como jefe) */
  getPendientesAutorizar(): Observable<PermisoLaboral[]> {
    return this.http.get<any>(`${this.api}permisos-laborales/pendientes/autorizar`).pipe(
      this.unwrap<PermisoLaboral[]>()
    );
  }

  /** Firma un permiso (como solicitante o autorizador) */
  firmarPermiso(consecutivo: number, tipo: 'solicitante' | 'autorizador'): Observable<any> {
    return this.http.post<any>(
      `${this.api}permisos-laborales/${consecutivo}/firmar`,
      { firma: tipo }
    );
  }

  /** Obtiene historial de permisos con filtros */
  getHistorial(filtros?: { empresa?: string; fecha_inicio?: string; fecha_fin?: string }): Observable<PermisoLaboral[]> {
    let url = `${this.api}permisos-laborales/historial`;
    const params = new URLSearchParams();
    if (filtros?.empresa) params.append('empresa', filtros.empresa);
    if (filtros?.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros?.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);

    if (params.toString()) {
      url += '?' + params.toString();
    }

    return this.http.get<any>(url).pipe(
      this.unwrap<PermisoLaboral[]>()
    );
  }

  /** Descarga PDF de un permiso */
  descargarPdf(consecutivo: number, empresa: string): void {
    window.open(
      `${this.api}permisos-laborales/${consecutivo}/pdf?empresa=${empresa}`,
      '_blank'
    );
  }
}
