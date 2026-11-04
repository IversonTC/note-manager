"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TareasController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const tareas_service_1 = require("./tareas.service");
const crear_tablero_dto_1 = require("./dto/crear-tablero.dto");
const crear_tarea_dto_1 = require("./dto/crear-tarea.dto");
const crear_columna_dto_1 = require("./dto/crear-columna.dto");
const crear_etiqueta_dto_1 = require("./dto/crear-etiqueta.dto");
const crear_comentario_dto_1 = require("./dto/crear-comentario.dto");
const crear_checklist_dto_1 = require("./dto/crear-checklist.dto");
const crear_item_checklist_dto_1 = require("./dto/crear-item-checklist.dto");
const crear_recordatorio_dto_1 = require("./dto/crear-recordatorio.dto");
const crear_equipo_dto_1 = require("./dto/crear-equipo.dto");
const mover_tarea_dto_1 = require("./dto/mover-tarea.dto");
const reordenar_columnas_dto_1 = require("./dto/reordenar-columnas.dto");
const agregar_miembro_dto_1 = require("./dto/agregar-miembro.dto");
const agregar_asignado_dto_1 = require("./dto/agregar-asignado.dto");
const agregar_miembro_equipo_dto_1 = require("./dto/agregar-miembro-equipo.dto");
const actualizar_etiquetas_dto_1 = require("./dto/actualizar-etiquetas.dto");
const helpers_1 = require("../common/helpers");
let TareasController = class TareasController {
    tareasService;
    constructor(tareasService) {
        this.tareasService = tareasService;
    }
    async getDashboard() {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.getDashboard());
    }
    async findNotificaciones() {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findNotificaciones());
    }
    async marcarTodasLeidas() {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.marcarTodasLeidas());
    }
    async marcarNotificacionLeida(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.marcarNotificacionLeida(id));
    }
    async findAllEquipos() {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findAllEquipos());
    }
    async createEquipo(dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.createEquipo(dto));
    }
    async findOneEquipo(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findOneEquipo(id));
    }
    async updateEquipo(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.updateEquipo(id, dto));
    }
    async deleteEquipo(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.deleteEquipo(id));
    }
    async findMiembrosEquipo(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findMiembrosEquipo(id));
    }
    async addMiembroEquipo(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.addMiembroEquipo(id, dto));
    }
    async removeMiembroEquipo(id, codigo) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.removeMiembroEquipo(id, codigo));
    }
    async findAllTableros(codigo_colab) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findAllTableros(codigo_colab));
    }
    async createTablero(dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.createTablero(dto));
    }
    async findOneTablero(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findOneTablero(id));
    }
    async updateTablero(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.updateTablero(id, dto));
    }
    async deleteTablero(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.deleteTablero(id));
    }
    async findKanban(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findKanban(id));
    }
    async createColumna(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.createColumna(id, dto));
    }
    async reordenarColumnas(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.reordenarColumnas(id, dto));
    }
    async updateColumna(id, colId, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.updateColumna(id, colId, dto));
    }
    async deleteColumna(id, colId) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.deleteColumna(id, colId));
    }
    async findEtiquetas(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findEtiquetas(id));
    }
    async createEtiqueta(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.createEtiqueta(id, dto));
    }
    async updateEtiqueta(id, etId, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.updateEtiqueta(id, etId, dto));
    }
    async deleteEtiqueta(id, etId) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.deleteEtiqueta(id, etId));
    }
    async findMiembros(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findMiembros(id));
    }
    async addMiembro(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.addMiembro(id, dto));
    }
    async removeMiembro(id, codigo) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.removeMiembro(id, codigo));
    }
    async findAll(tablero_id, asignado, prioridad, buscar, vencidas, columna_id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findAll({ tablero_id, asignado, prioridad, buscar, vencidas, columna_id }));
    }
    async create(dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.create(dto));
    }
    async findOne(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findOne(id));
    }
    async update(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.update(id, dto));
    }
    async delete(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.delete(id));
    }
    async mover(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.mover(id, dto));
    }
    async updateEtiquetas(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.updateEtiquetas(id, dto));
    }
    async addAsignado(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.addAsignado(id, dto));
    }
    async removeAsignado(id, codigo) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.removeAsignado(id, codigo));
    }
    async findComentarios(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findComentarios(id));
    }
    async addComentario(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.addComentario(id, dto));
    }
    async updateComentario(id, comentarioId, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.updateComentario(id, comentarioId, dto));
    }
    async deleteComentario(id, comentarioId) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.deleteComentario(id, comentarioId));
    }
    async findArchivos(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findArchivos(id));
    }
    async addArchivo(id, file) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.addArchivo(id, file));
    }
    async deleteArchivo(id, archivoId) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.deleteArchivo(id, archivoId));
    }
    async findChecklists(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findChecklists(id));
    }
    async createChecklist(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.createChecklist(id, dto));
    }
    async deleteChecklist(id, checklistId) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.deleteChecklist(id, checklistId));
    }
    async addItemChecklist(id, checklistId, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.addItemChecklist(id, checklistId, dto));
    }
    async toggleItemChecklist(id, checklistId, itemId) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.toggleItemChecklist(id, checklistId, itemId));
    }
    async deleteItemChecklist(id, checklistId, itemId) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.deleteItemChecklist(id, checklistId, itemId));
    }
    async findRecordatorios(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findRecordatorios(id));
    }
    async createRecordatorio(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.createRecordatorio(id, dto));
    }
    async deleteRecordatorio(id, recordatorioId) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.deleteRecordatorio(id, recordatorioId));
    }
    async findHistorial(id) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findHistorial(id));
    }
    async findAuditoria(id, limite) {
        return (0, helpers_1.unwrapResponse)(await this.tareasService.findAuditoria(id, limite ? +limite : undefined));
    }
};
exports.TareasController = TareasController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('notificaciones'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findNotificaciones", null);
__decorate([
    (0, common_1.Put)('notificaciones/leer-todas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "marcarTodasLeidas", null);
__decorate([
    (0, common_1.Put)('notificaciones/:id/leida'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "marcarNotificacionLeida", null);
__decorate([
    (0, common_1.Get)('equipos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findAllEquipos", null);
__decorate([
    (0, common_1.Post)('equipos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_equipo_dto_1.CrearEquipoDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "createEquipo", null);
__decorate([
    (0, common_1.Get)('equipos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findOneEquipo", null);
__decorate([
    (0, common_1.Put)('equipos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, crear_equipo_dto_1.CrearEquipoDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "updateEquipo", null);
__decorate([
    (0, common_1.Delete)('equipos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "deleteEquipo", null);
__decorate([
    (0, common_1.Get)('equipos/:id/miembros'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findMiembrosEquipo", null);
__decorate([
    (0, common_1.Post)('equipos/:id/miembros'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, agregar_miembro_equipo_dto_1.AgregarMiembroEquipoDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "addMiembroEquipo", null);
__decorate([
    (0, common_1.Delete)('equipos/:id/miembros/:codigo'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "removeMiembroEquipo", null);
__decorate([
    (0, common_1.Get)('tableros'),
    __param(0, (0, common_1.Query)('codigo_colab')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findAllTableros", null);
__decorate([
    (0, common_1.Post)('tableros'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_tablero_dto_1.CrearTableroDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "createTablero", null);
__decorate([
    (0, common_1.Get)('tableros/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findOneTablero", null);
__decorate([
    (0, common_1.Put)('tableros/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, crear_tablero_dto_1.CrearTableroDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "updateTablero", null);
__decorate([
    (0, common_1.Delete)('tableros/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "deleteTablero", null);
__decorate([
    (0, common_1.Get)('tableros/:id/kanban'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findKanban", null);
__decorate([
    (0, common_1.Post)('tableros/:id/columnas'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, crear_columna_dto_1.CrearColumnaDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "createColumna", null);
__decorate([
    (0, common_1.Put)('tableros/:id/columnas/reordenar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, reordenar_columnas_dto_1.ReordenarColumnasDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "reordenarColumnas", null);
__decorate([
    (0, common_1.Put)('tableros/:id/columnas/:colId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('colId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, crear_columna_dto_1.CrearColumnaDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "updateColumna", null);
__decorate([
    (0, common_1.Delete)('tableros/:id/columnas/:colId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('colId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "deleteColumna", null);
__decorate([
    (0, common_1.Get)('tableros/:id/etiquetas'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findEtiquetas", null);
__decorate([
    (0, common_1.Post)('tableros/:id/etiquetas'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, crear_etiqueta_dto_1.CrearEtiquetaDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "createEtiqueta", null);
__decorate([
    (0, common_1.Put)('tableros/:id/etiquetas/:etId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('etId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, crear_etiqueta_dto_1.CrearEtiquetaDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "updateEtiqueta", null);
__decorate([
    (0, common_1.Delete)('tableros/:id/etiquetas/:etId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('etId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "deleteEtiqueta", null);
__decorate([
    (0, common_1.Get)('tableros/:id/miembros'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findMiembros", null);
__decorate([
    (0, common_1.Post)('tableros/:id/miembros'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, agregar_miembro_dto_1.AgregarMiembroDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "addMiembro", null);
__decorate([
    (0, common_1.Delete)('tableros/:id/miembros/:codigo'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "removeMiembro", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('tablero_id')),
    __param(1, (0, common_1.Query)('asignado')),
    __param(2, (0, common_1.Query)('prioridad')),
    __param(3, (0, common_1.Query)('buscar')),
    __param(4, (0, common_1.Query)('vencidas')),
    __param(5, (0, common_1.Query)('columna_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_tarea_dto_1.CrearTareaDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(':id/mover'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, mover_tarea_dto_1.MoverTareaDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "mover", null);
__decorate([
    (0, common_1.Put)(':id/etiquetas'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, actualizar_etiquetas_dto_1.ActualizarEtiquetasDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "updateEtiquetas", null);
__decorate([
    (0, common_1.Post)(':id/asignados'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, agregar_asignado_dto_1.AgregarAsignadoDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "addAsignado", null);
__decorate([
    (0, common_1.Delete)(':id/asignados/:codigo'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "removeAsignado", null);
__decorate([
    (0, common_1.Get)(':id/comentarios'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findComentarios", null);
__decorate([
    (0, common_1.Post)(':id/comentarios'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, crear_comentario_dto_1.CrearComentarioDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "addComentario", null);
__decorate([
    (0, common_1.Put)(':id/comentarios/:comentarioId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('comentarioId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, crear_comentario_dto_1.CrearComentarioDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "updateComentario", null);
__decorate([
    (0, common_1.Delete)(':id/comentarios/:comentarioId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('comentarioId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "deleteComentario", null);
__decorate([
    (0, common_1.Get)(':id/archivos'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findArchivos", null);
__decorate([
    (0, common_1.Post)(':id/archivos'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('archivo', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/tareas',
            filename: (_req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
    })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "addArchivo", null);
__decorate([
    (0, common_1.Delete)(':id/archivos/:archivoId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('archivoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "deleteArchivo", null);
__decorate([
    (0, common_1.Get)(':id/checklists'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findChecklists", null);
__decorate([
    (0, common_1.Post)(':id/checklists'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, crear_checklist_dto_1.CrearChecklistDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "createChecklist", null);
__decorate([
    (0, common_1.Delete)(':id/checklists/:checklistId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('checklistId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "deleteChecklist", null);
__decorate([
    (0, common_1.Post)(':id/checklists/:checklistId/items'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('checklistId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, crear_item_checklist_dto_1.CrearItemChecklistDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "addItemChecklist", null);
__decorate([
    (0, common_1.Put)(':id/checklists/:checklistId/items/:itemId/toggle'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('checklistId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "toggleItemChecklist", null);
__decorate([
    (0, common_1.Delete)(':id/checklists/:checklistId/items/:itemId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('checklistId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "deleteItemChecklist", null);
__decorate([
    (0, common_1.Get)(':id/recordatorios'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findRecordatorios", null);
__decorate([
    (0, common_1.Post)(':id/recordatorios'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, crear_recordatorio_dto_1.CrearRecordatorioDto]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "createRecordatorio", null);
__decorate([
    (0, common_1.Delete)(':id/recordatorios/:recordatorioId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('recordatorioId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "deleteRecordatorio", null);
__decorate([
    (0, common_1.Get)(':id/historial'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findHistorial", null);
__decorate([
    (0, common_1.Get)(':id/auditoria'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limite')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TareasController.prototype, "findAuditoria", null);
exports.TareasController = TareasController = __decorate([
    (0, common_1.Controller)('tareas'),
    __metadata("design:paramtypes", [tareas_service_1.TareasService])
], TareasController);
//# sourceMappingURL=tareas.controller.js.map