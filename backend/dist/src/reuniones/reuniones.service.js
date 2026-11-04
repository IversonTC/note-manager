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
exports.ReunionesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReunionesService = class ReunionesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findMisReuniones(codigo) {
        const where = {};
        if (codigo) {
            where.convocados = { some: { codigoColab: codigo } };
        }
        return this.prisma.reunion.findMany({
            where,
            include: { asistencias: true, convocados: true },
            orderBy: { fecha: 'desc' },
        });
    }
    findActivas() {
        return this.prisma.reunion.findMany({
            where: { estado: 1 },
            include: { asistencias: true, convocados: true },
            orderBy: { fecha: 'desc' },
        });
    }
    async findOne(codigo) {
        const reunion = await this.prisma.reunion.findUnique({
            where: { codigo },
            include: { asistencias: true, convocados: true },
        });
        if (!reunion)
            throw new common_1.NotFoundException(`Reunión ${codigo} no encontrada`);
        return reunion;
    }
    async create(dto) {
        const { hora_inicio, hora_fin, tipo_evento, tipo_reunion, ...rest } = dto;
        return this.prisma.reunion.create({
            data: {
                ...rest,
                horaInicio: hora_inicio,
                horaFin: hora_fin,
                tipoEvento: tipo_evento,
                tipoReunion: tipo_reunion,
                fecha: new Date(rest.fecha),
            },
            include: { asistencias: true, convocados: true },
        });
    }
    async update(codigo, dto) {
        await this.findOne(codigo);
        const { hora_inicio, hora_fin, tipo_evento, tipo_reunion, ...rest } = dto;
        return this.prisma.reunion.update({
            where: { codigo },
            data: {
                ...rest,
                horaInicio: hora_inicio,
                horaFin: hora_fin,
                tipoEvento: tipo_evento,
                tipoReunion: tipo_reunion,
                fecha: rest.fecha ? new Date(rest.fecha) : undefined,
            },
            include: { asistencias: true, convocados: true },
        });
    }
    async registrarAsistencia(codigo, dto) {
        await this.findOne(codigo);
        return this.prisma.asistenciaReunion.create({
            data: {
                codigoReunion: codigo,
                codigoColab: '',
                colaboradorNombre: '',
                colaboradorCedula: '',
                horaRegistro: new Date().toTimeString().slice(0, 8),
                confirmacion: dto.confirmacion,
                observacion: dto.observacion,
            },
        });
    }
    async findAsistencia(codigo) {
        await this.findOne(codigo);
        return this.prisma.asistenciaReunion.findMany({
            where: { codigoReunion: codigo },
        });
    }
    async agregarConvocados(codigo, dto) {
        await this.findOne(codigo);
        const usuarios = await this.prisma.usuario.findMany({
            where: { codigo: { in: dto.convocados } },
        });
        const data = usuarios.map((u) => ({
            codigoReunion: codigo,
            codigoColab: u.codigo,
            nombre: u.nombre,
        }));
        await this.prisma.reunionConvocado.createMany({ data, skipDuplicates: true });
        return this.prisma.reunionConvocado.findMany({ where: { codigoReunion: codigo } });
    }
    findTiposReunion() {
        return this.prisma.tipoReunion.findMany({ orderBy: { nombre: 'asc' } });
    }
    findLugares(empresa) {
        const where = {};
        if (empresa)
            where.empresa = empresa;
        return this.prisma.lugarReunion.findMany({ where, orderBy: { nombre: 'asc' } });
    }
    findProcesos() {
        return this.prisma.procesoReunion.findMany({ orderBy: { nombre: 'asc' } });
    }
};
exports.ReunionesService = ReunionesService;
exports.ReunionesService = ReunionesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReunionesService);
//# sourceMappingURL=reuniones.service.js.map