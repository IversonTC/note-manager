import {
  Controller, Get, Post, Put, Delete,
  Param, Query, Body, UseInterceptors, UploadedFile, ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TareasService } from './tareas.service';
import { CrearTableroDto } from './dto/crear-tablero.dto';
import { CrearTareaDto } from './dto/crear-tarea.dto';
import { CrearColumnaDto } from './dto/crear-columna.dto';
import { CrearEtiquetaDto } from './dto/crear-etiqueta.dto';
import { CrearComentarioDto } from './dto/crear-comentario.dto';
import { CrearChecklistDto } from './dto/crear-checklist.dto';
import { CrearItemChecklistDto } from './dto/crear-item-checklist.dto';
import { CrearRecordatorioDto } from './dto/crear-recordatorio.dto';
import { CrearEquipoDto } from './dto/crear-equipo.dto';
import { MoverTareaDto } from './dto/mover-tarea.dto';
import { ReordenarColumnasDto } from './dto/reordenar-columnas.dto';
import { AgregarMiembroDto } from './dto/agregar-miembro.dto';
import { AgregarAsignadoDto } from './dto/agregar-asignado.dto';
import { AgregarMiembroEquipoDto } from './dto/agregar-miembro-equipo.dto';
import { ActualizarEtiquetasDto } from './dto/actualizar-etiquetas.dto';
import { unwrapResponse } from '../common/helpers';

