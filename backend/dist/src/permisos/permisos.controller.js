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
exports.PermisosController = void 0;
const common_1 = require("@nestjs/common");
const permisos_service_1 = require("./permisos.service");
const crear_modulo_dto_1 = require("./dto/crear-modulo.dto");
const actualizar_modulo_dto_1 = require("./dto/actualizar-modulo.dto");
const crear_rol_dto_1 = require("./dto/crear-rol.dto");
const modulo_rol_dto_1 = require("./dto/modulo-rol.dto");
const actualizar_permisos_dto_1 = require("./dto/actualizar-permisos.dto");
const helpers_1 = require("../common/helpers");
let PermisosController = class PermisosController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findModulos(todos) {
        return (0, helpers_1.unwrapResponse)(await this.service.findModulos(todos));
    }
    async createModulo(dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.createModulo(dto));
    }
    async updateModulo(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.updateModulo(id, dto));
    }
    async removeModulo(id) {
        return (0, helpers_1.unwrapResponse)(await this.service.removeModulo(id));
    }
    async findRoles() {
        return (0, helpers_1.unwrapResponse)(await this.service.findRoles());
    }
    async createRol(dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.createRol(dto));
    }
    async findOneRol(id) {
        return (0, helpers_1.unwrapResponse)(await this.service.findOneRol(id));
    }
    async updateRolModulos(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.updateRolModulos(id, dto));
    }
    async removeRol(id) {
        return (0, helpers_1.unwrapResponse)(await this.service.removeRol(id));
    }
    async findMisPermisos(codigo) {
        return (0, helpers_1.unwrapResponse)(await this.service.findMisPermisos(codigo));
    }
    async findPermisosColaborador(codigo) {
        return (0, helpers_1.unwrapResponse)(await this.service.findPermisosColaborador(codigo));
    }
    async updatePermisosColaborador(codigo, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.updatePermisosColaborador(codigo, dto));
    }
    async findAccesosColaborador(codigo) {
        return (0, helpers_1.unwrapResponse)(await this.service.findAccesosColaborador(codigo));
    }
};
exports.PermisosController = PermisosController;
__decorate([
    (0, common_1.Get)('modulos'),
    __param(0, (0, common_1.Query)('todos')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "findModulos", null);
__decorate([
    (0, common_1.Post)('modulos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_modulo_dto_1.CrearModuloDto]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "createModulo", null);
__decorate([
    (0, common_1.Put)('modulos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, actualizar_modulo_dto_1.ActualizarModuloDto]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "updateModulo", null);
__decorate([
    (0, common_1.Delete)('modulos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "removeModulo", null);
__decorate([
    (0, common_1.Get)('roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "findRoles", null);
__decorate([
    (0, common_1.Post)('roles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_rol_dto_1.CrearRolDto]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "createRol", null);
__decorate([
    (0, common_1.Get)('roles/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "findOneRol", null);
__decorate([
    (0, common_1.Put)('roles/:id/modulos'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, modulo_rol_dto_1.ModulosRolDto]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "updateRolModulos", null);
__decorate([
    (0, common_1.Delete)('roles/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "removeRol", null);
__decorate([
    (0, common_1.Get)('permisos/mis-permisos'),
    __param(0, (0, common_1.Query)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "findMisPermisos", null);
__decorate([
    (0, common_1.Get)('colaboradores/:codigo/permisos'),
    __param(0, (0, common_1.Param)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "findPermisosColaborador", null);
__decorate([
    (0, common_1.Put)('colaboradores/:codigo/permisos'),
    __param(0, (0, common_1.Param)('codigo')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, actualizar_permisos_dto_1.ActualizarPermisosDto]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "updatePermisosColaborador", null);
__decorate([
    (0, common_1.Get)('colaboradores/:codigo/accesos'),
    __param(0, (0, common_1.Param)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "findAccesosColaborador", null);
exports.PermisosController = PermisosController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [permisos_service_1.PermisosService])
], PermisosController);
//# sourceMappingURL=permisos.controller.js.map