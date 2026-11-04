import { Controller, Get, Post, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { PermisosLaboralesService } from './permisos-laborales.service';
import { CrearPermisoLaboralDto } from './dto/crear-permiso-laboral.dto';
import { FirmarPermisoDto } from './dto/firmar-permiso.dto';
import { unwrapResponse } from '../common/helpers';

@Controller('permisos-laborales')
export class PermisosLaboralesController {
  constructor(private readonly service: PermisosLaboralesService) {}

  @Get('tipos')
  async findTipos() {
    return unwrapResponse(await this.service.findTipos());
  }

  @Post()
  async create(@Body() dto: CrearPermisoLaboralDto) {
    return unwrapResponse(await this.service.create(dto));
  }

  @Get('pendientes/firmar-solicitud')
  async findPendientesFirmar() {
    return unwrapResponse(await this.service.findPendientesFirmar());
  }

  @Get('pendientes/autorizar')
  async findPendientesAutorizar() {
    return unwrapResponse(await this.service.findPendientesAutorizar());
  }

  @Post(':consecutivo/firmar')
  async firmar(@Param('consecutivo', ParseIntPipe) consecutivo: number, @Body() dto: FirmarPermisoDto) {
    return unwrapResponse(await this.service.firmar(consecutivo, dto));
  }

  @Get('historial')
  async findHistorial(
    @Query('empresa') empresa?: string,
    @Query('fecha_inicio') fecha_inicio?: string,
    @Query('fecha_fin') fecha_fin?: string,
  ) {
    return unwrapResponse(await this.service.findHistorial(empresa, fecha_inicio, fecha_fin));
  }

  @Get(':consecutivo/pdf')
  async generarPdf(@Param('consecutivo', ParseIntPipe) consecutivo: number) {
    return unwrapResponse(await this.service.generarPdf(consecutivo));
  }
}
