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
exports.DocumentosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs_1 = require("fs");
const path_1 = require("path");
let DocumentosService = class DocumentosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.documento.findMany({
            include: { permisos: true, imagenes: true, creador: true },
            orderBy: { fechaActualizacion: 'desc' },
        });
    }
    async findOne(id) {
        const doc = await this.prisma.documento.findUnique({
            where: { id },
            include: { permisos: true, imagenes: true, creador: true },
        });
        if (!doc)
            throw new common_1.NotFoundException(`Documento ${id} no encontrado`);
        return doc;
    }
    async create(dto) {
        const { personas, ...data } = dto;
        const doc = await this.prisma.documento.create({
            data: {
                ...data,
                permisos: personas?.length
                    ? { create: personas.map((p) => ({ codigoColab: p.codigo_colab, tipo: p.tipo ?? 1 })) }
                    : undefined,
            },
            include: { permisos: true, imagenes: true },
        });
        return doc;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.documento.update({
            where: { id },
            data: dto,
            include: { permisos: true, imagenes: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.documento.delete({ where: { id } });
    }
    findTiposPermiso() {
        return this.prisma.tipoPermisoDocumento.findMany();
    }
    async findPermisos(id) {
        await this.findOne(id);
        return this.prisma.documentoPermiso.findMany({ where: { documentoId: id } });
    }
    async updatePermisos(id, dto) {
        await this.findOne(id);
        await this.prisma.documentoPermiso.deleteMany({ where: { documentoId: id } });
        if (dto.personas.length > 0) {
            await this.prisma.documentoPermiso.createMany({
                data: dto.personas.map((p) => ({
                    documentoId: id,
                    codigoColab: p.codigo_colab,
                    tipo: p.tipo,
                })),
            });
        }
        return this.prisma.documentoPermiso.findMany({ where: { documentoId: id } });
    }
    async subirImagen(id, file) {
        await this.findOne(id);
        if (!file)
            throw new common_1.BadRequestException('No se recibió ningún archivo');
        const url = file.filename;
        await this.prisma.documentoImagen.create({
            data: { documentoId: id, url, nombre: file.originalname },
        });
        return { url };
    }
    async eliminarImagen(id, nombre) {
        await this.findOne(id);
        const img = await this.prisma.documentoImagen.findFirst({
            where: { documentoId: id, nombre },
        });
        if (!img)
            throw new common_1.NotFoundException(`Imagen ${nombre} no encontrada`);
        const filePath = (0, path_1.join)(process.cwd(), 'uploads', 'documentos', img.url);
        if ((0, fs_1.existsSync)(filePath))
            (0, fs_1.unlinkSync)(filePath);
        await this.prisma.documentoImagen.delete({ where: { id: img.id } });
        return { message: 'Imagen eliminada' };
    }
};
exports.DocumentosService = DocumentosService;
exports.DocumentosService = DocumentosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentosService);
//# sourceMappingURL=documentos.service.js.map