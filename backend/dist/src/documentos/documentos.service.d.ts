import { PrismaService } from '../prisma/prisma.service';
import { CrearDocumentoDto } from './dto/crear-documento.dto';
import { ActualizarDocumentoDto } from './dto/actualizar-documento.dto';
import { UpdatePermisosDto } from './dto/update-permisos.dto';
export declare class DocumentosService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        permisos: {
            id: number;
            tipo: number;
            codigoColab: string;
            documentoId: number;
        }[];
        creador: {
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
        } | null;
        imagenes: {
            nombre: string;
            createdAt: Date;
            id: number;
            documentoId: number;
            url: string;
        }[];
    } & {
        empresa: string | null;
        id: number;
        titulo: string;
        contenido: string | null;
        categoria: string | null;
        publico: boolean;
        creadoPor: string | null;
        fechaCreacion: Date;
        fechaActualizacion: Date;
    })[]>;
    findOne(id: number): Promise<{
        permisos: {
            id: number;
            tipo: number;
            codigoColab: string;
            documentoId: number;
        }[];
        creador: {
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
        } | null;
        imagenes: {
            nombre: string;
            createdAt: Date;
            id: number;
            documentoId: number;
            url: string;
        }[];
    } & {
        empresa: string | null;
        id: number;
        titulo: string;
        contenido: string | null;
        categoria: string | null;
        publico: boolean;
        creadoPor: string | null;
        fechaCreacion: Date;
        fechaActualizacion: Date;
    }>;
    create(dto: CrearDocumentoDto): Promise<{
        permisos: {
            id: number;
            tipo: number;
            codigoColab: string;
            documentoId: number;
        }[];
        imagenes: {
            nombre: string;
            createdAt: Date;
            id: number;
            documentoId: number;
            url: string;
        }[];
    } & {
        empresa: string | null;
        id: number;
        titulo: string;
        contenido: string | null;
        categoria: string | null;
        publico: boolean;
        creadoPor: string | null;
        fechaCreacion: Date;
        fechaActualizacion: Date;
    }>;
    update(id: number, dto: ActualizarDocumentoDto): Promise<{
        permisos: {
            id: number;
            tipo: number;
            codigoColab: string;
            documentoId: number;
        }[];
        imagenes: {
            nombre: string;
            createdAt: Date;
            id: number;
            documentoId: number;
            url: string;
        }[];
    } & {
        empresa: string | null;
        id: number;
        titulo: string;
        contenido: string | null;
        categoria: string | null;
        publico: boolean;
        creadoPor: string | null;
        fechaCreacion: Date;
        fechaActualizacion: Date;
    }>;
    remove(id: number): Promise<{
        empresa: string | null;
        id: number;
        titulo: string;
        contenido: string | null;
        categoria: string | null;
        publico: boolean;
        creadoPor: string | null;
        fechaCreacion: Date;
        fechaActualizacion: Date;
    }>;
    findTiposPermiso(): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        id: number;
        ver: boolean;
        crear: boolean;
        actualizar: boolean;
        eliminar: boolean;
    }[]>;
    findPermisos(id: number): Promise<{
        id: number;
        tipo: number;
        codigoColab: string;
        documentoId: number;
    }[]>;
    updatePermisos(id: number, dto: UpdatePermisosDto): Promise<{
        id: number;
        tipo: number;
        codigoColab: string;
        documentoId: number;
    }[]>;
    subirImagen(id: number, file: Express.Multer.File): Promise<{
        url: string;
    }>;
    eliminarImagen(id: number, nombre: string): Promise<{
        message: string;
    }>;
}
