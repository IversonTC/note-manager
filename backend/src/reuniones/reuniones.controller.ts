import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { ReunionesService } from './reuniones.service';
import { CrearReunionDto } from './dto/crear-reunion.dto';
import { ActualizarReunionDto } from './dto/actualizar-reunion.dto';
import { AsistenciaReunionDto } from './dto/asistencia-reunion.dto';
import { ConvocadosReunionDto } from './dto/convocados-reunion.dto';
import { unwrapResponse } from '../common/helpers';

@Controller('reuniones')
export class ReunionesController {
  constructor(private readonly service: ReunionesService) {}

  @Get('mis-reuniones')
  async findMisReuniones(@Query('codigo') codigo?: string) {
    return unwrapResponse(await this.service.findMisReuniones(codigo));
  }

  @Get('activas')
  async findActivas() {
    return unwrapResponse(await this.service.findActivas());
  }

  @Get('catalogos/tipos-reunion')
  async findTiposReunion() {
    return unwrapResponse(await this.service.findTiposReunion());
  }

  @Get('catalogos/lugares')
  async findLugares(@Query('empresa') empresa?: string) {
    return unwrapResponse(await this.service.findLugares(empresa));
  }

  @Get('catalogos/procesos')
  async findProcesos() {
    return unwrapResponse(await this.service.findProcesos());
  }

  @Get(':codigo')
  async findOne(@Param('codigo') codigo: string) {
    return unwrapResponse(await this.service.findOne(codigo));
  }

  @Post()
  async create(@Body() dto: CrearReunionDto) {
    return unwrapResponse(await this.service.create(dto));
  }

  @Put(':codigo')
  async update(@Param('codigo') codigo: string, @Body() dto: ActualizarReunionDto) {
    return unwrapResponse(await this.service.update(codigo, dto));
  }

  @Post(':codigo/asistencia')
  async registrarAsistencia(@Param('codigo') codigo: string, @Body() dto: AsistenciaReunionDto) {
    return unwrapResponse(await this.service.registrarAsistencia(codigo, dto));
  }

  @Get(':codigo/asistencia')
  async findAsistencia(@Param('codigo') codigo: string) {
    return unwrapResponse(await this.service.findAsistencia(codigo));
  }

  @Post(':codigo/convocados')
  async agregarConvocados(@Param('codigo') codigo: string, @Body() dto: ConvocadosReunionDto) {
    return unwrapResponse(await this.service.agregarConvocados(codigo, dto));
  }
}
