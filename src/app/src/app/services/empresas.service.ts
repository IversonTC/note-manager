import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../environment/environment';
import { SelectOption } from '../interfaces/formulario';

export interface EmpresaApi {
  nit: string;
  nombre: string;
  logo: string;
}

export interface CentroCostoApi {
  id: string;
  nombre: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class EmpresasService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  private headers(token?: string | null): HttpHeaders {
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  getEmpresas(token?: string | null): Observable<EmpresaApi[]> {
    return this.http
      .get<ApiResponse<EmpresaApi[]>>(`${this.base}empresas`, {
        headers: this.headers(token),
      })
      .pipe(
        map((res) => res.data ?? []),
        catchError(() => of([])),
      );
  }

  getEmpresaPorNit(nit: string, token?: string | null): Observable<EmpresaApi | null> {
    return this.http
      .get<ApiResponse<EmpresaApi>>(`${this.base}empresas/${nit}`, {
        headers: this.headers(token),
      })
      .pipe(
        map((res) => res.data ?? null),
        catchError(() => of(null)),
      );
  }

  /** Para apiConfig — lista de empresas como SelectOption[] */
  getEmpresasOpciones(): Observable<SelectOption[]> {
    return this.getEmpresas().pipe(
      map(empresas => empresas.map(e => ({ value: e.nit, label: e.nombre }))),
      catchError(() => of([])),
    );
  }

  getEmpresaPorCedula(cedula: string, token?: string | null): Observable<EmpresaApi[]> {
    return this.http
      .get<ApiResponse<EmpresaApi[]>>(`${this.base}empresas/por-cedula/${cedula}`, {
        headers: this.headers(token),
      })
      .pipe(
        map((res) => res.data ?? []),
        catchError(() => of([])),
      );
  }

  /** Catálogo de centros de costo de una empresa (para selectores jerárquicos de permisos) */
  getCentrosCosto(nit: string): Observable<CentroCostoApi[]> {
    return this.http
      .get<ApiResponse<CentroCostoApi[]>>(`${this.base}empresas/${nit}/centros-costo`)
      .pipe(
        map((res) => res.data ?? []),
        catchError(() => of([])),
      );
  }
}
