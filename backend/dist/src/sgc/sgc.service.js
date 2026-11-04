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
exports.SgcService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SgcService = class SgcService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findFormatos() {
        return this.prisma.formatoSgc.findMany({ orderBy: { nombre: 'asc' } });
    }
    findTiposAccion() {
        return this.prisma.accionSgc.groupBy({ by: ['tipoAccion', 'nomTipo'] });
    }
    findOrigenesAccion() {
        return this.prisma.accionSgc.groupBy({ by: ['origen', 'nomOrigen'] });
    }
    findEncabezado(empresa, formato) {
        return this.prisma.encabezadoSgc.findUnique({
            where: { formato_empresa: { formato, empresa } },
        });
    }
    findEncabezados(empresa) {
        return this.prisma.encabezadoSgc.findMany({ where: { empresa } });
    }
    async upsertEncabezado(dto) {
        const data = {
            formato: dto.formato,
            empresa: dto.empresa,
            sgcTitulo1: dto.sgc_titulo1,
            sgcTitulo2: dto.sgc_titulo2,
            sgcTitulo3: dto.sgc_titulo3,
            sgcCodigo: dto.sgc_codigo,
            sgcVersion: dto.sgc_version,
            sgcFecha: dto.sgc_fecha,
            icono: dto.icono,
            nomEmpresa: dto.nom_empresa,
        };
        return this.prisma.encabezadoSgc.upsert({
            where: { formato_empresa: { formato: dto.formato, empresa: dto.empresa } },
            update: data,
            create: data,
        });
    }
    findAcciones(empresa, tipo_accion, origen, buscar, pagina = 1, por_pagina = 20) {
        const where = {};
        if (empresa)
            where.empresa = empresa;
        if (tipo_accion)
            where.tipoAccion = tipo_accion;
        if (origen)
            where.origen = origen;
        if (buscar)
            where.descripcion = { contains: buscar };
        return this.prisma.accionSgc.findMany({
            where,
            include: { actividades: true, seguimientos: true },
            skip: (pagina - 1) * por_pagina,
            take: por_pagina,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOneAccion(consecutivo) {
        const accion = await this.prisma.accionSgc.findUnique({
            where: { consecutivo },
            include: { actividades: true, seguimientos: true },
        });
        if (!accion)
            throw new common_1.NotFoundException(`Acción ${consecutivo} no encontrada`);
        return accion;
    }
    async createAccion(dto) {
        const { tipo_accion, nom_tipo, nom_origen, fecha_deteccion, nom_registrado_por, ...rest } = dto;
        return this.prisma.accionSgc.create({
            data: {
                ...rest,
                tipoAccion: tipo_accion,
                nomTipo: nom_tipo,
                nomOrigen: nom_origen,
                fechaDeteccion: new Date(fecha_deteccion),
                nomRegistradoPor: nom_registrado_por,
            },
            include: { actividades: true, seguimientos: true },
        });
    }
    async updateAccion(consecutivo, dto) {
        await this.findOneAccion(consecutivo);
        const { tipo_accion, nom_tipo, nom_origen, fecha_deteccion, nom_registrado_por, ...rest } = dto;
        return this.prisma.accionSgc.update({
            where: { consecutivo },
            data: {
                ...rest,
                tipoAccion: tipo_accion,
                nomTipo: nom_tipo,
                nomOrigen: nom_origen,
                fechaDeteccion: fecha_deteccion ? new Date(fecha_deteccion) : undefined,
                nomRegistradoPor: nom_registrado_por,
            },
            include: { actividades: true, seguimientos: true },
        });
    }
    async findActividades(consecutivo) {
        await this.findOneAccion(consecutivo);
        return this.prisma.actividadSgc.findMany({
            where: { accionConsecutivo: consecutivo },
        });
    }
    async updateActividades(consecutivo, dto) {
        await this.findOneAccion(consecutivo);
        await this.prisma.actividadSgc.deleteMany({ where: { accionConsecutivo: consecutivo } });
        if (dto.actividades.length > 0) {
            await this.prisma.actividadSgc.createMany({
                data: dto.actividades.map((a) => ({
                    accionConsecutivo: consecutivo,
                    actividad: a.actividad,
                    responsable: a.responsable,
                    nomResponsable: a.nom_responsable,
                    fechaImplementacion: new Date(a.fecha_implementacion),
                })),
            });
        }
        return this.findActividades(consecutivo);
    }
    async findSeguimientos(consecutivo) {
        await this.findOneAccion(consecutivo);
        return this.prisma.seguimientoSgc.findMany({
            where: { accionConsecutivo: consecutivo },
        });
    }
    async createSeguimiento(consecutivo, dto) {
        await this.findOneAccion(consecutivo);
        return this.prisma.seguimientoSgc.create({
            data: {
                accionConsecutivo: consecutivo,
                actividad: dto.actividad,
                nomResponsable: dto.nom_responsable ?? '',
                fechaSeguimiento: new Date(dto.fecha_seguimiento),
            },
        });
    }
    findPlanMejoras(cerrado, colaborador, pagina = 1, por_pagina = 20) {
        const where = {};
        if (cerrado !== undefined)
            where.cerrado = cerrado;
        return this.prisma.planMejora.findMany({
            where,
            skip: (pagina - 1) * por_pagina,
            take: por_pagina,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOnePlanMejora(id) {
        const plan = await this.prisma.planMejora.findUnique({
            where: { id },
            include: { seguimientos: true },
        });
        if (!plan)
            throw new common_1.NotFoundException(`Plan de mejora ${id} no encontrado`);
        return plan;
    }
    async createPlanMejora(dto) {
        const { opt_nombre_propuesta, opt_descripcion, opt_importancia, opt_posible_mejora, opt_fecha_seguimiento, opt_pasos, opt_conclusion, nom_aliado, valor_hora, ...rest } = dto;
        return this.prisma.planMejora.create({
            data: {
                ...rest,
                optNombrePropuesta: opt_nombre_propuesta,
                optDescripcion: opt_descripcion,
                optImportancia: opt_importancia,
                optPosibleMejora: opt_posible_mejora,
                optFechaSeguimiento: opt_fecha_seguimiento ? new Date(opt_fecha_seguimiento) : undefined,
                optPasos: opt_pasos,
                optConclusion: opt_conclusion,
                nomAliado: nom_aliado,
                valorHora: valor_hora,
            },
            include: { seguimientos: true },
        });
    }
    async cerrarPlanMejora(id) {
        await this.findOnePlanMejora(id);
        return this.prisma.planMejora.update({
            where: { id },
            data: { cerrado: 1 },
        });
    }
    async findSeguimientosPlan(id) {
        await this.findOnePlanMejora(id);
        return this.prisma.seguimientoPlan.findMany({ where: { planId: id } });
    }
    async createSeguimientoPlan(id, dto) {
        await this.findOnePlanMejora(id);
        return this.prisma.seguimientoPlan.create({
            data: {
                planId: id,
                seguimiento: dto.actividad,
                nomResponsable: dto.nom_responsable ?? '',
                fechaSeguimiento: new Date(dto.fecha_seguimiento),
            },
        });
    }
};
exports.SgcService = SgcService;
exports.SgcService = SgcService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SgcService);
//# sourceMappingURL=sgc.service.js.map