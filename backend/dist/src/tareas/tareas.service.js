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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TareasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs_1 = require("fs");
const path_1 = require("path");
let TareasService = class TareasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAllTableros(codigo_colab) {
        const where = {};
        if (codigo_colab) {
            where.OR = [
                { propietario: codigo_colab },
                { miembros: { some: { codigo: codigo_colab } } },
            ];
        }
        return this.prisma.tablero.findMany({
            where,
            include: {
                _count: { select: { tareas: true, miembros: true } },
                miembros: { include: { usuario: true } },
            },
            orderBy: { fechaCreacion: 'desc' },
        });
    }
    async findOneTablero(id) {
        const tablero = await this.prisma.tablero.findUnique({
            where: { id },
            include: {
                columnas: { orderBy: { posicion: 'asc' } },
                etiquetas: true,
                miembros: { include: { usuario: true } },
                _count: { select: { tareas: true } },
            },
        });
        if (!tablero)
            throw new common_1.NotFoundException(`Tablero ${id} no encontrado`);
        return tablero;
    }
    async createTablero(dto) {
        const { miembros_iniciales, ...data } = dto;
        const tablero = await this.prisma.tablero.create({
            data: {
                ...data,
                miembros: miembros_iniciales?.length
                    ? {
                        create: miembros_iniciales.map((m) => ({
                            codigo: m.codigo,
                            rol: m.rol ?? 'editor',
                        })),
                    }
                    : undefined,
            },
            include: {
                miembros: { include: { usuario: true } },
                etiquetas: true,
                columnas: true,
            },
        });
        return tablero;
    }
    async updateTablero(id, dto) {
        await this.findOneTablero(id);
        const { miembros_iniciales, ...data } = dto;
        return this.prisma.tablero.update({
            where: { id },
            data,
            include: {
                miembros: { include: { usuario: true } },
                etiquetas: true,
                columnas: true,
            },
        });
    }
    async deleteTablero(id) {
        await this.findOneTablero(id);
        return this.prisma.tablero.delete({ where: { id } });
    }
    async findKanban(id) {
        const tablero = await this.prisma.tablero.findUnique({
            where: { id },
            include: {
                columnas: {
                    orderBy: { posicion: 'asc' },
                    include: {
                        tareas: {
                            orderBy: { posicion: 'asc' },
                            include: {
                                asignados: { include: { usuario: true } },
                                etiquetas: { include: { etiqueta: true } },
                                creador: true,
                                _count: { select: { comentarios: true } },
                            },
                        },
                    },
                },
                etiquetas: true,
                miembros: { include: { usuario: true } },
            },
        });
        if (!tablero)
            throw new common_1.NotFoundException(`Tablero ${id} no encontrado`);
        return tablero;
    }
    async createColumna(tableroId, dto) {
        await this.findOneTablero(tableroId);
        return this.prisma.columnaTablero.create({
            data: {
                tableroId,
                nombre: dto.nombre,
                color: dto.color,
                posicion: dto.posicion ?? 0,
            },
        });
    }
    async reordenarColumnas(tableroId, dto) {
        await this.findOneTablero(tableroId);
        const updates = dto.columnas.map((colId, idx) => this.prisma.columnaTablero.update({
            where: { id: colId },
            data: { posicion: idx },
        }));
        return this.prisma.$transaction(updates);
    }
    async updateColumna(tableroId, colId, dto) {
        await this.findOneTablero(tableroId);
        const columna = await this.prisma.columnaTablero.findFirst({
            where: { id: colId, tableroId },
        });
        if (!columna)
            throw new common_1.NotFoundException(`Columna ${colId} no encontrada`);
        return this.prisma.columnaTablero.update({
            where: { id: colId },
            data: dto,
        });
    }
    async deleteColumna(tableroId, colId) {
        await this.findOneTablero(tableroId);
        const columna = await this.prisma.columnaTablero.findFirst({
            where: { id: colId, tableroId },
        });
        if (!columna)
            throw new common_1.NotFoundException(`Columna ${colId} no encontrada`);
        return this.prisma.columnaTablero.delete({ where: { id: colId } });
    }
    async findEtiquetas(tableroId) {
        await this.findOneTablero(tableroId);
        return this.prisma.etiquetaTablero.findMany({ where: { tableroId } });
    }
    async createEtiqueta(tableroId, dto) {
        await this.findOneTablero(tableroId);
        return this.prisma.etiquetaTablero.create({
            data: { tableroId, nombre: dto.nombre, color: dto.color },
        });
    }
    async updateEtiqueta(tableroId, etId, dto) {
        await this.findOneTablero(tableroId);
        const etiqueta = await this.prisma.etiquetaTablero.findFirst({
            where: { id: etId, tableroId },
        });
        if (!etiqueta)
            throw new common_1.NotFoundException(`Etiqueta ${etId} no encontrada`);
        return this.prisma.etiquetaTablero.update({
            where: { id: etId },
            data: dto,
        });
    }
    async deleteEtiqueta(tableroId, etId) {
        await this.findOneTablero(tableroId);
        const etiqueta = await this.prisma.etiquetaTablero.findFirst({
            where: { id: etId, tableroId },
        });
        if (!etiqueta)
            throw new common_1.NotFoundException(`Etiqueta ${etId} no encontrada`);
        return this.prisma.etiquetaTablero.delete({ where: { id: etId } });
    }
    async findMiembros(tableroId) {
        await this.findOneTablero(tableroId);
        return this.prisma.tableroMiembro.findMany({
            where: { tableroId },
            include: { usuario: true },
        });
    }
    async addMiembro(tableroId, dto) {
        await this.findOneTablero(tableroId);
        return this.prisma.tableroMiembro.create({
            data: {
                tableroId,
                codigo: dto.codigo,
                rol: dto.rol ?? 'editor',
            },
            include: { usuario: true },
        });
    }
    async removeMiembro(tableroId, codigo) {
        await this.findOneTablero(tableroId);
        const miembro = await this.prisma.tableroMiembro.findFirst({
            where: { tableroId, codigo },
        });
        if (!miembro)
            throw new common_1.NotFoundException(`Miembro ${codigo} no encontrado`);
        return this.prisma.tableroMiembro.delete({ where: { id: miembro.id } });
    }
    findAll(filters) {
        const where = {};
        if (filters.tablero_id)
            where.tableroId = filters.tablero_id;
        if (filters.prioridad)
            where.prioridad = filters.prioridad;
        if (filters.columna_id)
            where.columnaId = filters.columna_id;
        if (filters.asignado)
            where.asignados = { some: { codigo: filters.asignado } };
        if (filters.buscar) {
            where.OR = [
                { titulo: { contains: filters.buscar } },
                { descripcion: { contains: filters.buscar } },
            ];
        }
        if (filters.vencidas) {
            where.fechaVencimiento = { lt: new Date() };
            where.fechaCompletada = null;
        }
        return this.prisma.tarea.findMany({
            where,
            include: {
                asignados: { include: { usuario: true } },
                etiquetas: { include: { etiqueta: true } },
                creador: true,
                tablero: true,
                columna: true,
                _count: { select: { comentarios: true, archivos: true, checklists: true } },
            },
            orderBy: { posicion: 'asc' },
        });
    }
    async findOne(id) {
        const tarea = await this.prisma.tarea.findUnique({
            where: { id },
            include: {
                asignados: { include: { usuario: true } },
                etiquetas: { include: { etiqueta: true } },
                comentarios: { include: { autor: true }, orderBy: { fecha: 'desc' } },
                checklists: {
                    include: { items: { orderBy: { posicion: 'asc' } } },
                    orderBy: { posicion: 'asc' },
                },
                archivos: { orderBy: { fechaSubida: 'desc' } },
                recordatorios: true,
                historiales: { orderBy: { fecha: 'desc' } },
                auditorias: { orderBy: { createdAt: 'desc' }, take: 50 },
                creador: true,
                tablero: true,
                columna: true,
            },
        });
        if (!tarea)
            throw new common_1.NotFoundException(`Tarea ${id} no encontrada`);
        return tarea;
    }
    async create(dto) {
        const { asignados, etiquetas, ...data } = dto;
        const tarea = await this.prisma.tarea.create({
            data: {
                ...data,
                fechaInicio: data.fechaInicio ? new Date(data.fechaInicio) : undefined,
                fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento) : undefined,
                asignados: asignados?.length
                    ? { create: asignados.map((c) => ({ codigo: c })) }
                    : undefined,
                etiquetas: etiquetas?.length
                    ? { create: etiquetas.map((e) => ({ etiquetaId: e })) }
                    : undefined,
            },
            include: {
                asignados: { include: { usuario: true } },
                etiquetas: { include: { etiqueta: true } },
            },
        });
        if (data.creadoPor) {
            await this.prisma.auditoriaTarea.create({
                data: {
                    tareaId: tarea.id,
                    usuarioCodigo: data.creadoPor,
                    accion: 'CREAR',
                    descripcion: `Tarea "${tarea.titulo}" creada`,
                },
            });
        }
        return tarea;
    }
    async update(id, dto) {
        await this.findOne(id);
        const data = { ...dto };
        if (data.fechaInicio)
            data.fechaInicio = new Date(data.fechaInicio);
        if (data.fechaVencimiento)
            data.fechaVencimiento = new Date(data.fechaVencimiento);
        if (data.fechaCompletada)
            data.fechaCompletada = new Date(data.fechaCompletada);
        return this.prisma.tarea.update({
            where: { id },
            data,
            include: {
                asignados: { include: { usuario: true } },
                etiquetas: { include: { etiqueta: true } },
                creador: true,
                tablero: true,
                columna: true,
            },
        });
    }
    async delete(id) {
        await this.findOne(id);
        return this.prisma.tarea.delete({ where: { id } });
    }
    async mover(id, dto) {
        await this.findOne(id);
        return this.prisma.tarea.update({
            where: { id },
            data: { columnaId: dto.columna_id, posicion: dto.posicion },
            include: {
                columna: true,
                asignados: { include: { usuario: true } },
                etiquetas: { include: { etiqueta: true } },
            },
        });
    }
    async updateEtiquetas(id, dto) {
        await this.findOne(id);
        await this.prisma.tareaEtiqueta.deleteMany({ where: { tareaId: id } });
        if (dto.etiquetas.length > 0) {
            await this.prisma.tareaEtiqueta.createMany({
                data: dto.etiquetas.map((etiquetaId) => ({ tareaId: id, etiquetaId })),
            });
        }
        return this.prisma.tareaEtiqueta.findMany({
            where: { tareaId: id },
            include: { etiqueta: true },
        });
    }
    async addAsignado(id, dto) {
        await this.findOne(id);
        return this.prisma.tareaAsignado.create({
            data: { tareaId: id, codigo: dto.codigo },
            include: { usuario: true },
        });
    }
    async removeAsignado(id, codigo) {
        await this.findOne(id);
        const asig = await this.prisma.tareaAsignado.findFirst({
            where: { tareaId: id, codigo },
        });
        if (!asig)
            throw new common_1.NotFoundException(`Asignado ${codigo} no encontrado`);
        return this.prisma.tareaAsignado.delete({ where: { id: asig.id } });
    }
    async findComentarios(id) {
        await this.findOne(id);
        return this.prisma.tareaComentario.findMany({
            where: { tareaId: id },
            include: { autor: true },
            orderBy: { fecha: 'desc' },
        });
    }
    async addComentario(id, dto) {
        await this.findOne(id);
        return this.prisma.tareaComentario.create({
            data: {
                tareaId: id,
                comentario: dto.comentario,
                autorCodigo: dto.codigo_colab || 'unknown',
            },
            include: { autor: true },
        });
    }
    async updateComentario(id, comentarioId, dto) {
        await this.findOne(id);
        const comentario = await this.prisma.tareaComentario.findFirst({
            where: { id: comentarioId, tareaId: id },
        });
        if (!comentario)
            throw new common_1.NotFoundException(`Comentario ${comentarioId} no encontrado`);
        return this.prisma.tareaComentario.update({
            where: { id: comentarioId },
            data: { comentario: dto.comentario, editado: true },
            include: { autor: true },
        });
    }
    async deleteComentario(id, comentarioId) {
        await this.findOne(id);
        const comentario = await this.prisma.tareaComentario.findFirst({
            where: { id: comentarioId, tareaId: id },
        });
        if (!comentario)
            throw new common_1.NotFoundException(`Comentario ${comentarioId} no encontrado`);
        return this.prisma.tareaComentario.delete({ where: { id: comentarioId } });
    }
    async findArchivos(id) {
        await this.findOne(id);
        return this.prisma.tareaArchivo.findMany({
            where: { tareaId: id },
            orderBy: { fechaSubida: 'desc' },
        });
    }
    async addArchivo(id, file) {
        await this.findOne(id);
        if (!file)
            throw new common_1.BadRequestException('No se recibió ningún archivo');
        return this.prisma.tareaArchivo.create({
            data: {
                tareaId: id,
                nombre: file.filename,
                nombreOriginal: file.originalname,
                url: file.filename,
                tamanio: file.size,
                mime: file.mimetype,
            },
        });
    }
    async deleteArchivo(id, archivoId) {
        await this.findOne(id);
        const archivo = await this.prisma.tareaArchivo.findFirst({
            where: { id: archivoId, tareaId: id },
        });
        if (!archivo)
            throw new common_1.NotFoundException(`Archivo ${archivoId} no encontrado`);
        const filePath = (0, path_1.join)(process.cwd(), 'uploads', 'tareas', archivo.nombre);
        if ((0, fs_1.existsSync)(filePath))
            (0, fs_1.unlinkSync)(filePath);
        return this.prisma.tareaArchivo.delete({ where: { id: archivoId } });
    }
    async findChecklists(id) {
        await this.findOne(id);
        return this.prisma.tareaChecklist.findMany({
            where: { tareaId: id },
            include: { items: { orderBy: { posicion: 'asc' } } },
            orderBy: { posicion: 'asc' },
        });
    }
    async createChecklist(id, dto) {
        await this.findOne(id);
        return this.prisma.tareaChecklist.create({
            data: { tareaId: id, titulo: dto.titulo },
            include: { items: true },
        });
    }
    async deleteChecklist(id, checklistId) {
        await this.findOne(id);
        const cl = await this.prisma.tareaChecklist.findFirst({
            where: { id: checklistId, tareaId: id },
        });
        if (!cl)
            throw new common_1.NotFoundException(`Checklist ${checklistId} no encontrado`);
        return this.prisma.tareaChecklist.delete({ where: { id: checklistId } });
    }
    async addItemChecklist(id, checklistId, dto) {
        await this.findOne(id);
        const cl = await this.prisma.tareaChecklist.findFirst({
            where: { id: checklistId, tareaId: id },
        });
        if (!cl)
            throw new common_1.NotFoundException(`Checklist ${checklistId} no encontrado`);
        return this.prisma.checklistItem.create({
            data: { checklistId, texto: dto.texto },
        });
    }
    async toggleItemChecklist(id, checklistId, itemId) {
        await this.findOne(id);
        const item = await this.prisma.checklistItem.findFirst({
            where: { id: itemId, checklistId },
        });
        if (!item)
            throw new common_1.NotFoundException(`Item ${itemId} no encontrado`);
        return this.prisma.checklistItem.update({
            where: { id: itemId },
            data: { completado: !item.completado },
        });
    }
    async deleteItemChecklist(id, checklistId, itemId) {
        await this.findOne(id);
        const item = await this.prisma.checklistItem.findFirst({
            where: { id: itemId, checklistId },
        });
        if (!item)
            throw new common_1.NotFoundException(`Item ${itemId} no encontrado`);
        return this.prisma.checklistItem.delete({ where: { id: itemId } });
    }
    async findRecordatorios(id) {
        await this.findOne(id);
        return this.prisma.tareaRecordatorio.findMany({
            where: { tareaId: id },
            orderBy: { fecha: 'asc' },
        });
    }
    async createRecordatorio(id, dto) {
        await this.findOne(id);
        return this.prisma.tareaRecordatorio.create({
            data: {
                tareaId: id,
                fecha: new Date(dto.fecha),
                mensaje: dto.mensaje,
            },
        });
    }
    async deleteRecordatorio(id, recordatorioId) {
        await this.findOne(id);
        const rec = await this.prisma.tareaRecordatorio.findFirst({
            where: { id: recordatorioId, tareaId: id },
        });
        if (!rec)
            throw new common_1.NotFoundException(`Recordatorio ${recordatorioId} no encontrado`);
        return this.prisma.tareaRecordatorio.delete({ where: { id: recordatorioId } });
    }
    async findHistorial(id) {
        await this.findOne(id);
        return this.prisma.historialTarea.findMany({
            where: { tareaId: id },
            orderBy: { fecha: 'desc' },
        });
    }
    async findAuditoria(id, limite) {
        await this.findOne(id);
        return this.prisma.auditoriaTarea.findMany({
            where: { tareaId: id },
            orderBy: { createdAt: 'desc' },
            take: limite || 50,
            include: { usuario: true },
        });
    }
    findNotificaciones() {
        return this.prisma.notificacionTarea.findMany({
            orderBy: { fechaCreacion: 'desc' },
            include: { usuario: true },
        });
    }
    async marcarNotificacionLeida(id) {
        const notif = await this.prisma.notificacionTarea.findUnique({ where: { id } });
        if (!notif)
            throw new common_1.NotFoundException(`Notificación ${id} no encontrada`);
        return this.prisma.notificacionTarea.update({
            where: { id },
            data: { leida: true },
        });
    }
    async marcarTodasLeidas() {
        await this.prisma.notificacionTarea.updateMany({
            where: { leida: false },
            data: { leida: true },
        });
        return { message: 'Todas las notificaciones marcadas como leídas' };
    }
    async getDashboard() {
        const total = await this.prisma.tarea.count();
        const completadas = await this.prisma.tarea.count({
            where: { fechaCompletada: { not: null } },
        });
        const pendientes = total - completadas;
        const vencidas = await this.prisma.tarea.count({
            where: {
                fechaVencimiento: { lt: new Date() },
                fechaCompletada: null,
            },
        });
        const porPrioridad = await this.prisma.tarea.groupBy({
            by: ['prioridad'],
            _count: true,
        });
        const totalTableros = await this.prisma.tablero.count();
        const totalEquipos = await this.prisma.equipo.count();
        return { total, completadas, pendientes, vencidas, porPrioridad, totalTableros, totalEquipos };
    }
    findAllEquipos() {
        return this.prisma.equipo.findMany({
            include: {
                _count: { select: { miembros: true } },
                miembros: { include: { usuario: true } },
            },
            orderBy: { fechaCreacion: 'desc' },
        });
    }
    async findOneEquipo(id) {
        const equipo = await this.prisma.equipo.findUnique({
            where: { id },
            include: {
                miembros: { include: { usuario: true } },
                propietarioRel: true,
            },
        });
        if (!equipo)
            throw new common_1.NotFoundException(`Equipo ${id} no encontrado`);
        return equipo;
    }
    async createEquipo(dto) {
        return this.prisma.equipo.create({
            data: {
                nombre: dto.nombre,
                descripcion: dto.descripcion,
                color: dto.color,
                propietario: dto.propietario,
            },
            include: { miembros: { include: { usuario: true } } },
        });
    }
    async updateEquipo(id, dto) {
        await this.findOneEquipo(id);
        return this.prisma.equipo.update({
            where: { id },
            data: dto,
            include: { miembros: { include: { usuario: true } } },
        });
    }
    async deleteEquipo(id) {
        await this.findOneEquipo(id);
        return this.prisma.equipo.delete({ where: { id } });
    }
    async findMiembrosEquipo(id) {
        await this.findOneEquipo(id);
        return this.prisma.equipoMiembro.findMany({
            where: { equipoId: id },
            include: { usuario: true },
        });
    }
    async addMiembroEquipo(id, dto) {
        await this.findOneEquipo(id);
        return this.prisma.equipoMiembro.create({
            data: {
                equipoId: id,
                codigo: dto.codigo,
                rol: dto.rol ?? 'miembro',
            },
            include: { usuario: true },
        });
    }
    async removeMiembroEquipo(id, codigo) {
        await this.findOneEquipo(id);
        const miembro = await this.prisma.equipoMiembro.findFirst({
            where: { equipoId: id, codigo },
        });
        if (!miembro)
            throw new common_1.NotFoundException(`Miembro ${codigo} no encontrado`);
        return this.prisma.equipoMiembro.delete({ where: { id: miembro.id } });
    }
};
exports.TareasService = TareasService;
exports.TareasService = TareasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TareasService);
//# sourceMappingURL=tareas.service.js.map