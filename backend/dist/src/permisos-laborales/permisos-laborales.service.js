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
exports.PermisosLaboralesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PermisosLaboralesService = class PermisosLaboralesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findTipos() {
        return this.prisma.tipoPermisoLaboral.findMany({ orderBy: { nombre: 'asc' } });
    }
    async create(dto) {
        return this.prisma.permisoLaboral.create({
            data: {
                codigoColab: dto.codigo_colab,
                colaboradorNombre: dto.colaborador_nombre,
                fechaSalida: new Date(dto.fecha_salida),
                fechaFinal: new Date(dto.fecha_final),
                tipoPermiso: dto.tipo_permiso,
                tipoNombre: dto.tipo_nombre,
                duracion: dto.duracion,
                compensado: dto.compensado ?? 'N',
                remunerado: dto.remunerado ?? 'N',
                observacion: dto.observacion,
                remitirAutoriza: dto.remitir_autoriza,
                empresa: dto.empresa,
            },
        });
    }
    findPendientesFirmar() {
        return this.prisma.permisoLaboral.findMany({
            where: { firmaSolicita: null },
            orderBy: { createdAt: 'desc' },
        });
    }
    findPendientesAutorizar() {
        return this.prisma.permisoLaboral.findMany({
            where: { firmaAutoriza: null, firmaSolicita: { not: null } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async firmar(consecutivo, dto) {
        const permiso = await this.prisma.permisoLaboral.findUnique({ where: { consecutivo } });
        if (!permiso)
            throw new common_1.NotFoundException(`Permiso ${consecutivo} no encontrado`);
        if (dto.firma === 'solicitante') {
            return this.prisma.permisoLaboral.update({
                where: { consecutivo },
                data: { firmaSolicita: new Date().toISOString() },
            });
        }
        return this.prisma.permisoLaboral.update({
            where: { consecutivo },
            data: { firmaAutoriza: new Date().toISOString() },
        });
    }
    findHistorial(empresa, fecha_inicio, fecha_fin) {
        const where = {};
        if (empresa)
            where.empresa = empresa;
        if (fecha_inicio || fecha_fin) {
            where.fechaSalida = {};
            if (fecha_inicio)
                where.fechaSalida.gte = new Date(fecha_inicio);
            if (fecha_fin)
                where.fechaSalida.lte = new Date(fecha_fin);
        }
        return this.prisma.permisoLaboral.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async generarPdf(consecutivo) {
        const permiso = await this.prisma.permisoLaboral.findUnique({ where: { consecutivo } });
        if (!permiso)
            throw new common_1.NotFoundException(`Permiso ${consecutivo} no encontrado`);
        return { url: `/api/permisos-laborales/${consecutivo}/pdf` };
    }
};
exports.PermisosLaboralesService = PermisosLaboralesService;
exports.PermisosLaboralesService = PermisosLaboralesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PermisosLaboralesService);
//# sourceMappingURL=permisos-laborales.service.js.map