import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        data: {
            token: string;
            usuario: {
                codigo: string;
                cedula: string;
                nombre: string;
                correo: string;
                empresa: string | null;
                rol: string | null;
            };
        };
    }>;
    register(dto: RegisterDto): Promise<{
        data: {
            token: string;
            usuario: {
                codigo: string;
                cedula: string;
                nombre: string;
                correo: string;
                empresa: string | null;
                rol: string | null;
            };
        };
    }>;
}
