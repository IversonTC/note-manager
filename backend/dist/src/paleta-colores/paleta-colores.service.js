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
exports.PaletaColoresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaletaColoresService = class PaletaColoresService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmpresa(empresa) {
        const paleta = await this.prisma.paletaColore.findUnique({
            where: { empresaNit: empresa },
        });
        if (!paleta)
            throw new common_1.NotFoundException(`Paleta de colores para empresa ${empresa} no encontrada`);
        return {
            primary_color: paleta.primaryColor,
            color_primario_hover: paleta.colorPrimarioHover,
            color_fondo: paleta.colorFondo,
            color_acento: paleta.colorAcento,
            color_secundario: paleta.colorSecundario,
            color_texto: paleta.colorTexto,
            sidebar_bg: paleta.sidebarBg,
            sidebar_text: paleta.sidebarText,
            navbar_bg: paleta.navbarBg,
            navbar_text: paleta.navbarText,
            logo: paleta.logo,
        };
    }
};
exports.PaletaColoresService = PaletaColoresService;
exports.PaletaColoresService = PaletaColoresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaletaColoresService);
//# sourceMappingURL=paleta-colores.service.js.map