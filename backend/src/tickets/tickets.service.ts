import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearTicketDto } from './dto/crear-ticket.dto';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';
import { RespuestaDto } from './dto/respuesta.dto';
import { ComentarioDto } from './dto/comentario.dto';
import { generateNumeroTicket } from '../common/helpers';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  findCategorias() {
    return this.prisma.ticketCategoria.findMany();
  }

  findEstados() {
    return this.prisma.ticketEstado.findMany();
  }

  findPrioridades() {
    return this.prisma.ticketPrioridad.findMany();
  }

  findResumen(desde?: string, hasta?: string) {
    const where: any = {};
    if (desde || hasta) {
      where.fechaCreacion = {};
      if (desde) where.fechaCreacion.gte = new Date(desde);
      if (hasta) where.fechaCreacion.lte = new Date(hasta);
    }
    return this.prisma.ticket.findMany({ where, orderBy: { fechaCreacion: 'desc' } });
  }

  findDashboardEvolucion(desde?: string, hasta?: string) {
    const where: any = {};
    if (desde || hasta) {
      where.fechaCreacion = {};
      if (desde) where.fechaCreacion.gte = new Date(desde);
      if (hasta) where.fechaCreacion.lte = new Date(hasta);
    }
    return this.prisma.ticket.findMany({ where, orderBy: { fechaCreacion: 'asc' } });
  }

  findAll(
    estado_id?: number,
    prioridad_id?: number,
    categoria_id?: number,
    empresa?: string,
    usuario_codigo?: string,
    buscar?: string,
    pagina: number = 1,
    por_pagina: number = 20,
  ) {
    const where: any = {};
    if (estado_id) where.estadoId = estado_id;
    if (prioridad_id) where.prioridadId = prioridad_id;
    if (categoria_id) where.categoriaId = categoria_id;
    if (empresa) where.empresa = empresa;
    if (usuario_codigo) where.usuarioCodigo = usuario_codigo;
    if (buscar) where.detalle = { contains: buscar };

    return this.prisma.ticket.findMany({
      where,
      skip: (pagina - 1) * por_pagina,
      take: por_pagina,
      orderBy: { fechaCreacion: 'desc' },
    });
  }

  findHistorial(
    empresa?: string,
    categoria_id?: number,
    buscar?: string,
    pagina: number = 1,
    por_pagina: number = 20,
  ) {
    const where: any = {};
    if (empresa) where.empresa = empresa;
    if (categoria_id) where.categoriaId = categoria_id;
    if (buscar) where.detalle = { contains: buscar };

    return this.prisma.ticket.findMany({
      where,
      skip: (pagina - 1) * por_pagina,
      take: por_pagina,
      orderBy: { fechaCreacion: 'desc' },
    });
  }

  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { idTicket: id },
      include: { comentarios: true },
    });
    if (!ticket) throw new NotFoundException(`Ticket ${id} no encontrado`);
    return ticket;
  }

  async create(dto: CrearTicketDto) {
    const numeroTicket = generateNumeroTicket();
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

  async cambiarEstado(id: number, dto: CambiarEstadoDto) {
    await this.findOne(id);
    const data: any = { estadoId: dto.estado_id };
    return this.prisma.ticket.update({
      where: { idTicket: id },
      data,
      include: { comentarios: true },
    });
  }

  async responder(id: number, dto: RespuestaDto) {
    await this.findOne(id);
    return this.prisma.ticket.update({
      where: { idTicket: id },
      data: { horasResolucion: undefined },
      include: { comentarios: true },
    });
  }

  async findComentarios(id: number) {
    await this.findOne(id);
    return this.prisma.ticketComentario.findMany({ where: { ticketId: id } });
  }

  async createComentario(id: number, dto: ComentarioDto) {
    await this.findOne(id);
    return this.prisma.ticketComentario.create({
      data: {
        ticketId: id,
        comentario: dto.comentario,
        autorNombre: '',
      },
    });
  }
}
