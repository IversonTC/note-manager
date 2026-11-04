import { PrismaService } from '../prisma/prisma.service';
import { CrearOtDto } from './dto/crear-ot.dto';
export declare class OtMantenimientoService {
    private prisma;
    constructor(prisma: PrismaService);
    findEmpresas(): {
        nit: string;
        nombre: string;
    }[];
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        estado: string | null;
        otConsecutivo: number;
        otFechaSolicitud: Date;
        otEmpresa: string;
        otSolicitanteUbicacion: string;
        otSolicitanteDescripcion: string;
        eotNombre: string | null;
    }[]>;
    create(dto: CrearOtDto): import("@prisma/client").Prisma.Prisma__OtMantenimientoClient<{
        estado: string | null;
        otConsecutivo: number;
        otFechaSolicitud: Date;
        otEmpresa: string;
        otSolicitanteUbicacion: string;
        otSolicitanteDescripcion: string;
        eotNombre: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
