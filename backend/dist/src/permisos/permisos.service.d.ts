import { PrismaService } from '../prisma/prisma.service';
import { CrearModuloDto } from './dto/crear-modulo.dto';
import { ActualizarModuloDto } from './dto/actualizar-modulo.dto';
import { CrearRolDto } from './dto/crear-rol.dto';
import { ModulosRolDto } from './dto/modulo-rol.dto';
import { ActualizarPermisosDto } from './dto/actualizar-permisos.dto';
export declare class PermisosService {
    private prisma;
    constructor(prisma: PrismaService);
    findModulos(todos?: string): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        createdAt: Date;
        id: number;
        modulo: string;
        tipoModulo: number;
        enlace: string | null;
    }[]>;
    createModulo(dto: CrearModuloDto): Promise<{
        nombre: string;
        createdAt: Date;
        id: number;
        modulo: string;
        tipoModulo: number;
        enlace: string | null;
    }>;
    updateModulo(id: number, dto: ActualizarModuloDto): Promise<{
        nombre: string;
        createdAt: Date;
        id: number;
        modulo: string;
        tipoModulo: number;
        enlace: string | null;
    }>;
    removeModulo(id: number): Promise<{
        nombre: string;
        createdAt: Date;
        id: number;
        modulo: string;
        tipoModulo: number;
        enlace: string | null;
    }>;
    findRoles(): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        createdAt: Date;
        idRol: number;
    }[]>;
    createRol(dto: CrearRolDto): Promise<{
        nombre: string;
        createdAt: Date;
        idRol: number;
    }>;
    findOneRol(id: number): Promise<{
        rolesModulos: {
            id: number;
            modulo: string;
            rolId: number;
            puedeVer: boolean;
            puedeCrear: boolean;
            puedeEditar: boolean;
            puedeEliminar: boolean;
        }[];
    } & {
        nombre: string;
        createdAt: Date;
        idRol: number;
    }>;
    updateRolModulos(id: number, dto: ModulosRolDto): Promise<{
        rolesModulos: {
            id: number;
            modulo: string;
            rolId: number;
            puedeVer: boolean;
            puedeCrear: boolean;
            puedeEditar: boolean;
            puedeEliminar: boolean;
        }[];
    } & {
        nombre: string;
        createdAt: Date;
        idRol: number;
    }>;
    removeRol(id: number): Promise<{
        nombre: string;
        createdAt: Date;
        idRol: number;
    }>;
    findMisPermisos(codigo: string): import("@prisma/client").Prisma.PrismaPromise<{
        empresa: string | null;
        codigo: string;
        id: number;
        modulo: string;
        nombreModulo: string;
        tipoPermiso: string;
    }[]>;
    findPermisosColaborador(codigo: string): import("@prisma/client").Prisma.PrismaPromise<{
        empresa: string;
        codigo: string;
        nombre: string;
        id: number;
        tipo: number;
        ver: boolean;
        crear: boolean;
        actualizar: boolean;
        eliminar: boolean;
        modulo: string;
        nombreTipo: string;
    }[]>;
    updatePermisosColaborador(codigo: string, dto: ActualizarPermisosDto): Promise<{
        empresa: string;
        codigo: string;
        nombre: string;
        id: number;
        tipo: number;
        ver: boolean;
        crear: boolean;
        actualizar: boolean;
        eliminar: boolean;
        modulo: string;
        nombreTipo: string;
    }[]>;
    findAccesosColaborador(codigo: string): Promise<{
        empresa: string;
        codigo: string;
        id: number;
        modulo: string;
        nombreModulo: string;
        tipoModulo: string;
        tipoPermiso: string;
    }[]>;
}
