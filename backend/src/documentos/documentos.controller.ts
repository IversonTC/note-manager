import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentosService } from './documentos.service';
import { CrearDocumentoDto } from './dto/crear-documento.dto';
import { ActualizarDocumentoDto } from './dto/actualizar-documento.dto';
import { UpdatePermisosDto } from './dto/update-permisos.dto';
import { unwrapResponse } from '../common/helpers';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly service: DocumentosService) {}

  @Get()
  async findAll() {
    return unwrapResponse(await this.service.findAll());
  }

  @Get('tipos-permiso')
  async findTiposPermiso() {
    return unwrapResponse(await this.service.findTiposPermiso());
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.findOne(id));
  }

  @Post()
  async create(@Body() dto: CrearDocumentoDto) {
    return unwrapResponse(await this.service.create(dto));
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarDocumentoDto) {
    return unwrapResponse(await this.service.update(id, dto));
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.remove(id));
  }

  @Get(':id/permisos')
  async findPermisos(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.service.findPermisos(id));
  }

  @Put(':id/permisos')
  async updatePermisos(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePermisosDto) {
    return unwrapResponse(await this.service.updatePermisos(id, dto));
  }

  @Post(':id/imagenes')
  @UseInterceptors(FileInterceptor('imagen'))
  async subirImagen(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
    return unwrapResponse(await this.service.subirImagen(id, file));
  }

  @Delete(':id/imagenes/:nombre')
  async eliminarImagen(@Param('id', ParseIntPipe) id: number, @Param('nombre') nombre: string) {
    return unwrapResponse(await this.service.eliminarImagen(id, nombre));
  }
}
