import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmpresasService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.empresa.findMany({ orderBy: { nombre: 'asc' } });
  }

  async findOne(nit: string) {
    const emp = await this.prisma.empresa.findUnique({ where: { nit } });
    if (!emp) throw new NotFoundException(`Empresa ${nit} no encontrada`);
    return emp;
  }

  async findByCedula(cedula: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { cedula } });
    if (!usuario) throw new NotFoundException(`Usuario con cédula ${cedula} no encontrado`);
    return this.prisma.empresa.findMany({
      where: { empresasUsuario: usuario.codigo },
      orderBy: { nombre: 'asc' },
    });
  }

  async findCentrosCosto(nit: string) {
    await this.findOne(nit);
    return this.prisma.centroCosto.findMany({
      where: { empresaNit: nit },
      orderBy: { nombre: 'asc' },
    });
  }
}
