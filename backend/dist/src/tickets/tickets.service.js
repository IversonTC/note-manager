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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const helpers_1 = require("../common/helpers");
let TicketsService = class TicketsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findCategorias() {
        return this.prisma.ticketCategoria.findMany();
    }
    findEstados() {
        return this.prisma.ticketEstado.findMany();
    }
    findPrioridades() {
        return this.prisma.ticketPrioridad.findMany();
    }
    findResumen(desde, hasta) {
        const where = {};
        if (desde || hasta) {
            where.fechaCreacion = {};
            if (desde)
                where.fechaCreacion.gte = new Date(desde);
            if (hasta)
                where.fechaCreacion.lte = new Date(hasta);
        }
        return this.prisma.ticket.findMany({ where, orderBy: { fechaCreacion: 'desc' } });
    }
    findDashboardEvolucion(desde, hasta) {
        const where = {};
        if (desde || hasta) {
            where.fechaCreacion = {};
            if (desde)
                where.fechaCreacion.gte = new Date(desde);
            if (hasta)
                where.fechaCreacion.lte = new Date(hasta);
        }
        return this.prisma.ticket.findMany({ where, orderBy: { fechaCreacion: 'asc' } });
    }
    findAll(estado_id, prioridad_id, categoria_id, empresa, usuario_codigo, buscar, pagina = 1, por_pagina = 20) {
        const where = {};
        if (estado_id)
            where.estadoId = estado_id;
        if (prioridad_id)
            where.prioridadId = prioridad_id;
        if (categoria_id)
            where.categoriaId = categoria_id;
        if (empresa)
            where.empresa = empresa;
        if (usuario_codigo)
            where.usuarioCodigo = usuario_codigo;
        if (buscar)
            where.detalle = { contains: buscar };
        return this.prisma.ticket.findMany({
            where,
            skip: (pagina - 1) * por_pagina,
            take: por_pagina,
            orderBy: { fechaCreacion: 'desc' },
        });
    }
    findHistorial(empresa, categoria_id, buscar, pagina = 1, por_pagina = 20) {
        const where = {};
        if (empresa)
            where.empresa = empresa;
        if (categoria_id)
            where.categoriaId = categoria_id;
        if (buscar)
            where.detalle = { contains: buscar };
        return this.prisma.ticket.findMany({
            where,
            skip: (pagina - 1) * por_pagina,
            take: por_pagina,
            orderBy: { fechaCreacion: 'desc' },
        });
    }
    async findOne(id) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { idTicket: id },
            include: { comentarios: true },
        });
        if (!ticket)
            throw new common_1.NotFoundException(`Ticket ${id} no encontrado`);
        return ticket;
    }
    async create(dto) {
        const numeroTicket = (0, helpers_1.generateNumeroTicket)();
        return this.prisma.ticket.create({
            data: {
                numeroTicket,
                detalle: dto.detalle,
                prioridadId: dto.prioridad_id,
                categoriaId: dto.categoria_id,
                estadoId: 1,
                empresa: '',
                usuarioNombre: '',
            },
        });
    }
    async cambiarEstado(id, dto) {
        await this.findOne(id);
        const data = { estadoId: dto.estado_id };
        return this.prisma.ticket.update({
            where: { idTicket: id },
            data,
            include: { comentarios: true },
        });
    }
    async responder(id, dto) {
        await this.findOne(id);
        return this.prisma.ticket.update({
            where: { idTicket: id },
            data: { horasResolucion: undefined },
            include: { comentarios: true },
        });
    }
    async findComentarios(id) {
        await this.findOne(id);
        return this.prisma.ticketComentario.findMany({ where: { ticketId: id } });
    }
    async createComentario(id, dto) {
        await this.findOne(id);
        return this.prisma.ticketComentario.create({
            data: {
                ticketId: id,
                comentario: dto.comentario,
                autorNombre: '',
            },
        });
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map