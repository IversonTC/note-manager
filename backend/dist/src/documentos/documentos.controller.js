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
exports.DocumentosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const documentos_service_1 = require("./documentos.service");
const crear_documento_dto_1 = require("./dto/crear-documento.dto");
const actualizar_documento_dto_1 = require("./dto/actualizar-documento.dto");
const update_permisos_dto_1 = require("./dto/update-permisos.dto");
const helpers_1 = require("../common/helpers");
let DocumentosController = class DocumentosController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findAll() {
        return (0, helpers_1.unwrapResponse)(await this.service.findAll());
    }
    async findTiposPermiso() {
        return (0, helpers_1.unwrapResponse)(await this.service.findTiposPermiso());
    }
    async findOne(id) {
        return (0, helpers_1.unwrapResponse)(await this.service.findOne(id));
    }
    async create(dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.create(dto));
    }
    async update(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.update(id, dto));
    }
    async remove(id) {
        return (0, helpers_1.unwrapResponse)(await this.service.remove(id));
    }
    async findPermisos(id) {
        return (0, helpers_1.unwrapResponse)(await this.service.findPermisos(id));
    }
    async updatePermisos(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.updatePermisos(id, dto));
    }
    async subirImagen(id, file) {
        return (0, helpers_1.unwrapResponse)(await this.service.subirImagen(id, file));
    }
    async eliminarImagen(id, nombre) {
        return (0, helpers_1.unwrapResponse)(await this.service.eliminarImagen(id, nombre));
    }
};
exports.DocumentosController = DocumentosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tipos-permiso'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "findTiposPermiso", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_documento_dto_1.CrearDocumentoDto]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, actualizar_documento_dto_1.ActualizarDocumentoDto]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/permisos'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "findPermisos", null);
__decorate([
    (0, common_1.Put)(':id/permisos'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_permisos_dto_1.UpdatePermisosDto]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "updatePermisos", null);
__decorate([
    (0, common_1.Post)(':id/imagenes'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen')),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "subirImagen", null);
__decorate([
    (0, common_1.Delete)(':id/imagenes/:nombre'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('nombre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "eliminarImagen", null);
exports.DocumentosController = DocumentosController = __decorate([
    (0, common_1.Controller)('documentos'),
    __metadata("design:paramtypes", [documentos_service_1.DocumentosService])
], DocumentosController);
//# sourceMappingURL=documentos.controller.js.map