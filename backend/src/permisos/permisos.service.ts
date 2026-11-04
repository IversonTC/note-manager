import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearModuloDto } from './dto/crear-modulo.dto';
import { ActualizarModuloDto } from './dto/actualizar-modulo.dto';
import { CrearRolDto } from './dto/crear-rol.dto';
import { ModulosRolDto } from './dto/modulo-rol.dto';
import { ActualizarPermisosDto } from './dto/actualizar-permisos.dto';

@Injectable()
export class PermisosService {
  constructor(private prisma: PrismaService) {}

  findModulos(todos?: string) {
    return this.prisma.moduloApi.findMany({ orderBy: { nombre: 'asc' } });
  }

  async createModulo(dto: CrearModuloDto) {
    return this.prisma.moduloApi.create({ data: dto });
  }

  async updateModulo(id: number, dto: ActualizarModuloDto) {
    const mod = await this.prisma.moduloApi.findUnique({ where: { id } });
    if (!mod) throw new NotFoundException(`Módulo ${id} no encontrado`);
    return this.prisma.moduloApi.update({ where: { id }, data: dto });
  }

  async removeModulo(id: number) {
    const mod = await this.prisma.moduloApi.findUnique({ where: { id } });
    if (!mod) throw new NotFoundException(`Módulo ${id} no encontrado`);
    return this.prisma.moduloApi.delete({ where: { id } });
  }

  findRoles() {
    return this.prisma.rolApi.findMany({ orderBy: { nombre: 'asc' } });
  }

  async createRol(dto: CrearRolDto) {
    return this.prisma.rolApi.create({ data: dto });
  }

  async findOneRol(id: number) {
    const rol = await this.prisma.rolApi.findUnique({
      where: { idRol: id },
      include: { rolesModulos: true },
    });
    if (!rol) throw new NotFoundException(`Rol ${id} no encontrado`);
    return rol;
  }

  async updateRolModulos(id: number, dto: ModulosRolDto) {
    await this.findOneRol(id);
    await this.prisma.rolModulo.deleteMany({ where: { rolId: id } });
    if (dto.modulos.length > 0) {
      await this.prisma.rolModulo.createMany({
        data: dto.modulos.map((m) => ({
          rolId: id,
          modulo: m.modulo,
          puedeVer: m.puede_ver,
          puedeCrear: m.puede_crear,
          puedeEditar: m.puede_editar,
          puedeEliminar: m.puede_eliminar,
        })),
      });
    }
    return this.findOneRol(id);
  }

  async removeRol(id: number) {
    const rol = await this.prisma.rolApi.findUnique({ where: { idRol: id } });
    if (!rol) throw new NotFoundException(`Rol ${id} no encontrado`);
    return this.prisma.rolApi.delete({ where: { idRol: id } });
  }

  findMisPermisos(codigo: string) {
    return this.prisma.permiso.findMany({ where: { codigo } });
  }

  findPermisosColaborador(codigo: string) {
    return this.prisma.permisoAsignado.findMany({ where: { codigo } });
  }

  async updatePermisosColaborador(codigo: string, dto: ActualizarPermisosDto) {
    await this.prisma.permisoAsignado.deleteMany({ where: { codigo } });
    return this.prisma.permisoAsignado.findMany({ where: { codigo } });
  }

  async findAccesosColaborador(codigo: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { codigo } });
    if (!usuario) throw new NotFoundException(`Usuario ${codigo} no encontrado`);
    return this.prisma.accesoModulo.findMany({ where: { codigo } });
  }
}
