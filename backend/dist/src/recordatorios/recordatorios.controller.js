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
exports.RecordatoriosController = void 0;
const common_1 = require("@nestjs/common");
const recordatorios_service_1 = require("./recordatorios.service");
const crear_recordatorio_dto_1 = require("./dto/crear-recordatorio.dto");
const actualizar_recordatorio_dto_1 = require("./dto/actualizar-recordatorio.dto");
const helpers_1 = require("../common/helpers");
let RecordatoriosController = class RecordatoriosController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findAll(estado, tipo, alcance) {
        return (0, helpers_1.unwrapResponse)(await this.service.findAll(estado, tipo, alcance));
    }
    async findProximos(limite) {
        return (0, helpers_1.unwrapResponse)(await this.service.findProximos(limite ?? 10));
    }
    async findNotificaciones() {
        return (0, helpers_1.unwrapResponse)(await this.service.findNotificaciones());
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
    async completar(id) {
        return (0, helpers_1.unwrapResponse)(await this.service.completar(id));
    }
    async reactivar(id) {
        return (0, helpers_1.unwrapResponse)(await this.service.reactivar(id));
    }
    async marcarNotificacionLeida(id) {
        return (0, helpers_1.unwrapResponse)(await this.service.marcarNotificacionLeida(id));
    }
};
exports.RecordatoriosController = RecordatoriosController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('estado')),
    __param(1, (0, common_1.Query)('tipo')),
    __param(2, (0, common_1.Query)('alcance')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], RecordatoriosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('proximos'),
    __param(0, (0, common_1.Query)('limite', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecordatoriosController.prototype, "findProximos", null);
__decorate([
    (0, common_1.Get)('notificaciones'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecordatoriosController.prototype, "findNotificaciones", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecordatoriosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_recordatorio_dto_1.CrearRecordatorioDto]),
    __metadata("design:returntype", Promise)
], RecordatoriosController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, actualizar_recordatorio_dto_1.ActualizarRecordatorioDto]),
    __metadata("design:returntype", Promise)
], RecordatoriosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecordatoriosController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/completar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecordatoriosController.prototype, "completar", null);
__decorate([
    (0, common_1.Put)(':id/reactivar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecordatoriosController.prototype, "reactivar", null);
__decorate([
    (0, common_1.Put)('notificaciones/:id/leida'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecordatoriosController.prototype, "marcarNotificacionLeida", null);
exports.RecordatoriosController = RecordatoriosController = __decorate([
    (0, common_1.Controller)('recordatorios'),
    __metadata("design:paramtypes", [recordatorios_service_1.RecordatoriosService])
], RecordatoriosController);
//# sourceMappingURL=recordatorios.controller.js.map