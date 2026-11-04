import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearReunionDto } from './dto/crear-reunion.dto';
import { ActualizarReunionDto } from './dto/actualizar-reunion.dto';
import { AsistenciaReunionDto } from './dto/asistencia-reunion.dto';
import { ConvocadosReunionDto } from './dto/convocados-reunion.dto';

@Injectable()
export class ReunionesService {
  constructor(private prisma: PrismaService) {}

  findMisReuniones(codigo?: string) {
    const where: any = {};
    if (codigo) {
      where.convocados = { some: { codigoColab: codigo } };
    }
    return this.prisma.reunion.findMany({
      where,
      include: { asistencias: true, convocados: true },
      orderBy: { fecha: 'desc' },
    });
  }

  findActivas() {
    return this.prisma.reunion.findMany({
      where: { estado: 1 },
      include: { asistencias: true, convocados: true },
      orderBy: { fecha: 'desc' },
    });
  }

  async findOne(codigo: string) {
    const reunion = await this.prisma.reunion.findUnique({
      where: { codigo },
      include: { asistencias: true, convocados: true },
    });
    if (!reunion) throw new NotFoundException(`Reunión ${codigo} no encontrada`);
    return reunion;
  }

  async create(dto: CrearReunionDto) {
    const { hora_inicio, hora_fin, tipo_evento, tipo_reunion, ...rest } = dto;
    return this.prisma.reunion.create({
      data: {
        ...rest,
        horaInicio: hora_inicio,
        horaFin: hora_fin,
        tipoEvento: tipo_evento,
        tipoReunion: tipo_reunion,
        fecha: new Date(rest.fecha),
      },
      include: { asistencias: true, convocados: true },
    });
  }

  async update(codigo: string, dto: ActualizarReunionDto) {
    await this.findOne(codigo);
    const { hora_inicio, hora_fin, tipo_evento, tipo_reunion, ...rest } = dto;
    return this.prisma.reunion.update({
      where: { codigo },
      data: {
        ...rest,
        horaInicio: hora_inicio,
        horaFin: hora_fin,
        tipoEvento: tipo_evento,
        tipoReunion: tipo_reunion,
        fecha: rest.fecha ? new Date(rest.fecha) : undefined,
      },
      include: { asistencias: true, convocados: true },
    });
  }

  async registrarAsistencia(codigo: string, dto: AsistenciaReunionDto) {
    await this.findOne(codigo);
    return this.prisma.asistenciaReunion.create({
      data: {
        codigoReunion: codigo,
        codigoColab: '',
        colaboradorNombre: '',
        colaboradorCedula: '',
        horaRegistro: new Date().toTimeString().slice(0, 8),
        confirmacion: dto.confirmacion,
        observacion: dto.observacion,
      },
    });
  }

  async findAsistencia(codigo: string) {
    await this.findOne(codigo);
    return this.prisma.asistenciaReunion.findMany({
      where: { codigoReunion: codigo },
    });
  }

  async agregarConvocados(codigo: string, dto: ConvocadosReunionDto) {
    await this.findOne(codigo);
    const usuarios = await this.prisma.usuario.findMany({
      where: { codigo: { in: dto.convocados } },
    });
    const data = usuarios.map((u) => ({
      codigoReunion: codigo,
      codigoColab: u.codigo,
      nombre: u.nombre,
    }));
    await this.prisma.reunionConvocado.createMany({ data, skipDuplicates: true });
    return this.prisma.reunionConvocado.findMany({ where: { codigoReunion: codigo } });
  }

  findTiposReunion() {
    return this.prisma.tipoReunion.findMany({ orderBy: { nombre: 'asc' } });
  }

  findLugares(empresa?: string) {
    const where: any = {};
    if (empresa) where.empresa = empresa;
    return this.prisma.lugarReunion.findMany({ where, orderBy: { nombre: 'asc' } });
  }

  findProcesos() {
    return this.prisma.procesoReunion.findMany({ orderBy: { nombre: 'asc' } });
  }
}
