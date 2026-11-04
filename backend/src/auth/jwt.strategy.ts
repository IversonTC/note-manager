import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'note-manager-jwt-secret',
    });
  }

  async validate(payload: { codigo: string }) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { codigo: payload.codigo },
    });

    if (!usuario) {
      throw new UnauthorizedException();
    }

    return {
      codigo: usuario.codigo,
      cedula: usuario.cedula,
      nombre: usuario.nombre,
      correo: usuario.correo,
      empresa: usuario.empresa,
      rol: usuario.rol,
    };
  }
}
