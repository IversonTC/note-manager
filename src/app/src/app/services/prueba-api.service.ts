import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { SelectOption } from '../interfaces/formulario';
import { MapearServiciosService } from '../shared/helpers/mapear-servicios.service';

export interface Rol {
  id_rol: number;
  nombre_rol: string;
  id_aplicativo: number;
  nombre_aplicativo: string;
}

export interface Empresa {
  id: string;
  nombre: string;
  logo: string;
}

@Injectable({
  providedIn: 'root',
})
export class PruebaApiService {
  // URL base de la API tomada del archivo de environment
  private API_URL = environment.apiCentral;

  constructor(
    private http: HttpClient,
    private mapService: MapearServiciosService,
  ) {}

  obtenerRoles(): Observable<SelectOption[]> {
    const url = `${this.API_URL}roles/mostrar_roles.php`;

    return this.http.get<any>(url).pipe(
      tap((response) => {
        console.log('Respuesta completa roles:', response);
      }),

      map((response) => response.roles || []),

      tap((roles) => {
        console.log('Roles recibidos:', roles);
      }),

      // usar servicio de mapeo
      map((roles) =>
        this.mapService.mapToSelectOptions(roles, 'id_rol', 'nombre_rol'),
      ),

      tap((resultado) => {
        console.log('Roles mapeados:', resultado);
      }),
    );
  }


  obtenerEmpresas(): Observable<SelectOption[]> {
    const url = `${this.API_URL}empresa/mostrar_empresa.php`;

    return this.http.get<any>(url).pipe(
      tap((response) => {
        console.log('Respuesta completa empresas:', response);
      }),

      map((response) => response.empresa || []),

      tap((empresas) => {
        console.log('Empresas recibidas:', empresas);
      }),


      map((empresas) =>
        this.mapService.mapToSelectOptions(empresas, 'id', 'nombre'),
      ),

      tap((resultado) => {
        console.log('Empresas mapeadas:', resultado);
      }),
    );
  }


}
