import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
