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
exports.RecordatoriosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RecordatoriosService = class RecordatoriosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(estado, tipo, alcance) {
        const where = {};
        if (estado)
            where.estado = estado;
        if (tipo)
            where.tipo = tipo;
        if (alcance)
            where.alcance = alcance;
        return this.prisma.recordatorio.findMany({
            where,
            include: { destinatarios: true },
            orderBy: { fechaCreacion: 'desc' },
        });
    }
    async findOne(id) {
        const rec = await this.prisma.recordatorio.findUnique({
            where: { id },
            include: { destinatarios: true },
        });
        if (!rec)
            throw new common_1.NotFoundException(`Recordatorio ${id} no encontrado`);
        return rec;
    }
    async create(dto) {
        const { destinatarios, fecha_unica, fecha_inicio, fecha_fin, dias_semana, dia_mes, intervalo_dias, sin_fecha_fin, ...rest } = dto;
        return this.prisma.recordatorio.create({
            data: {
                titulo: rest.titulo,
                descripcion: rest.descripcion,
                tipo: rest.tipo ?? 'temporal',
                alcance: rest.alcance ?? 'personal',
                hora: rest.hora,
                frecuencia: rest.frecuencia,
                creadoPor: '',
                creadoPorNombre: '',
                diasSemana: dias_semana,
                diaMes: dia_mes,
                intervalodias: intervalo_dias,
                sinFechaFin: sin_fecha_fin ?? true,
                fechaUnica: fecha_unica ? new Date(fecha_unica) : undefined,
                fechaInicio: fecha_inicio ? new Date(fecha_inicio) : undefined,
                fechaFin: fecha_fin ? new Date(fecha_fin) : undefined,
                destinatarios: destinatarios?.length
                    ? { create: destinatarios }
                    : undefined,
            },
            include: { destinatarios: true },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        const { destinatarios, fecha_unica, fecha_inicio, fecha_fin, dias_semana, dia_mes, intervalo_dias, sin_fecha_fin, ...rest } = dto;
        const data = {};
        if (rest.titulo !== undefined)
            data.titulo = rest.titulo;
        if (rest.descripcion !== undefined)
            data.descripcion = rest.descripcion;
        if (rest.tipo !== undefined)
            data.tipo = rest.tipo;
        if (rest.alcance !== undefined)
            data.alcance = rest.alcance;
        if (rest.hora !== undefined)
            data.hora = rest.hora;
        if (rest.frecuencia !== undefined)
            data.frecuencia = rest.frecuencia;
        if (dias_semana !== undefined)
            data.diasSemana = dias_semana;
        if (dia_mes !== undefined)
            data.diaMes = dia_mes;
        if (intervalo_dias !== undefined)
            data.intervalodias = intervalo_dias;
        if (sin_fecha_fin !== undefined)
            data.sinFechaFin = sin_fecha_fin;
        if (fecha_unica !== undefined)
            data.fechaUnica = new Date(fecha_unica);
        if (fecha_inicio !== undefined)
            data.fechaInicio = new Date(fecha_inicio);
        if (fecha_fin !== undefined)
            data.fechaFin = new Date(fecha_fin);
        return this.prisma.recordatorio.update({
            where: { id },
            data,
            include: { destinatarios: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.recordatorio.delete({ where: { id } });
    }
    async completar(id) {
        await this.findOne(id);
        return this.prisma.recordatorio.update({
            where: { id },
            data: { estado: 'completado' },
        });
    }
    async reactivar(id) {
        await this.findOne(id);
        return this.prisma.recordatorio.update({
            where: { id },
            data: { estado: 'pendiente' },
        });
    }
    findProximos(limite = 10) {
        return this.prisma.recordatorio.findMany({
            where: { estado: 'pendiente' },
            orderBy: { proximaEjecucion: 'asc' },
            take: limite,
            include: { destinatarios: true },
        });
    }
    findNotificaciones() {
        return this.prisma.notificacionRecordatorio.findMany({
            orderBy: { fechaEjecucion: 'desc' },
        });
    }
    async marcarNotificacionLeida(id) {
        const notif = await this.prisma.notificacionRecordatorio.findUnique({ where: { id } });
        if (!notif)
            throw new common_1.NotFoundException(`Notificación ${id} no encontrada`);
        return this.prisma.notificacionRecordatorio.update({
            where: { id },
            data: { leida: true },
        });
    }
};
exports.RecordatoriosService = RecordatoriosService;
exports.RecordatoriosService = RecordatoriosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RecordatoriosService);
//# sourceMappingURL=recordatorios.service.js.map