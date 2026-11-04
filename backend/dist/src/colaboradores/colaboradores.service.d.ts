import { PrismaService } from '../prisma/prisma.service';
import { FiltrarColaboradoresDto } from './dto/filtrar-colaboradores.dto';
export declare class ColaboradoresService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(dto: FiltrarColaboradoresDto): Promise<{
        codigo: string;
        nombre: string;
    }[] | {
        status: string;
        data: {
            empresa: string | null;
            codigo: string;
            cedula: string;
            nombre: string;
        }[];
        last_page?: undefined;
        total?: undefined;
    } | {
        data: {
            empresa: string | null;
            centroCosto: string | null;
            codigo: string;
            cedula: string;
            correo: string;
            nombre: string;
            celular: string | null;
            password: string;
            estado: number;
            dependencia: string | null;
            cargo: string | null;
            rol: string | null;
            tipoContrato: string | null;
            fechaIngreso: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        last_page: number;
        total: number;
        status?: undefined;
    }>;
    findAccesos(codigo: string): Promise<{
        accesosModulos: {
            empresa: string;
            codigo: string;
            id: number;
            modulo: string;
            nombreModulo: string;
            tipoModulo: string;
            tipoPermiso: string;
        }[];
        accesosPermisos: {
            codigo: string;
            dependencia: string;
            id: number;
            idDependencia: number;
        }[];
        accesosHoras: {
            codigo: string;
            dependencia: string;
            id: number;
            idDependencia: number;
            registrar: boolean;
            autorizar: boolean;
        }[];
    }>;
}
