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
exports.PermisosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PermisosService = class PermisosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findModulos(todos) {
        return this.prisma.moduloApi.findMany({ orderBy: { nombre: 'asc' } });
    }
    async createModulo(dto) {
        return this.prisma.moduloApi.create({ data: dto });
    }
    async updateModulo(id, dto) {
        const mod = await this.prisma.moduloApi.findUnique({ where: { id } });
        if (!mod)
            throw new common_1.NotFoundException(`Módulo ${id} no encontrado`);
        return this.prisma.moduloApi.update({ where: { id }, data: dto });
    }
    async removeModulo(id) {
        const mod = await this.prisma.moduloApi.findUnique({ where: { id } });
        if (!mod)
            throw new common_1.NotFoundException(`Módulo ${id} no encontrado`);
        return this.prisma.moduloApi.delete({ where: { id } });
    }
    findRoles() {
        return this.prisma.rolApi.findMany({ orderBy: { nombre: 'asc' } });
    }
    async createRol(dto) {
        return this.prisma.rolApi.create({ data: dto });
    }
    async findOneRol(id) {
        const rol = await this.prisma.rolApi.findUnique({
            where: { idRol: id },
            include: { rolesModulos: true },
        });
        if (!rol)
            throw new common_1.NotFoundException(`Rol ${id} no encontrado`);
        return rol;
    }
    async updateRolModulos(id, dto) {
        await this.findOneRol(id);
        await this.prisma.rolModulo.deleteMany({ where: { rolId: id } });
        if (dto.modulos.length > 0) {
            await this.prisma.rolModulo.createMany({
                data: dto.modulos.map((m) => ({
                    rolId: id,
                    modulo: m.modulo,
                    puedeVer: m.puede_ver,
                    puedeCrear: m.puede_crear,
                    puedeEditar: m.puede_editar,
                    puedeEliminar: m.puede_eliminar,
                })),
            });
        }
        return this.findOneRol(id);
    }
    async removeRol(id) {
        const rol = await this.prisma.rolApi.findUnique({ where: { idRol: id } });
        if (!rol)
            throw new common_1.NotFoundException(`Rol ${id} no encontrado`);
        return this.prisma.rolApi.delete({ where: { idRol: id } });
    }
    findMisPermisos(codigo) {
        return this.prisma.permiso.findMany({ where: { codigo } });
    }
    findPermisosColaborador(codigo) {
        return this.prisma.permisoAsignado.findMany({ where: { codigo } });
    }
    async updatePermisosColaborador(codigo, dto) {
        await this.prisma.permisoAsignado.deleteMany({ where: { codigo } });
        return this.prisma.permisoAsignado.findMany({ where: { codigo } });
    }
    async findAccesosColaborador(codigo) {
        const usuario = await this.prisma.usuario.findUnique({ where: { codigo } });
        if (!usuario)
            throw new common_1.NotFoundException(`Usuario ${codigo} no encontrado`);
        return this.prisma.accesoModulo.findMany({ where: { codigo } });
    }
};
exports.PermisosService = PermisosService;
exports.PermisosService = PermisosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PermisosService);
//# sourceMappingURL=permisos.service.js.map