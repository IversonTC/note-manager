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
exports.PermisosLaboralesController = void 0;
const common_1 = require("@nestjs/common");
const permisos_laborales_service_1 = require("./permisos-laborales.service");
const crear_permiso_laboral_dto_1 = require("./dto/crear-permiso-laboral.dto");
const firmar_permiso_dto_1 = require("./dto/firmar-permiso.dto");
const helpers_1 = require("../common/helpers");
let PermisosLaboralesController = class PermisosLaboralesController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findTipos() {
        return (0, helpers_1.unwrapResponse)(await this.service.findTipos());
    }
    async create(dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.create(dto));
    }
    async findPendientesFirmar() {
        return (0, helpers_1.unwrapResponse)(await this.service.findPendientesFirmar());
    }
    async findPendientesAutorizar() {
        return (0, helpers_1.unwrapResponse)(await this.service.findPendientesAutorizar());
    }
    async firmar(consecutivo, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.firmar(consecutivo, dto));
    }
    async findHistorial(empresa, fecha_inicio, fecha_fin) {
        return (0, helpers_1.unwrapResponse)(await this.service.findHistorial(empresa, fecha_inicio, fecha_fin));
    }
    async generarPdf(consecutivo) {
        return (0, helpers_1.unwrapResponse)(await this.service.generarPdf(consecutivo));
    }
};
exports.PermisosLaboralesController = PermisosLaboralesController;
__decorate([
    (0, common_1.Get)('tipos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermisosLaboralesController.prototype, "findTipos", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_permiso_laboral_dto_1.CrearPermisoLaboralDto]),
    __metadata("design:returntype", Promise)
], PermisosLaboralesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('pendientes/firmar-solicitud'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermisosLaboralesController.prototype, "findPendientesFirmar", null);
__decorate([
    (0, common_1.Get)('pendientes/autorizar'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermisosLaboralesController.prototype, "findPendientesAutorizar", null);
__decorate([
    (0, common_1.Post)(':consecutivo/firmar'),
    __param(0, (0, common_1.Param)('consecutivo', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, firmar_permiso_dto_1.FirmarPermisoDto]),
    __metadata("design:returntype", Promise)
], PermisosLaboralesController.prototype, "firmar", null);
__decorate([
    (0, common_1.Get)('historial'),
    __param(0, (0, common_1.Query)('empresa')),
    __param(1, (0, common_1.Query)('fecha_inicio')),
    __param(2, (0, common_1.Query)('fecha_fin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PermisosLaboralesController.prototype, "findHistorial", null);
__decorate([
    (0, common_1.Get)(':consecutivo/pdf'),
    __param(0, (0, common_1.Param)('consecutivo', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermisosLaboralesController.prototype, "generarPdf", null);
exports.PermisosLaboralesController = PermisosLaboralesController = __decorate([
    (0, common_1.Controller)('permisos-laborales'),
    __metadata("design:paramtypes", [permisos_laborales_service_1.PermisosLaboralesService])
], PermisosLaboralesController);
//# sourceMappingURL=permisos-laborales.controller.js.map