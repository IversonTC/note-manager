import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearRecordatorioDto } from './dto/crear-recordatorio.dto';
import { ActualizarRecordatorioDto } from './dto/actualizar-recordatorio.dto';

@Injectable()
export class RecordatoriosService {
  constructor(private prisma: PrismaService) {}

  findAll(estado?: string, tipo?: string, alcance?: string) {
    const where: any = {};
    if (estado) where.estado = estado;
    if (tipo) where.tipo = tipo;
    if (alcance) where.alcance = alcance;
    return this.prisma.recordatorio.findMany({
      where,
      include: { destinatarios: true },
      orderBy: { fechaCreacion: 'desc' },
    });
  }

  async findOne(id: number) {
    const rec = await this.prisma.recordatorio.findUnique({
      where: { id },
      include: { destinatarios: true },
    });
    if (!rec) throw new NotFoundException(`Recordatorio ${id} no encontrado`);
    return rec;
  }

  async create(dto: CrearRecordatorioDto) {
    const { destinatarios, fecha_unica, fecha_inicio, fecha_fin, dias_semana, dia_mes, intervalo_dias, sin_fecha_fin, ...rest } = dto;
    return this.prisma.recordatorio.create({
      data: {
        titulo: rest.titulo,
        descripcion: rest.descripcion,
        tipo: rest.tipo ?? 'temporal',
        alcance: rest.alcance ?? 'personal',
        hora: rest.hora,
        frecuencia: rest.frecuencia,
        creadoPor: '',
        creadoPorNombre: '',
        diasSemana: dias_semana,
        diaMes: dia_mes,
        intervalodias: intervalo_dias,
        sinFechaFin: sin_fecha_fin ?? true,
        fechaUnica: fecha_unica ? new Date(fecha_unica) : undefined,
        fechaInicio: fecha_inicio ? new Date(fecha_inicio) : undefined,
        fechaFin: fecha_fin ? new Date(fecha_fin) : undefined,
        destinatarios: destinatarios?.length
          ? { create: destinatarios }
          : undefined,
      },
      include: { destinatarios: true },
    });
  }

  async update(id: number, dto: ActualizarRecordatorioDto) {
    await this.findOne(id);
    const { destinatarios, fecha_unica, fecha_inicio, fecha_fin, dias_semana, dia_mes, intervalo_dias, sin_fecha_fin, ...rest } = dto;
    const data: any = {};
    if (rest.titulo !== undefined) data.titulo = rest.titulo;
    if (rest.descripcion !== undefined) data.descripcion = rest.descripcion;
    if (rest.tipo !== undefined) data.tipo = rest.tipo;
    if (rest.alcance !== undefined) data.alcance = rest.alcance;
    if (rest.hora !== undefined) data.hora = rest.hora;
    if (rest.frecuencia !== undefined) data.frecuencia = rest.frecuencia;
    if (dias_semana !== undefined) data.diasSemana = dias_semana;
    if (dia_mes !== undefined) data.diaMes = dia_mes;
    if (intervalo_dias !== undefined) data.intervalodias = intervalo_dias;
    if (sin_fecha_fin !== undefined) data.sinFechaFin = sin_fecha_fin;
    if (fecha_unica !== undefined) data.fechaUnica = new Date(fecha_unica);
    if (fecha_inicio !== undefined) data.fechaInicio = new Date(fecha_inicio);
    if (fecha_fin !== undefined) data.fechaFin = new Date(fecha_fin);
    return this.prisma.recordatorio.update({
      where: { id },
      data,
      include: { destinatarios: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.recordatorio.delete({ where: { id } });
  }

  async completar(id: number) {
    await this.findOne(id);
    return this.prisma.recordatorio.update({
      where: { id },
      data: { estado: 'completado' },
    });
  }

  async reactivar(id: number) {
    await this.findOne(id);
    return this.prisma.recordatorio.update({
      where: { id },
      data: { estado: 'pendiente' },
    });
  }

  findProximos(limite: number = 10) {
    return this.prisma.recordatorio.findMany({
      where: { estado: 'pendiente' },
      orderBy: { proximaEjecucion: 'asc' },
      take: limite,
      include: { destinatarios: true },
    });
  }

  findNotificaciones() {
    return this.prisma.notificacionRecordatorio.findMany({
      orderBy: { fechaEjecucion: 'desc' },
    });
  }

  async marcarNotificacionLeida(id: number) {
    const notif = await this.prisma.notificacionRecordatorio.findUnique({ where: { id } });
    if (!notif) throw new NotFoundException(`Notificación ${id} no encontrada`);
    return this.prisma.notificacionRecordatorio.update({
      where: { id },
      data: { leida: true },
    });
  }
}
