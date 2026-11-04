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
exports.CrearPermisoLaboralDto = void 0;
const class_validator_1 = require("class-validator");
class CrearPermisoLaboralDto {
    codigo_colab;
    colaborador_nombre;
    fecha_salida;
    fecha_final;
    tipo_permiso;
    tipo_nombre;
    duracion;
    compensado;
    remunerado;
    observacion;
    remitir_autoriza;
    empresa;
}
exports.CrearPermisoLaboralDto = CrearPermisoLaboralDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearPermisoLaboralDto.prototype, "codigo_colab", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearPermisoLaboralDto.prototype, "colaborador_nombre", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CrearPermisoLaboralDto.prototype, "fecha_salida", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CrearPermisoLaboralDto.prototype, "fecha_final", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearPermisoLaboralDto.prototype, "tipo_permiso", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearPermisoLaboralDto.prototype, "tipo_nombre", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CrearPermisoLaboralDto.prototype, "duracion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearPermisoLaboralDto.prototype, "compensado", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearPermisoLaboralDto.prototype, "remunerado", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearPermisoLaboralDto.prototype, "observacion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearPermisoLaboralDto.prototype, "remitir_autoriza", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearPermisoLaboralDto.prototype, "empresa", void 0);
//# sourceMappingURL=crear-permiso-laboral.dto.js.map