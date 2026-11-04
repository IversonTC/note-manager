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
exports.ReunionesController = void 0;
const common_1 = require("@nestjs/common");
const reuniones_service_1 = require("./reuniones.service");
const crear_reunion_dto_1 = require("./dto/crear-reunion.dto");
const actualizar_reunion_dto_1 = require("./dto/actualizar-reunion.dto");
const asistencia_reunion_dto_1 = require("./dto/asistencia-reunion.dto");
const convocados_reunion_dto_1 = require("./dto/convocados-reunion.dto");
const helpers_1 = require("../common/helpers");
let ReunionesController = class ReunionesController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findMisReuniones(codigo) {
        return (0, helpers_1.unwrapResponse)(await this.service.findMisReuniones(codigo));
    }
    async findActivas() {
        return (0, helpers_1.unwrapResponse)(await this.service.findActivas());
    }
    async findTiposReunion() {
        return (0, helpers_1.unwrapResponse)(await this.service.findTiposReunion());
    }
    async findLugares(empresa) {
        return (0, helpers_1.unwrapResponse)(await this.service.findLugares(empresa));
    }
    async findProcesos() {
        return (0, helpers_1.unwrapResponse)(await this.service.findProcesos());
    }
    async findOne(codigo) {
        return (0, helpers_1.unwrapResponse)(await this.service.findOne(codigo));
    }
    async create(dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.create(dto));
    }
    async update(codigo, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.update(codigo, dto));
    }
    async registrarAsistencia(codigo, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.registrarAsistencia(codigo, dto));
    }
    async findAsistencia(codigo) {
        return (0, helpers_1.unwrapResponse)(await this.service.findAsistencia(codigo));
    }
    async agregarConvocados(codigo, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.agregarConvocados(codigo, dto));
    }
};
exports.ReunionesController = ReunionesController;
__decorate([
    (0, common_1.Get)('mis-reuniones'),
    __param(0, (0, common_1.Query)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReunionesController.prototype, "findMisReuniones", null);
__decorate([
    (0, common_1.Get)('activas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReunionesController.prototype, "findActivas", null);
__decorate([
    (0, common_1.Get)('catalogos/tipos-reunion'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReunionesController.prototype, "findTiposReunion", null);
__decorate([
    (0, common_1.Get)('catalogos/lugares'),
    __param(0, (0, common_1.Query)('empresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReunionesController.prototype, "findLugares", null);
__decorate([
    (0, common_1.Get)('catalogos/procesos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReunionesController.prototype, "findProcesos", null);
__decorate([
    (0, common_1.Get)(':codigo'),
    __param(0, (0, common_1.Param)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReunionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_reunion_dto_1.CrearReunionDto]),
    __metadata("design:returntype", Promise)
], ReunionesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':codigo'),
    __param(0, (0, common_1.Param)('codigo')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, actualizar_reunion_dto_1.ActualizarReunionDto]),
    __metadata("design:returntype", Promise)
], ReunionesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':codigo/asistencia'),
    __param(0, (0, common_1.Param)('codigo')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, asistencia_reunion_dto_1.AsistenciaReunionDto]),
    __metadata("design:returntype", Promise)
], ReunionesController.prototype, "registrarAsistencia", null);
__decorate([
    (0, common_1.Get)(':codigo/asistencia'),
    __param(0, (0, common_1.Param)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReunionesController.prototype, "findAsistencia", null);
__decorate([
    (0, common_1.Post)(':codigo/convocados'),
    __param(0, (0, common_1.Param)('codigo')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, convocados_reunion_dto_1.ConvocadosReunionDto]),
    __metadata("design:returntype", Promise)
], ReunionesController.prototype, "agregarConvocados", null);
exports.ReunionesController = ReunionesController = __decorate([
    (0, common_1.Controller)('reuniones'),
    __metadata("design:paramtypes", [reuniones_service_1.ReunionesService])
], ReunionesController);
//# sourceMappingURL=reuniones.controller.js.map