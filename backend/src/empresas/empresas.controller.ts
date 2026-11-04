import { Controller, Get, Param } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { unwrapResponse } from '../common/helpers';

@Controller('empresas')
export class EmpresasController {
  constructor(private readonly service: EmpresasService) {}

  @Get()
  async findAll() {
    return unwrapResponse(await this.service.findAll());
  }

  @Get('por-cedula/:cedula')
  async findByCedula(@Param('cedula') cedula: string) {
    return unwrapResponse(await this.service.findByCedula(cedula));
  }

  @Get(':nit')
  async findOne(@Param('nit') nit: string) {
    return unwrapResponse(await this.service.findOne(nit));
  }

  @Get(':nit/centros-costo')
  async findCentrosCosto(@Param('nit') nit: string) {
    return unwrapResponse(await this.service.findCentrosCosto(nit));
  }
}
