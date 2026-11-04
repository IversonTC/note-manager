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
exports.ColaboradoresController = void 0;
const common_1 = require("@nestjs/common");
const colaboradores_service_1 = require("./colaboradores.service");
const filtrar_colaboradores_dto_1 = require("./dto/filtrar-colaboradores.dto");
const helpers_1 = require("../common/helpers");
let ColaboradoresController = class ColaboradoresController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findAll(dto) {
        return (0, helpers_1.unwrapResponse)(await this.service.findAll(dto));
    }
    async findAccesos(codigo) {
        return (0, helpers_1.unwrapResponse)(await this.service.findAccesos(codigo));
    }
};
exports.ColaboradoresController = ColaboradoresController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filtrar_colaboradores_dto_1.FiltrarColaboradoresDto]),
    __metadata("design:returntype", Promise)
], ColaboradoresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':codigo/accesos'),
    __param(0, (0, common_1.Param)('codigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ColaboradoresController.prototype, "findAccesos", null);
exports.ColaboradoresController = ColaboradoresController = __decorate([
    (0, common_1.Controller)('colaboradores'),
    __metadata("design:paramtypes", [colaboradores_service_1.ColaboradoresService])
], ColaboradoresController);
//# sourceMappingURL=colaboradores.controller.js.map