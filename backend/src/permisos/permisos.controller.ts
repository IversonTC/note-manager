import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { CrearModuloDto } from './dto/crear-modulo.dto';
import { ActualizarModuloDto } from './dto/actualizar-modulo.dto';
import { CrearRolDto } from './dto/crear-rol.dto';
import { ModulosRolDto } from './dto/modulo-rol.dto';
import { ActualizarPermisosDto } from './dto/actualizar-permisos.dto';
import { unwrapResponse } from '../common/helpers';

@Controller()
export class PermisosController {
  constructor(private readonly service: PermisosService) {}

  @Get('modulos')
  async findModulos(@Query('todos') todos?: string) {
    return unwrapResponse(await this.service.findModulos(todos));
  }

  @Post('modulos')
  async createModulo(@Body() dto: CrearModuloDto) {
    return unwrapResponse(await this.service.createModulo(dto));
  }

  @Put('modulos/:id')
  async updateModulo(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarModuloDto) {
    return unwrapResponse(await this.service.updateModulo(id, dto));
  }

  @Delete('modulos/:id')
  async removeModulo(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.removeModulo(id));
  }

  @Get('roles')
  async findRoles() {
    return unwrapResponse(await this.service.findRoles());
  }

  @Post('roles')
  async createRol(@Body() dto: CrearRolDto) {
    return unwrapResponse(await this.service.createRol(dto));
  }

  @Get('roles/:id')
  async findOneRol(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.findOneRol(id));
  }

  @Put('roles/:id/modulos')
  async updateRolModulos(@Param('id', ParseIntPipe) id: number, @Body() dto: ModulosRolDto) {
    return unwrapResponse(await this.service.updateRolModulos(id, dto));
  }

  @Delete('roles/:id')
  async removeRol(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.removeRol(id));
  }

  @Get('permisos/mis-permisos')
  async findMisPermisos(@Query('codigo') codigo: string) {
    return unwrapResponse(await this.service.findMisPermisos(codigo));
  }

  @Get('colaboradores/:codigo/permisos')
  async findPermisosColaborador(@Param('codigo') codigo: string) {
    return unwrapResponse(await this.service.findPermisosColaborador(codigo));
  }

  @Put('colaboradores/:codigo/permisos')
  async updatePermisosColaborador(@Param('codigo') codigo: string, @Body() dto: ActualizarPermisosDto) {
    return unwrapResponse(await this.service.updatePermisosColaborador(codigo, dto));
  }

  @Get('colaboradores/:codigo/accesos')
  async findAccesosColaborador(@Param('codigo') codigo: string) {
    return unwrapResponse(await this.service.findAccesosColaborador(codigo));
  }
}
