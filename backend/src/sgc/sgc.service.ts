import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearAccionDto } from './dto/crear-accion.dto';
import { ActualizarAccionDto } from './dto/actualizar-accion.dto';
import { CrearPlanDto } from './dto/crear-plan.dto';
import { ActividadesDto } from './dto/actividades.dto';
import { CrearSeguimientoDto } from './dto/seguimiento.dto';
import { EncabezadoDto } from './dto/encabezado.dto';

@Injectable()
export class SgcService {
  constructor(private prisma: PrismaService) {}

  findFormatos() {
    return this.prisma.formatoSgc.findMany({ orderBy: { nombre: 'asc' } });
  }

  findTiposAccion() {
    return this.prisma.accionSgc.groupBy({ by: ['tipoAccion', 'nomTipo'] });
  }

  findOrigenesAccion() {
    return this.prisma.accionSgc.groupBy({ by: ['origen', 'nomOrigen'] });
  }

  findEncabezado(empresa: string, formato: number) {
    return this.prisma.encabezadoSgc.findUnique({
      where: { formato_empresa: { formato, empresa } },
    });
  }

  findEncabezados(empresa: string) {
    return this.prisma.encabezadoSgc.findMany({ where: { empresa } });
  }

  async upsertEncabezado(dto: EncabezadoDto) {
    const data = {
      formato: dto.formato,
      empresa: dto.empresa,
      sgcTitulo1: dto.sgc_titulo1,
      sgcTitulo2: dto.sgc_titulo2,
      sgcTitulo3: dto.sgc_titulo3,
      sgcCodigo: dto.sgc_codigo,
      sgcVersion: dto.sgc_version,
      sgcFecha: dto.sgc_fecha,
      icono: dto.icono,
      nomEmpresa: dto.nom_empresa,
    };
    return this.prisma.encabezadoSgc.upsert({
      where: { formato_empresa: { formato: dto.formato, empresa: dto.empresa } },
      update: data,
      create: data,
    });
  }

