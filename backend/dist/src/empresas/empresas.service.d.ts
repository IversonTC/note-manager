import { PrismaService } from '../prisma/prisma.service';
export declare class EmpresasService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        nit: string;
        logo: string | null;
        empresasUsuario: string | null;
    }[]>;
    findOne(nit: string): Promise<{
        nombre: string;
        nit: string;
        logo: string | null;
        empresasUsuario: string | null;
    }>;
    findByCedula(cedula: string): Promise<{
        nombre: string;
        nit: string;
        logo: string | null;
        empresasUsuario: string | null;
    }[]>;
    findCentrosCosto(nit: string): Promise<{
        nombre: string;
        id: string;
        empresaNit: string;
    }[]>;
}
