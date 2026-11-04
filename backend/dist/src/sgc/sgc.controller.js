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
exports.SgcController = void 0;
const common_1 = require("@nestjs/common");
const sgc_service_1 = require("./sgc.service");
const crear_accion_dto_1 = require("./dto/crear-accion.dto");
const actualizar_accion_dto_1 = require("./dto/actualizar-accion.dto");
const crear_plan_dto_1 = require("./dto/crear-plan.dto");
const actividades_dto_1 = require("./dto/actividades.dto");
const seguimiento_dto_1 = require("./dto/seguimiento.dto");
const encabezado_dto_1 = require("./dto/encabezado.dto");
const helpers_1 = require("../common/helpers");
let SgcController = class SgcController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findFormatos() {
        return (0, helpers_1.unwrapResponse)(await this.service.findFormatos());
    }
    async findTiposAccion() {
        return (0, helpers_1.unwrapResponse)(await this.service.findTiposAccion());
    }
    async findOrigenesAccion() {
        return (0, helpers_1.unwrapResponse)(await this.service.findOrigenesAccion());
    }
    async findEncabezado(empresa, formato) {
        return (0, helpers_1.unwrapResponse)(await this.service.findEncabezado(empresa, formato));
    }
    async findEncabezados(empresa) {
        return (0, helpers_1.unwrapResponse)(await this.service.findEncabezados(empresa));
    }
    async upsertEncabezado(dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.upsertEncabezado(dto));
    }
    async findAcciones(empresa, tipo_accion, origen, buscar, pagina, por_pagina) {
        return (0, helpers_1.unwrapResponse)(await this.service.findAcciones(empresa, tipo_accion, origen, buscar, pagina, por_pagina));
    }
    async findOneAccion(consecutivo) {
        return (0, helpers_1.unwrapResponse)(await this.service.findOneAccion(consecutivo));
    }
    async createAccion(dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.createAccion(dto));
    }
    async updateAccion(consecutivo, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.updateAccion(consecutivo, dto));
    }
    async findActividades(consecutivo) {
        return (0, helpers_1.unwrapResponse)(await this.service.findActividades(consecutivo));
    }
    async updateActividades(consecutivo, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.updateActividades(consecutivo, dto));
    }
    async findSeguimientos(consecutivo) {
        return (0, helpers_1.unwrapResponse)(await this.service.findSeguimientos(consecutivo));
    }
    async createSeguimiento(consecutivo, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.createSeguimiento(consecutivo, dto));
    }
    async findPlanMejoras(cerrado, colaborador, pagina, por_pagina) {
        return (0, helpers_1.unwrapResponse)(await this.service.findPlanMejoras(cerrado, colaborador, pagina, por_pagina));
    }
    async findOnePlanMejora(id) {
        return (0, helpers_1.unwrapResponse)(await this.service.findOnePlanMejora(id));
    }
    async createPlanMejora(dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.createPlanMejora(dto));
    }
    async cerrarPlanMejora(id) {
        return (0, helpers_1.unwrapResponse)(await this.service.cerrarPlanMejora(id));
    }
    async findSeguimientosPlan(id) {
        return (0, helpers_1.unwrapResponse)(await this.service.findSeguimientosPlan(id));
    }
    async createSeguimientoPlan(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.createSeguimientoPlan(id, dto));
    }
};
exports.SgcController = SgcController;
__decorate([
    (0, common_1.Get)('formatos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "findFormatos", null);
__decorate([
    (0, common_1.Get)('tipos-accion'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "findTiposAccion", null);
__decorate([
    (0, common_1.Get)('origenes-accion'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "findOrigenesAccion", null);
__decorate([
    (0, common_1.Get)('encabezado'),
    __param(0, (0, common_1.Query)('empresa')),
    __param(1, (0, common_1.Query)('formato', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "findEncabezado", null);
__decorate([
    (0, common_1.Get)('encabezados'),
    __param(0, (0, common_1.Query)('empresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "findEncabezados", null);
__decorate([
    (0, common_1.Put)('encabezado'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [encabezado_dto_1.EncabezadoDto]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "upsertEncabezado", null);
__decorate([
    (0, common_1.Get)('acciones'),
    __param(0, (0, common_1.Query)('empresa')),
    __param(1, (0, common_1.Query)('tipo_accion', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('origen', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('buscar')),
    __param(4, (0, common_1.Query)('pagina', common_1.ParseIntPipe)),
    __param(5, (0, common_1.Query)('por_pagina', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, Number, Number]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "findAcciones", null);
__decorate([
    (0, common_1.Get)('acciones/:consecutivo'),
    __param(0, (0, common_1.Param)('consecutivo', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "findOneAccion", null);
__decorate([
    (0, common_1.Post)('acciones'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_accion_dto_1.CrearAccionDto]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "createAccion", null);
__decorate([
    (0, common_1.Put)('acciones/:consecutivo'),
    __param(0, (0, common_1.Param)('consecutivo', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, actualizar_accion_dto_1.ActualizarAccionDto]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "updateAccion", null);
__decorate([
    (0, common_1.Get)('acciones/:consecutivo/actividades'),
    __param(0, (0, common_1.Param)('consecutivo', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "findActividades", null);
__decorate([
    (0, common_1.Put)('acciones/:consecutivo/actividades'),
    __param(0, (0, common_1.Param)('consecutivo', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, actividades_dto_1.ActividadesDto]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "updateActividades", null);
__decorate([
    (0, common_1.Get)('acciones/:consecutivo/seguimientos'),
    __param(0, (0, common_1.Param)('consecutivo', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "findSeguimientos", null);
__decorate([
    (0, common_1.Post)('acciones/:consecutivo/seguimientos'),
    __param(0, (0, common_1.Param)('consecutivo', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, seguimiento_dto_1.CrearSeguimientoDto]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "createSeguimiento", null);
__decorate([
    (0, common_1.Get)('planes'),
    __param(0, (0, common_1.Query)('cerrado', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('colaborador')),
    __param(2, (0, common_1.Query)('pagina', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('por_pagina', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number, Number]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "findPlanMejoras", null);
__decorate([
    (0, common_1.Get)('planes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "findOnePlanMejora", null);
__decorate([
    (0, common_1.Post)('planes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_plan_dto_1.CrearPlanDto]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "createPlanMejora", null);
__decorate([
    (0, common_1.Put)('planes/:id/cerrar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "cerrarPlanMejora", null);
__decorate([
    (0, common_1.Get)('planes/:id/seguimientos'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "findSeguimientosPlan", null);
__decorate([
    (0, common_1.Post)('planes/:id/seguimientos'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, seguimiento_dto_1.CrearSeguimientoDto]),
    __metadata("design:returntype", Promise)
], SgcController.prototype, "createSeguimientoPlan", null);
exports.SgcController = SgcController = __decorate([
    (0, common_1.Controller)('sgc'),
    __metadata("design:paramtypes", [sgc_service_1.SgcService])
], SgcController);
//# sourceMappingURL=sgc.controller.js.map