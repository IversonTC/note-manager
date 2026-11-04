import { PermisosService } from './permisos.service';
import { CrearModuloDto } from './dto/crear-modulo.dto';
import { ActualizarModuloDto } from './dto/actualizar-modulo.dto';
import { CrearRolDto } from './dto/crear-rol.dto';
import { ModulosRolDto } from './dto/modulo-rol.dto';
import { ActualizarPermisosDto } from './dto/actualizar-permisos.dto';
export declare class PermisosController {
    private readonly service;
    constructor(service: PermisosService);
    findModulos(todos?: string): Promise<{
        data: {
            nombre: string;
            createdAt: Date;
            id: number;
            modulo: string;
            tipoModulo: number;
            enlace: string | null;
        }[];
    }>;
    createModulo(dto: CrearModuloDto): Promise<{
        data: {
            nombre: string;
            createdAt: Date;
            id: number;
            modulo: string;
            tipoModulo: number;
            enlace: string | null;
        };
    }>;
    updateModulo(id: number, dto: ActualizarModuloDto): Promise<{
        data: {
            nombre: string;
            createdAt: Date;
            id: number;
            modulo: string;
            tipoModulo: number;
            enlace: string | null;
        };
    }>;
    removeModulo(id: number): Promise<{
        data: {
            nombre: string;
            createdAt: Date;
            id: number;
            modulo: string;
            tipoModulo: number;
            enlace: string | null;
        };
    }>;
    findRoles(): Promise<{
        data: {
            nombre: string;
            createdAt: Date;
            idRol: number;
        }[];
    }>;
    createRol(dto: CrearRolDto): Promise<{
        data: {
            nombre: string;
            createdAt: Date;
            idRol: number;
        };
    }>;
    findOneRol(id: number): Promise<{
        data: {
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
        };
    }>;
    updateRolModulos(id: number, dto: ModulosRolDto): Promise<{
        data: {
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
        };
    }>;
    removeRol(id: number): Promise<{
        data: {
            nombre: string;
            createdAt: Date;
            idRol: number;
        };
    }>;
    findMisPermisos(codigo: string): Promise<{
        data: {
            empresa: string | null;
            codigo: string;
            id: number;
            modulo: string;
            nombreModulo: string;
            tipoPermiso: string;
        }[];
    }>;
    findPermisosColaborador(codigo: string): Promise<{
        data: {
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
        }[];
    }>;
    updatePermisosColaborador(codigo: string, dto: ActualizarPermisosDto): Promise<{
        data: {
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
        }[];
    }>;
    findAccesosColaborador(codigo: string): Promise<{
        data: {
            empresa: string;
            codigo: string;
            id: number;
            modulo: string;
            nombreModulo: string;
            tipoModulo: string;
            tipoPermiso: string;
        }[];
    }>;
}
