import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FiltrarColaboradoresDto } from './dto/filtrar-colaboradores.dto';

@Injectable()
export class ColaboradoresService {
  constructor(private prisma: PrismaService) {}

  async findAll(dto: FiltrarColaboradoresDto) {
    const { empresas, estado, pagina = 1, por_pagina = 20, buscar, centro_costo, todos, paginar } = dto;

    const where: any = {};
    if (empresas) where.empresa = { in: empresas.split(',') };
    if (estado !== undefined) where.estado = estado;
    if (buscar) {
      where.OR = [
        { nombre: { contains: buscar } },
        { cedula: { contains: buscar } },
        { correo: { contains: buscar } },
      ];
    }
    if (centro_costo) where.centroCosto = centro_costo;

    if (todos === '1') {
      const data = await this.prisma.usuario.findMany({
        where,
        select: { codigo: true, nombre: true, cedula: true, empresa: true },
        orderBy: { nombre: 'asc' },
      });
      return { status: 'success', data };
    }

    if (paginar === '0') {
      const data = await this.prisma.usuario.findMany({
        where,
        select: { codigo: true, nombre: true },
        orderBy: { nombre: 'asc' },
      });
      return data;
    }

    const skip = (pagina - 1) * por_pagina;
    const [items, total] = await Promise.all([
      this.prisma.usuario.findMany({
        where,
        skip,
        take: por_pagina,
        orderBy: { nombre: 'asc' },
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return { data: items, last_page: Math.ceil(total / por_pagina), total };
  }

  async findAccesos(codigo: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { codigo } });
    if (!usuario) throw new NotFoundException(`Usuario ${codigo} no encontrado`);

    const [accesosModulos, accesosPermisos, accesosHoras] = await Promise.all([
      this.prisma.accesoModulo.findMany({ where: { codigo } }),
      this.prisma.accesoPermisoLaboral.findMany({ where: { codigo } }),
      this.prisma.accesoHoraExtra.findMany({ where: { codigo } }),
    ]);

    return { accesosModulos, accesosPermisos, accesosHoras };
  }
}
