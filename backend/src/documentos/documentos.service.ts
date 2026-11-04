import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearDocumentoDto } from './dto/crear-documento.dto';
import { ActualizarDocumentoDto } from './dto/actualizar-documento.dto';
import { UpdatePermisosDto } from './dto/update-permisos.dto';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class DocumentosService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.documento.findMany({
      include: { permisos: true, imagenes: true, creador: true },
      orderBy: { fechaActualizacion: 'desc' },
    });
  }

  async findOne(id: number) {
    const doc = await this.prisma.documento.findUnique({
      where: { id },
      include: { permisos: true, imagenes: true, creador: true },
    });
    if (!doc) throw new NotFoundException(`Documento ${id} no encontrado`);
    return doc;
  }

  async create(dto: CrearDocumentoDto) {
    const { personas, ...data } = dto;
    const doc = await this.prisma.documento.create({
      data: {
        ...data,
        permisos: personas?.length
          ? { create: personas.map((p) => ({ codigoColab: p.codigo_colab, tipo: p.tipo ?? 1 })) }
          : undefined,
      },
      include: { permisos: true, imagenes: true },
    });
    return doc;
  }

  async update(id: number, dto: ActualizarDocumentoDto) {
    await this.findOne(id);
    return this.prisma.documento.update({
      where: { id },
      data: dto,
      include: { permisos: true, imagenes: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.documento.delete({ where: { id } });
  }

  findTiposPermiso() {
    return this.prisma.tipoPermisoDocumento.findMany();
  }

  async findPermisos(id: number) {
    await this.findOne(id);
    return this.prisma.documentoPermiso.findMany({ where: { documentoId: id } });
  }

  async updatePermisos(id: number, dto: UpdatePermisosDto) {
    await this.findOne(id);
    await this.prisma.documentoPermiso.deleteMany({ where: { documentoId: id } });
    if (dto.personas.length > 0) {
      await this.prisma.documentoPermiso.createMany({
        data: dto.personas.map((p) => ({
          documentoId: id,
          codigoColab: p.codigo_colab,
          tipo: p.tipo,
        })),
      });
    }
    return this.prisma.documentoPermiso.findMany({ where: { documentoId: id } });
  }

  async subirImagen(id: number, file: Express.Multer.File) {
    await this.findOne(id);
    if (!file) throw new BadRequestException('No se recibió ningún archivo');
    const url = file.filename;
    await this.prisma.documentoImagen.create({
      data: { documentoId: id, url, nombre: file.originalname },
    });
    return { url };
  }

  async eliminarImagen(id: number, nombre: string) {
    await this.findOne(id);
    const img = await this.prisma.documentoImagen.findFirst({
      where: { documentoId: id, nombre },
    });
    if (!img) throw new NotFoundException(`Imagen ${nombre} no encontrada`);
    const filePath = join(process.cwd(), 'uploads', 'documentos', img.url);
    if (existsSync(filePath)) unlinkSync(filePath);
    await this.prisma.documentoImagen.delete({ where: { id: img.id } });
    return { message: 'Imagen eliminada' };
  }
}