  findAcciones(
    empresa?: string,
    tipo_accion?: number,
    origen?: number,
    buscar?: string,
    pagina: number = 1,
    por_pagina: number = 20,
  ) {
    const where: any = {};
    if (empresa) where.empresa = empresa;
    if (tipo_accion) where.tipoAccion = tipo_accion;
    if (origen) where.origen = origen;
    if (buscar) where.descripcion = { contains: buscar };

    return this.prisma.accionSgc.findMany({
      where,
      include: { actividades: true, seguimientos: true },
      skip: (pagina - 1) * por_pagina,
      take: por_pagina,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneAccion(consecutivo: number) {
    const accion = await this.prisma.accionSgc.findUnique({
      where: { consecutivo },
      include: { actividades: true, seguimientos: true },
    });
    if (!accion) throw new NotFoundException(`Acción ${consecutivo} no encontrada`);
    return accion;
  }

  async createAccion(dto: CrearAccionDto) {
    const { tipo_accion, nom_tipo, nom_origen, fecha_deteccion, nom_registrado_por, ...rest } = dto;
    return this.prisma.accionSgc.create({
      data: {
        ...rest,
        tipoAccion: tipo_accion,
        nomTipo: nom_tipo,
        nomOrigen: nom_origen,
        fechaDeteccion: new Date(fecha_deteccion),
        nomRegistradoPor: nom_registrado_por,
      },
      include: { actividades: true, seguimientos: true },
    });
  }

  async updateAccion(consecutivo: number, dto: ActualizarAccionDto) {
    await this.findOneAccion(consecutivo);
    const { tipo_accion, nom_tipo, nom_origen, fecha_deteccion, nom_registrado_por, ...rest } = dto;
    return this.prisma.accionSgc.update({
      where: { consecutivo },
      data: {
        ...rest,
        tipoAccion: tipo_accion,
        nomTipo: nom_tipo,
        nomOrigen: nom_origen,
        fechaDeteccion: fecha_deteccion ? new Date(fecha_deteccion) : undefined,
        nomRegistradoPor: nom_registrado_por,
      },
      include: { actividades: true, seguimientos: true },
    });
  }

  async findActividades(consecutivo: number) {
    await this.findOneAccion(consecutivo);
    return this.prisma.actividadSgc.findMany({
      where: { accionConsecutivo: consecutivo },
    });
  }

  async updateActividades(consecutivo: number, dto: ActividadesDto) {
    await this.findOneAccion(consecutivo);
    await this.prisma.actividadSgc.deleteMany({ where: { accionConsecutivo: consecutivo } });
    if (dto.actividades.length > 0) {
      await this.prisma.actividadSgc.createMany({
        data: dto.actividades.map((a) => ({
          accionConsecutivo: consecutivo,
          actividad: a.actividad,
          responsable: a.responsable,
          nomResponsable: a.nom_responsable,
          fechaImplementacion: new Date(a.fecha_implementacion),
        })),
      });
    }
    return this.findActividades(consecutivo);
  }

  async findSeguimientos(consecutivo: number) {
    await this.findOneAccion(consecutivo);
    return this.prisma.seguimientoSgc.findMany({
      where: { accionConsecutivo: consecutivo },
    });
  }

  async createSeguimiento(consecutivo: number, dto: CrearSeguimientoDto) {
    await this.findOneAccion(consecutivo);
    return this.prisma.seguimientoSgc.create({
      data: {
        accionConsecutivo: consecutivo,
        actividad: dto.actividad,
        nomResponsable: dto.nom_responsable ?? '',
        fechaSeguimiento: new Date(dto.fecha_seguimiento),
      },
    });
  }

  findPlanMejoras(
    cerrado?: number,
    colaborador?: string,
    pagina: number = 1,
    por_pagina: number = 20,
  ) {
    const where: any = {};
    if (cerrado !== undefined) where.cerrado = cerrado;
    return this.prisma.planMejora.findMany({
      where,
      skip: (pagina - 1) * por_pagina,
      take: por_pagina,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOnePlanMejora(id: number) {
    const plan = await this.prisma.planMejora.findUnique({
      where: { id },
      include: { seguimientos: true },
    });
    if (!plan) throw new NotFoundException(`Plan de mejora ${id} no encontrado`);
    return plan;
  }

  async createPlanMejora(dto: CrearPlanDto) {
    const { opt_nombre_propuesta, opt_descripcion, opt_importancia, opt_posible_mejora, opt_fecha_seguimiento, opt_pasos, opt_conclusion, nom_aliado, valor_hora, ...rest } = dto;
    return this.prisma.planMejora.create({
      data: {
        ...rest,
        optNombrePropuesta: opt_nombre_propuesta,
        optDescripcion: opt_descripcion,
        optImportancia: opt_importancia,
        optPosibleMejora: opt_posible_mejora,
        optFechaSeguimiento: opt_fecha_seguimiento ? new Date(opt_fecha_seguimiento) : undefined,
        optPasos: opt_pasos,
        optConclusion: opt_conclusion,
        nomAliado: nom_aliado,
        valorHora: valor_hora,
      },
      include: { seguimientos: true },
    });
  }

  async cerrarPlanMejora(id: number) {
    await this.findOnePlanMejora(id);
    return this.prisma.planMejora.update({
      where: { id },
      data: { cerrado: 1 },
    });
  }

  async findSeguimientosPlan(id: number) {
    await this.findOnePlanMejora(id);
    return this.prisma.seguimientoPlan.findMany({ where: { planId: id } });
  }

  async createSeguimientoPlan(id: number, dto: CrearSeguimientoDto) {
    await this.findOnePlanMejora(id);
    return this.prisma.seguimientoPlan.create({
      data: {
        planId: id,
        seguimiento: dto.actividad,
        nomResponsable: dto.nom_responsable ?? '',
        fechaSeguimiento: new Date(dto.fecha_seguimiento),
      },
    });
  }
}