@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  // =================== DASHBOARD ===================

  @Get('dashboard')
  async getDashboard() {
    return unwrapResponse(await this.tareasService.getDashboard());
  }

  // =================== NOTIFICACIONES ===================

  @Get('notificaciones')
  async findNotificaciones() {
    return unwrapResponse(await this.tareasService.findNotificaciones());
  }

  @Put('notificaciones/leer-todas')
  async marcarTodasLeidas() {
    return unwrapResponse(await this.tareasService.marcarTodasLeidas());
  }

  @Put('notificaciones/:id/leida')
  async marcarNotificacionLeida(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.marcarNotificacionLeida(id));
  }

  // =================== EQUIPOS ===================

  @Get('equipos')
  async findAllEquipos() {
    return unwrapResponse(await this.tareasService.findAllEquipos());
  }

  @Post('equipos')
  async createEquipo(@Body() dto: CrearEquipoDto) {
    return unwrapResponse(await this.tareasService.createEquipo(dto));
  }

  @Get('equipos/:id')
  async findOneEquipo(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.findOneEquipo(id));
  }

  @Put('equipos/:id')
  async updateEquipo(@Param('id', ParseIntPipe) id: number, @Body() dto: CrearEquipoDto) {
    return unwrapResponse(await this.tareasService.updateEquipo(id, dto));
  }

  @Delete('equipos/:id')
  async deleteEquipo(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.deleteEquipo(id));
  }

  @Get('equipos/:id/miembros')
  async findMiembrosEquipo(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.findMiembrosEquipo(id));
  }

  @Post('equipos/:id/miembros')
  async addMiembroEquipo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AgregarMiembroEquipoDto,
  ) {
    return unwrapResponse(await this.tareasService.addMiembroEquipo(id, dto));
  }

  @Delete('equipos/:id/miembros/:codigo')
  async removeMiembroEquipo(
    @Param('id', ParseIntPipe) id: number,
    @Param('codigo') codigo: string,
  ) {
    return unwrapResponse(await this.tareasService.removeMiembroEquipo(id, codigo));
  }

  // =================== TABLEROS ===================

  @Get('tableros')
  async findAllTableros(@Query('codigo_colab') codigo_colab?: string) {
    return unwrapResponse(await this.tareasService.findAllTableros(codigo_colab));
  }

  @Post('tableros')
  async createTablero(@Body() dto: CrearTableroDto) {
    return unwrapResponse(await this.tareasService.createTablero(dto));
  }

  @Get('tableros/:id')
  async findOneTablero(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.findOneTablero(id));
  }

  @Put('tableros/:id')
  async updateTablero(@Param('id', ParseIntPipe) id: number, @Body() dto: CrearTableroDto) {
    return unwrapResponse(await this.tareasService.updateTablero(id, dto));
  }

  @Delete('tableros/:id')
  async deleteTablero(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.deleteTablero(id));
  }

  @Get('tableros/:id/kanban')
  async findKanban(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.findKanban(id));
  }

  @Post('tableros/:id/columnas')
  async createColumna(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CrearColumnaDto,
  ) {
    return unwrapResponse(await this.tareasService.createColumna(id, dto));
  }

  @Put('tableros/:id/columnas/reordenar')
  async reordenarColumnas(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReordenarColumnasDto,
  ) {
    return unwrapResponse(await this.tareasService.reordenarColumnas(id, dto));
  }

  @Put('tableros/:id/columnas/:colId')
  async updateColumna(
    @Param('id', ParseIntPipe) id: number,
    @Param('colId', ParseIntPipe) colId: number,
    @Body() dto: CrearColumnaDto,
  ) {
    return unwrapResponse(await this.tareasService.updateColumna(id, colId, dto));
  }

  @Delete('tableros/:id/columnas/:colId')
  async deleteColumna(
    @Param('id', ParseIntPipe) id: number,
    @Param('colId', ParseIntPipe) colId: number,
  ) {
    return unwrapResponse(await this.tareasService.deleteColumna(id, colId));
  }

  @Get('tableros/:id/etiquetas')
  async findEtiquetas(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.findEtiquetas(id));
  }

  @Post('tableros/:id/etiquetas')
  async createEtiqueta(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CrearEtiquetaDto,
  ) {
    return unwrapResponse(await this.tareasService.createEtiqueta(id, dto));
  }

  @Put('tableros/:id/etiquetas/:etId')
  async updateEtiqueta(
    @Param('id', ParseIntPipe) id: number,
    @Param('etId', ParseIntPipe) etId: number,
    @Body() dto: CrearEtiquetaDto,
  ) {
    return unwrapResponse(await this.tareasService.updateEtiqueta(id, etId, dto));
  }

  @Delete('tableros/:id/etiquetas/:etId')
  async deleteEtiqueta(
    @Param('id', ParseIntPipe) id: number,
    @Param('etId', ParseIntPipe) etId: number,
  ) {
    return unwrapResponse(await this.tareasService.deleteEtiqueta(id, etId));
  }

  @Get('tableros/:id/miembros')
  async findMiembros(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.findMiembros(id));
  }

  @Post('tableros/:id/miembros')
  async addMiembro(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AgregarMiembroDto,
  ) {
    return unwrapResponse(await this.tareasService.addMiembro(id, dto));
  }

  @Delete('tableros/:id/miembros/:codigo')
  async removeMiembro(
    @Param('id', ParseIntPipe) id: number,
    @Param('codigo') codigo: string,
  ) {
    return unwrapResponse(await this.tareasService.removeMiembro(id, codigo));
  }

  // =================== TAREAS (base) ===================

  @Get()
  async findAll(
    @Query('tablero_id') tablero_id?: number,
    @Query('asignado') asignado?: string,
    @Query('prioridad') prioridad?: string,
    @Query('buscar') buscar?: string,
    @Query('vencidas') vencidas?: string,
    @Query('columna_id') columna_id?: number,
  ) {
    return unwrapResponse(
      await this.tareasService.findAll({ tablero_id, asignado, prioridad, buscar, vencidas, columna_id }),
    );
  }

  @Post()
  async create(@Body() dto: CrearTareaDto) {
    return unwrapResponse(await this.tareasService.create(dto));
  }

  // =================== TAREAS :id ===================

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.findOne(id));
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return unwrapResponse(await this.tareasService.update(id, dto));
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.delete(id));
  }

  @Put(':id/mover')
  async mover(@Param('id', ParseIntPipe) id: number, @Body() dto: MoverTareaDto) {
    return unwrapResponse(await this.tareasService.mover(id, dto));
  }

  @Put(':id/etiquetas')
  async updateEtiquetas(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarEtiquetasDto,
  ) {
    return unwrapResponse(await this.tareasService.updateEtiquetas(id, dto));
  }

  @Post(':id/asignados')
  async addAsignado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AgregarAsignadoDto,
  ) {
    return unwrapResponse(await this.tareasService.addAsignado(id, dto));
  }

  @Delete(':id/asignados/:codigo')
  async removeAsignado(
    @Param('id', ParseIntPipe) id: number,
    @Param('codigo') codigo: string,
  ) {
    return unwrapResponse(await this.tareasService.removeAsignado(id, codigo));
  }

  @Get(':id/comentarios')
  async findComentarios(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.findComentarios(id));
  }

  @Post(':id/comentarios')
  async addComentario(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CrearComentarioDto,
  ) {
    return unwrapResponse(await this.tareasService.addComentario(id, dto as any));
  }

  @Put(':id/comentarios/:comentarioId')
  async updateComentario(
    @Param('id', ParseIntPipe) id: number,
    @Param('comentarioId', ParseIntPipe) comentarioId: number,
    @Body() dto: CrearComentarioDto,
  ) {
    return unwrapResponse(await this.tareasService.updateComentario(id, comentarioId, dto));
  }

  @Delete(':id/comentarios/:comentarioId')
  async deleteComentario(
    @Param('id', ParseIntPipe) id: number,
    @Param('comentarioId', ParseIntPipe) comentarioId: number,
  ) {
    return unwrapResponse(await this.tareasService.deleteComentario(id, comentarioId));
  }

  @Get(':id/archivos')
  async findArchivos(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.findArchivos(id));
  }

  @Post(':id/archivos')
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: diskStorage({
        destination: './uploads/tareas',
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async addArchivo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return unwrapResponse(await this.tareasService.addArchivo(id, file));
  }

  @Delete(':id/archivos/:archivoId')
  async deleteArchivo(
    @Param('id', ParseIntPipe) id: number,
    @Param('archivoId', ParseIntPipe) archivoId: number,
  ) {
    return unwrapResponse(await this.tareasService.deleteArchivo(id, archivoId));
  }

  @Get(':id/checklists')
  async findChecklists(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.findChecklists(id));
  }

  @Post(':id/checklists')
  async createChecklist(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CrearChecklistDto,
  ) {
    return unwrapResponse(await this.tareasService.createChecklist(id, dto));
  }

  @Delete(':id/checklists/:checklistId')
  async deleteChecklist(
    @Param('id', ParseIntPipe) id: number,
    @Param('checklistId', ParseIntPipe) checklistId: number,
  ) {
    return unwrapResponse(await this.tareasService.deleteChecklist(id, checklistId));
  }

  @Post(':id/checklists/:checklistId/items')
  async addItemChecklist(
    @Param('id', ParseIntPipe) id: number,
    @Param('checklistId', ParseIntPipe) checklistId: number,
    @Body() dto: CrearItemChecklistDto,
  ) {
    return unwrapResponse(await this.tareasService.addItemChecklist(id, checklistId, dto));
  }

  @Put(':id/checklists/:checklistId/items/:itemId/toggle')
  async toggleItemChecklist(
    @Param('id', ParseIntPipe) id: number,
    @Param('checklistId', ParseIntPipe) checklistId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return unwrapResponse(await this.tareasService.toggleItemChecklist(id, checklistId, itemId));
  }

  @Delete(':id/checklists/:checklistId/items/:itemId')
  async deleteItemChecklist(
    @Param('id', ParseIntPipe) id: number,
    @Param('checklistId', ParseIntPipe) checklistId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return unwrapResponse(await this.tareasService.deleteItemChecklist(id, checklistId, itemId));
  }

  @Get(':id/recordatorios')
  async findRecordatorios(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.findRecordatorios(id));
  }

  @Post(':id/recordatorios')
  async createRecordatorio(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CrearRecordatorioDto,
  ) {
    return unwrapResponse(await this.tareasService.createRecordatorio(id, dto));
  }

  @Delete(':id/recordatorios/:recordatorioId')
  async deleteRecordatorio(
    @Param('id', ParseIntPipe) id: number,
    @Param('recordatorioId', ParseIntPipe) recordatorioId: number,
  ) {
    return unwrapResponse(await this.tareasService.deleteRecordatorio(id, recordatorioId));
  }

  @Get(':id/historial')
  async findHistorial(@Param('id', ParseIntPipe) id: number) {
    return unwrapResponse(await this.tareasService.findHistorial(id));
  }

  @Get(':id/auditoria')
  async findAuditoria(
    @Param('id', ParseIntPipe) id: number,
    @Query('limite') limite?: number,
  ) {
    return unwrapResponse(await this.tareasService.findAuditoria(id, limite ? +limite : undefined));
  }
}
