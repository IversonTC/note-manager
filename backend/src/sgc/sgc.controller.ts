import { Controller, Get, Post, Put, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { SgcService } from './sgc.service';
import { CrearAccionDto } from './dto/crear-accion.dto';
import { ActualizarAccionDto } from './dto/actualizar-accion.dto';
import { CrearPlanDto } from './dto/crear-plan.dto';
import { ActividadesDto } from './dto/actividades.dto';
import { CrearSeguimientoDto } from './dto/seguimiento.dto';
import { EncabezadoDto } from './dto/encabezado.dto';
import { unwrapResponse } from '../common/helpers';

@Controller('sgc')
export class SgcController {
  constructor(private readonly service: SgcService) {}

  @Get('formatos')
  async findFormatos() {
    return unwrapResponse(await this.service.findFormatos());
  }

  @Get('tipos-accion')
  async findTiposAccion() {
    return unwrapResponse(await this.service.findTiposAccion());
  }

  @Get('origenes-accion')
  async findOrigenesAccion() {
    return unwrapResponse(await this.service.findOrigenesAccion());
  }

  @Get('encabezado')
  async findEncabezado(
    @Query('empresa') empresa: string,
    @Query('formato', ParseIntPipe) formato: number,
  ) {
    return unwrapResponse(await this.service.findEncabezado(empresa, formato));
  }

  @Get('encabezados')
  async findEncabezados(@Query('empresa') empresa: string) {
    return unwrapResponse(await this.service.findEncabezados(empresa));
  }

  @Put('encabezado')
  async upsertEncabezado(@Body() dto: EncabezadoDto) {
    return unwrapResponse(await this.service.upsertEncabezado(dto));
  }

  @Get('acciones')
  async findAcciones(
    @Query('empresa') empresa?: string,
    @Query('tipo_accion', ParseIntPipe) tipo_accion?: number,
    @Query('origen', ParseIntPipe) origen?: number,
    @Query('buscar') buscar?: string,
    @Query('pagina', ParseIntPipe) pagina?: number,
    @Query('por_pagina', ParseIntPipe) por_pagina?: number,
  ) {
    return unwrapResponse(await this.service.findAcciones(empresa, tipo_accion, origen, buscar, pagina, por_pagina));
  }

  @Get('acciones/:consecutivo')
  async findOneAccion(@Param('consecutivo', ParseIntPipe) consecutivo: number) {
    return unwrapResponse(await this.service.findOneAccion(consecutivo));
  }

  @Post('acciones')
  async createAccion(@Body() dto: CrearAccionDto) {
    return unwrapResponse(await this.service.createAccion(dto));
  }

  @Put('acciones/:consecutivo')
  async updateAccion(@Param('consecutivo', ParseIntPipe) consecutivo: number, @Body() dto: ActualizarAccionDto) {
    return unwrapResponse(await this.service.updateAccion(consecutivo, dto));
  }

  @Get('acciones/:consecutivo/actividades')
  async findActividades(@Param('consecutivo', ParseIntPipe) consecutivo: number) {
    return unwrapResponse(await this.service.findActividades(consecutivo));
  }

  @Put('acciones/:consecutivo/actividades')
  async updateActividades(@Param('consecutivo', ParseIntPipe) consecutivo: number, @Body() dto: ActividadesDto) {
    return unwrapResponse(await this.service.updateActividades(consecutivo, dto));
  }

  @Get('acciones/:consecutivo/seguimientos')
  async findSeguimientos(@Param('consecutivo', ParseIntPipe) consecutivo: number) {
    return unwrapResponse(await this.service.findSeguimientos(consecutivo));
  }

  @Post('acciones/:consecutivo/seguimientos')
  async createSeguimiento(@Param('consecutivo', ParseIntPipe) consecutivo: number, @Body() dto: CrearSeguimientoDto) {
    return unwrapResponse(await this.service.createSeguimiento(consecutivo, dto));
  }

  @Get('planes')
  async findPlanMejoras(
    @Query('cerrado', ParseIntPipe) cerrado?: number,
    @Query('colaborador') colaborador?: string,
    @Query('pagina', ParseIntPipe) pagina?: number,
    @Query('por_pagina', ParseIntPipe) por_pagina?: number,
  ) {
    return unwrapResponse(await this.service.findPlanMejoras(cerrado, colaborador, pagina, por_pagina));
  }

  @Get('planes/:id')
  async findOnePlanMejora(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.findOnePlanMejora(id));
  }

  @Post('planes')
  async createPlanMejora(@Body() dto: CrearPlanDto) {
    return unwrapResponse(await this.service.createPlanMejora(dto));
  }

  @Put('planes/:id/cerrar')
  async cerrarPlanMejora(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.cerrarPlanMejora(id));
  }

  @Get('planes/:id/seguimientos')
  async findSeguimientosPlan(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.findSeguimientosPlan(id));
  }

  @Post('planes/:id/seguimientos')
  async createSeguimientoPlan(@Param('id', ParseIntPipe) id: number, @Body() dto: CrearSeguimientoDto) {
    return unwrapResponse(await this.service.createSeguimientoPlan(id, dto));
  }
}
