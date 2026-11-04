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
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const tickets_service_1 = require("./tickets.service");
const crear_ticket_dto_1 = require("./dto/crear-ticket.dto");
const cambiar_estado_dto_1 = require("./dto/cambiar-estado.dto");
const respuesta_dto_1 = require("./dto/respuesta.dto");
const comentario_dto_1 = require("./dto/comentario.dto");
const helpers_1 = require("../common/helpers");
let TicketsController = class TicketsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findCategorias() {
        return (0, helpers_1.unwrapResponse)(await this.service.findCategorias());
    }
    async findEstados() {
        return (0, helpers_1.unwrapResponse)(await this.service.findEstados());
    }
    async findPrioridades() {
        return (0, helpers_1.unwrapResponse)(await this.service.findPrioridades());
    }
    async findResumen(desde, hasta) {
        return (0, helpers_1.unwrapResponse)(await this.service.findResumen(desde, hasta));
    }
    async findDashboardEvolucion(desde, hasta) {
        return (0, helpers_1.unwrapResponse)(await this.service.findDashboardEvolucion(desde, hasta));
    }
    async findAll(estado_id, prioridad_id, categoria_id, empresa, usuario_codigo, buscar, pagina, por_pagina) {
        return (0, helpers_1.unwrapResponse)(await this.service.findAll(estado_id, prioridad_id, categoria_id, empresa, usuario_codigo, buscar, pagina, por_pagina));
    }
    async findHistorial(empresa, categoria_id, buscar, pagina, por_pagina) {
        return (0, helpers_1.unwrapResponse)(await this.service.findHistorial(empresa, categoria_id, buscar, pagina, por_pagina));
    }
    async findOne(id) {
        return (0, helpers_1.unwrapResponse)(await this.service.findOne(id));
    }
    async create(dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.create(dto));
    }
    async cambiarEstado(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.cambiarEstado(id, dto));
    }
    async responder(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.responder(id, dto));
    }
    async findComentarios(id) {
        return (0, helpers_1.unwrapResponse)(await this.service.findComentarios(id));
    }
    async createComentario(id, dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.createComentario(id, dto));
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Get)('categorias'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findCategorias", null);
__decorate([
    (0, common_1.Get)('estados'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findEstados", null);
__decorate([
    (0, common_1.Get)('prioridades'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findPrioridades", null);
__decorate([
    (0, common_1.Get)('resumen'),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findResumen", null);
__decorate([
    (0, common_1.Get)('dashboard/evolucion'),
    __param(0, (0, common_1.Query)('desde')),
    __param(1, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findDashboardEvolucion", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('estado_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('prioridad_id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('categoria_id', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('empresa')),
    __param(4, (0, common_1.Query)('usuario_codigo')),
    __param(5, (0, common_1.Query)('buscar')),
    __param(6, (0, common_1.Query)('pagina', common_1.ParseIntPipe)),
    __param(7, (0, common_1.Query)('por_pagina', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('historial'),
    __param(0, (0, common_1.Query)('empresa')),
    __param(1, (0, common_1.Query)('categoria_id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('buscar')),
    __param(3, (0, common_1.Query)('pagina', common_1.ParseIntPipe)),
    __param(4, (0, common_1.Query)('por_pagina', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Number, Number]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findHistorial", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_ticket_dto_1.CrearTicketDto]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/estado'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, cambiar_estado_dto_1.CambiarEstadoDto]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "cambiarEstado", null);
__decorate([
    (0, common_1.Put)(':id/respuesta'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, respuesta_dto_1.RespuestaDto]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "responder", null);
__decorate([
    (0, common_1.Get)(':id/comentarios'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findComentarios", null);
__decorate([
    (0, common_1.Post)(':id/comentarios'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, comentario_dto_1.ComentarioDto]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "createComentario", null);
exports.TicketsController = TicketsController = __decorate([
    (0, common_1.Controller)('tickets'),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map