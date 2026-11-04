import { Injectable } from '@angular/core';
import { PruebaApiService } from './prueba-api.service';
import { PaletaColoresService } from './paleta-colores.service';
import { ColaboradoresService } from './colaboradores.service';
import { EmpresasService } from './empresas.service';
import { PermisosService } from './permisos.service';
import { TicketsService } from './tickets.service';
import { SgcService } from './sgc.service';
import { ReunionesService } from './reuniones.service';
import { OtMantenimientoService } from './ot-mantenimiento.service';
import { PermisosLaboralesService } from './permisos-laborales.service';

@Injectable({
  providedIn: 'root',
})
export class ApiFactoryService {
  constructor(
    private pruebaApi: PruebaApiService,
    private paletaApi: PaletaColoresService,
    private colaboradoresService: ColaboradoresService,
    private empresasService: EmpresasService,
    private permisosService: PermisosService,
    private ticketsService: TicketsService,
    private sgcService: SgcService,
    private reunionesService: ReunionesService,
    private otMantenimientoService: OtMantenimientoService,
    private permisosLaboralesService: PermisosLaboralesService,
  ) {}

  obtenerServicio(nombre: string): any {
    const servicios: any = {
      PruebaApiService:        this.pruebaApi,
      PaletaColoresService:    this.paletaApi,
      ColaboradoresService:    this.colaboradoresService,
      EmpresasService:         this.empresasService,
      PermisosService:         this.permisosService,
      TicketsService:          this.ticketsService,
      SgcService:              this.sgcService,
      ReunionesService:        this.reunionesService,
      OtMantenimientoService:  this.otMantenimientoService,
      PermisosLaboralesService: this.permisosLaboralesService,
    };

    return servicios[nombre];
  }
}
