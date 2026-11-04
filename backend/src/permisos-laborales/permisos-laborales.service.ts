import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPermisoLaboralDto } from './dto/crear-permiso-laboral.dto';
import { FirmarPermisoDto } from './dto/firmar-permiso.dto';

@Injectable()
export class PermisosLaboralesService {
  constructor(private prisma: PrismaService) {}

  findTipos() {
    return this.prisma.tipoPermisoLaboral.findMany({ orderBy: { nombre: 'asc' } });
  }

  async create(dto: CrearPermisoLaboralDto) {
    return this.prisma.permisoLaboral.create({
      data: {
        codigoColab: dto.codigo_colab,
        colaboradorNombre: dto.colaborador_nombre,
        fechaSalida: new Date(dto.fecha_salida),
        fechaFinal: new Date(dto.fecha_final),
        tipoPermiso: dto.tipo_permiso,
        tipoNombre: dto.tipo_nombre,
        duracion: dto.duracion,
        compensado: dto.compensado ?? 'N',
        remunerado: dto.remunerado ?? 'N',
        observacion: dto.observacion,
        remitirAutoriza: dto.remitir_autoriza,
        empresa: dto.empresa,
      },
    });
  }

  findPendientesFirmar() {
    return this.prisma.permisoLaboral.findMany({
      where: { firmaSolicita: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  findPendientesAutorizar() {
    return this.prisma.permisoLaboral.findMany({
      where: { firmaAutoriza: null, firmaSolicita: { not: null } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async firmar(consecutivo: number, dto: FirmarPermisoDto) {
    const permiso = await this.prisma.permisoLaboral.findUnique({ where: { consecutivo } });
    if (!permiso) throw new NotFoundException(`Permiso ${consecutivo} no encontrado`);

    if (dto.firma === 'solicitante') {
      return this.prisma.permisoLaboral.update({
        where: { consecutivo },
        data: { firmaSolicita: new Date().toISOString() },
      });
    }
    return this.prisma.permisoLaboral.update({
      where: { consecutivo },
      data: { firmaAutoriza: new Date().toISOString() },
    });
  }

  findHistorial(empresa?: string, fecha_inicio?: string, fecha_fin?: string) {
    const where: any = {};
    if (empresa) where.empresa = empresa;
    if (fecha_inicio || fecha_fin) {
      where.fechaSalida = {};
      if (fecha_inicio) where.fechaSalida.gte = new Date(fecha_inicio);
      if (fecha_fin) where.fechaSalida.lte = new Date(fecha_fin);
    }
    return this.prisma.permisoLaboral.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async generarPdf(consecutivo: number) {
    const permiso = await this.prisma.permisoLaboral.findUnique({ where: { consecutivo } });
    if (!permiso) throw new NotFoundException(`Permiso ${consecutivo} no encontrado`);
    return { url: `/api/permisos-laborales/${consecutivo}/pdf` };
  }
}
