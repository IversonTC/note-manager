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
exports.OtMantenimientoController = void 0;
const common_1 = require("@nestjs/common");
const ot_mantenimiento_service_1 = require("./ot-mantenimiento.service");
const crear_ot_dto_1 = require("./dto/crear-ot.dto");
const helpers_1 = require("../common/helpers");
let OtMantenimientoController = class OtMantenimientoController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findEmpresas() {
        return (0, helpers_1.unwrapResponse)(await this.service.findEmpresas());
    }
    async findAll() {
        return (0, helpers_1.unwrapResponse)(await this.service.findAll());
    }
    async create(dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.create(dto));
    }
};
exports.OtMantenimientoController = OtMantenimientoController;
__decorate([
    (0, common_1.Get)('empresas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OtMantenimientoController.prototype, "findEmpresas", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OtMantenimientoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_ot_dto_1.CrearOtDto]),
    __metadata("design:returntype", Promise)
], OtMantenimientoController.prototype, "create", null);
exports.OtMantenimientoController = OtMantenimientoController = __decorate([
    (0, common_1.Controller)('ot-mantenimiento'),
    __metadata("design:paramtypes", [ot_mantenimiento_service_1.OtMantenimientoService])
], OtMantenimientoController);
//# sourceMappingURL=ot-mantenimiento.controller.js.map