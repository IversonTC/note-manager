import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { RecordatoriosService } from './recordatorios.service';
import { CrearRecordatorioDto } from './dto/crear-recordatorio.dto';
import { ActualizarRecordatorioDto } from './dto/actualizar-recordatorio.dto';
import { unwrapResponse } from '../common/helpers';

@Controller('recordatorios')
export class RecordatoriosController {
  constructor(private readonly service: RecordatoriosService) {}

  @Get()
  async findAll(
    @Query('estado') estado?: string,
    @Query('tipo') tipo?: string,
    @Query('alcance') alcance?: string,
  ) {
    return unwrapResponse(await this.service.findAll(estado, tipo, alcance));
  }

  @Get('proximos')
  async findProximos(@Query('limite', ParseIntPipe) limite?: number) {
    return unwrapResponse(await this.service.findProximos(limite ?? 10));
  }

  @Get('notificaciones')
  async findNotificaciones() {
    return unwrapResponse(await this.service.findNotificaciones());
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.findOne(id));
  }

  @Post()
  async create(@Body() dto: CrearRecordatorioDto) {
    return unwrapResponse(await this.service.create(dto));
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarRecordatorioDto) {
    return unwrapResponse(await this.service.update(id, dto));
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.remove(id));
  }

  @Put(':id/completar')
  async completar(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.completar(id));
  }

  @Put(':id/reactivar')
  async reactivar(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.reactivar(id));
  }

  @Put('notificaciones/:id/leida')
  async marcarNotificacionLeida(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.marcarNotificacionLeida(id));
  }
}
