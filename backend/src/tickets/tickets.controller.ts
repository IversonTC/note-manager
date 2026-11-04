import { Controller, Get, Post, Put, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CrearTicketDto } from './dto/crear-ticket.dto';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';
import { RespuestaDto } from './dto/respuesta.dto';
import { ComentarioDto } from './dto/comentario.dto';
import { unwrapResponse } from '../common/helpers';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly service: TicketsService) {}

  @Get('categorias')
  async findCategorias() {
    return unwrapResponse(await this.service.findCategorias());
  }

  @Get('estados')
  async findEstados() {
    return unwrapResponse(await this.service.findEstados());
  }

  @Get('prioridades')
  async findPrioridades() {
    return unwrapResponse(await this.service.findPrioridades());
  }

  @Get('resumen')
  async findResumen(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return unwrapResponse(await this.service.findResumen(desde, hasta));
  }

  @Get('dashboard/evolucion')
  async findDashboardEvolucion(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ) {
    return unwrapResponse(await this.service.findDashboardEvolucion(desde, hasta));
  }

  @Get()
  async findAll(
    @Query('estado_id', ParseIntPipe) estado_id?: number,
    @Query('prioridad_id', ParseIntPipe) prioridad_id?: number,
    @Query('categoria_id', ParseIntPipe) categoria_id?: number,
    @Query('empresa') empresa?: string,
    @Query('usuario_codigo') usuario_codigo?: string,
    @Query('buscar') buscar?: string,
    @Query('pagina', ParseIntPipe) pagina?: number,
    @Query('por_pagina', ParseIntPipe) por_pagina?: number,
  ) {
    return unwrapResponse(await this.service.findAll(estado_id, prioridad_id, categoria_id, empresa, usuario_codigo, buscar, pagina, por_pagina));
  }

  @Get('historial')
  async findHistorial(
    @Query('empresa') empresa?: string,
    @Query('categoria_id', ParseIntPipe) categoria_id?: number,
    @Query('buscar') buscar?: string,
    @Query('pagina', ParseIntPipe) pagina?: number,
    @Query('por_pagina', ParseIntPipe) por_pagina?: number,
  ) {
    return unwrapResponse(await this.service.findHistorial(empresa, categoria_id, buscar, pagina, por_pagina));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.findOne(id));
  }

  @Post()
  async create(@Body() dto: CrearTicketDto) {
    return unwrapResponse(await this.service.create(dto));
  }

  @Put(':id/estado')
  async cambiarEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: CambiarEstadoDto) {
    return unwrapResponse(await this.service.cambiarEstado(id, dto));
  }

  @Put(':id/respuesta')
  async responder(@Param('id', ParseIntPipe) id: number, @Body() dto: RespuestaDto) {
    return unwrapResponse(await this.service.responder(id, dto));
  }

  @Get(':id/comentarios')
  async findComentarios(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.findComentarios(id));
  }

  @Post(':id/comentarios')
  async createComentario(@Param('id', ParseIntPipe) id: number, @Body() dto: ComentarioDto) {
    return unwrapResponse(await this.service.createComentario(id, dto));
  }
}
