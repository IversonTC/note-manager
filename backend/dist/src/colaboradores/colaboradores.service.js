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
exports.ColaboradoresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ColaboradoresService = class ColaboradoresService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(dto) {
        const { empresas, estado, pagina = 1, por_pagina = 20, buscar, centro_costo, todos, paginar } = dto;
        const where = {};
        if (empresas)
            where.empresa = { in: empresas.split(',') };
        if (estado !== undefined)
            where.estado = estado;
        if (buscar) {
            where.OR = [
                { nombre: { contains: buscar } },
                { cedula: { contains: buscar } },
                { correo: { contains: buscar } },
            ];
        }
        if (centro_costo)
            where.centroCosto = centro_costo;
        if (todos === '1') {
            const data = await this.prisma.usuario.findMany({
                where,
                select: { codigo: true, nombre: true, cedula: true, empresa: true },
                orderBy: { nombre: 'asc' },
            });
            return { status: 'success', data };
        }
        if (paginar === '0') {
            const data = await this.prisma.usuario.findMany({
                where,
                select: { codigo: true, nombre: true },
                orderBy: { nombre: 'asc' },
            });
            return data;
        }
        const skip = (pagina - 1) * por_pagina;
        const [items, total] = await Promise.all([
            this.prisma.usuario.findMany({
                where,
                skip,
                take: por_pagina,
                orderBy: { nombre: 'asc' },
            }),
            this.prisma.usuario.count({ where }),
        ]);
        return { data: items, last_page: Math.ceil(total / por_pagina), total };
    }
    async findAccesos(codigo) {
        const usuario = await this.prisma.usuario.findUnique({ where: { codigo } });
        if (!usuario)
            throw new common_1.NotFoundException(`Usuario ${codigo} no encontrado`);
        const [accesosModulos, accesosPermisos, accesosHoras] = await Promise.all([
            this.prisma.accesoModulo.findMany({ where: { codigo } }),
            this.prisma.accesoPermisoLaboral.findMany({ where: { codigo } }),
            this.prisma.accesoHoraExtra.findMany({ where: { codigo } }),
        ]);
        return { accesosModulos, accesosPermisos, accesosHoras };
    }
};
exports.ColaboradoresService = ColaboradoresService;
exports.ColaboradoresService = ColaboradoresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ColaboradoresService);
//# sourceMappingURL=colaboradores.service.js.map