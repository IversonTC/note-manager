import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environment/environment';
import { OtEmpresa, OtMantenimiento, CrearOtDto } from '../interfaces/ot-mantenimiento';
import { SelectOption } from '../interfaces/formulario';

@Injectable({ providedIn: 'root' })
export class OtMantenimientoService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  private unwrap = <T>() => map((r: any): T => (r?.data ?? r) as T);

  /** GET /api/ot-mantenimiento/empresas */
  empresas(): Observable<OtEmpresa[]> {
    return this.http.get<any>(`${this.api}ot-mantenimiento/empresas`)
      .pipe(this.unwrap<OtEmpresa[]>());
  }

  /** Empresas en formato SelectOption[] — usado por ApiFactoryService / FormularioComponent */
  empresasComoOpciones(): Observable<SelectOption[]> {
    return this.empresas().pipe(
      map(lista => (Array.isArray(lista) ? lista : [])
        .map(e => ({ value: e.emp_id, label: e.emp_nombre }))
      )
    );
  }

  /** GET /api/ot-mantenimiento — mis órdenes */
  misOrdenes(): Observable<OtMantenimiento[]> {
    return this.http.get<any>(`${this.api}ot-mantenimiento`)
      .pipe(this.unwrap<OtMantenimiento[]>());
  }

  /** POST /api/ot-mantenimiento — crear nueva OT */
  crear(dto: CrearOtDto): Observable<OtMantenimiento> {
    return this.http.post<any>(`${this.api}ot-mantenimiento`, dto)
      .pipe(this.unwrap<OtMantenimiento>());
  }
}
