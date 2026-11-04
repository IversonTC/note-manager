import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../environment/environment';

export interface Documento {
  id:                  number;
  titulo:              string;
  contenido:           string;
  categoria?:          string;
  empresa?:            string;
  publico:             0 | 1;
  creado_por?:         string;
  nombre_creador?:     string;
  fecha_creacion:      string;
  fecha_actualizacion: string;
}

/** Catálogo de niveles de permiso — GET /documentos/tipos-permiso */
export interface TipoPermiso {
  id_tipo:    number;
  nombre:     string;
  ver:        0 | 1;
  crear:      0 | 1;
  actualizar: 0 | 1;
  eliminar:   0 | 1;
}

/** Persona con acceso a un documento — GET/PUT /documentos/{id}/permisos */
export interface PersonaPermiso {
  codigo_colab: string;
  nombre?:      string;
  tipo:         number;
  nombre_tipo?: string;
  ver?:         0 | 1;
  crear?:       0 | 1;
  actualizar?:  0 | 1;
  eliminar?:    0 | 1;
}

export interface CrearDocumentoDto {
  titulo:     string;
  contenido:  string;
  categoria?: string;
  publico?:   boolean;
  /** Opcional — si se omite, el documento queda sin permisos asignados */
  personas?:  { codigo_colab: string; tipo: number }[];
}

@Injectable({ providedIn: 'root' })
export class DocumentosService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  getAll(): Observable<Documento[]> {
    return this.http.get<any>(`${this.api}documentos`).pipe(
      map(r => {
        const d = r?.data ?? r;
        return Array.isArray(d) ? d : [];
      }),
      catchError(() => of([] as Documento[])),
    );
  }

  getOne(id: number): Observable<Documento> {
    return this.http.get<any>(`${this.api}documentos/${id}`).pipe(
      map(r => r?.data ?? r),
    );
  }

  crear(dto: CrearDocumentoDto): Observable<Documento> {
    return this.http.post<any>(`${this.api}documentos`, dto).pipe(
      map(r => r?.data ?? r),
    );
  }

  actualizar(id: number, dto: Partial<CrearDocumentoDto>): Observable<Documento> {
    return this.http.put<any>(`${this.api}documentos/${id}`, dto).pipe(
      map(r => r?.data ?? r),
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}documentos/${id}`);
  }

  getTiposPermiso(): Observable<TipoPermiso[]> {
    return this.http.get<any>(`${this.api}documentos/tipos-permiso`).pipe(map(r => r?.data ?? []));
  }

  getPermisos(id: number): Observable<PersonaPermiso[]> {
    return this.http.get<any>(`${this.api}documentos/${id}/permisos`).pipe(map(r => r?.data ?? []));
  }

  /** Reemplaza la lista completa de personas con acceso al documento */
  guardarPermisos(id: number, personas: { codigo_colab: string; tipo: number }[]): Observable<PersonaPermiso[]> {
    return this.http.put<any>(`${this.api}documentos/${id}/permisos`, { personas }).pipe(map(r => r?.data ?? []));
  }

  subirImagen(id: number, archivo: File): Observable<{ url: string }> {
    const form = new FormData();
    form.append('imagen', archivo);
    return this.http.post<any>(`${this.api}documentos/${id}/imagenes`, form).pipe(
      map(r => r?.data ?? r),
    );
  }

  eliminarImagen(id: number, nombre: string): Observable<void> {
    return this.http.delete<void>(`${this.api}documentos/${id}/imagenes/${nombre}`);
  }

  /** Convierte una URL relativa del backend (/uploads/...) en URL absoluta */
  urlAbsoluta(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    // apiUrl = "http://host/backend_intranet/api/" → base = "http://host/backend_intranet/"
    const base = this.api.replace(/api\/?$/, '');
    return base + url.replace(/^\//, '');
  }

  categorias(docs: Documento[]): string[] {
    const set = new Set(docs.map(d => d.categoria).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  }
}
