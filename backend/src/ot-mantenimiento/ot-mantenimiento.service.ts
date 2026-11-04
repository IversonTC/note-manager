import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearOtDto } from './dto/crear-ot.dto';

@Injectable()
export class OtMantenimientoService {
  constructor(private prisma: PrismaService) {}

  findEmpresas() {
    return [
      { nit: 'NIT001', nombre: 'Empresa Mantenimiento 1' },
      { nit: 'NIT002', nombre: 'Empresa Mantenimiento 2' },
      { nit: 'NIT003', nombre: 'Empresa Mantenimiento 3' },
    ];
  }

  findAll() {
    return this.prisma.otMantenimiento.findMany({
      orderBy: { otFechaSolicitud: 'desc' },
    });
  }

  create(dto: CrearOtDto) {
    return this.prisma.otMantenimiento.create({ data: dto });
  }
}
