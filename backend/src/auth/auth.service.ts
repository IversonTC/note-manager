import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { cedula: dto.cedula },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValid = await bcrypt.compare(dto.password, usuario.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      codigo: usuario.codigo,
      cedula: usuario.cedula,
      nombre: usuario.nombre,
      correo: usuario.correo,
      empresa: usuario.empresa,
      rol: usuario.rol,
    };

    return {
      data: {
        token: this.jwtService.sign(payload),
        usuario: payload,
      },
    };
  }

  async register(dto: RegisterDto) {
    const existingCedula = await this.prisma.usuario.findUnique({
      where: { cedula: dto.cedula },
    });
    if (existingCedula) {
      throw new ConflictException('La cédula ya está registrada');
    }

    const existingCorreo = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
    });
    if (existingCorreo) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        cedula: dto.cedula,
        nombre: dto.nombre,
        correo: dto.correo,
        celular: dto.celular,
        password: hashedPassword,
        dependencia: dto.dependencia,
        centroCosto: dto.centroCosto,
        cargo: dto.cargo,
        empresa: dto.empresa,
        rol: dto.rol,
        tipoContrato: dto.tipoContrato,
        fechaIngreso: dto.fechaIngreso ? new Date(dto.fechaIngreso) : undefined,
      },
    });

    const payload = {
      codigo: usuario.codigo,
      cedula: usuario.cedula,
      nombre: usuario.nombre,
      correo: usuario.correo,
      empresa: usuario.empresa,
      rol: usuario.rol,
    };

    return {
      data: {
        token: this.jwtService.sign(payload),
        usuario: payload,
      },
    };
  }
}
