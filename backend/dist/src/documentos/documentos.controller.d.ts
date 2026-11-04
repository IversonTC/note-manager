import { DocumentosService } from './documentos.service';
import { CrearDocumentoDto } from './dto/crear-documento.dto';
import { ActualizarDocumentoDto } from './dto/actualizar-documento.dto';
import { UpdatePermisosDto } from './dto/update-permisos.dto';
export declare class DocumentosController {
    private readonly service;
    constructor(service: DocumentosService);
    findAll(): Promise<{
        data: ({
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
        })[];
    }>;
    findTiposPermiso(): Promise<{
        data: {
            nombre: string;
            id: number;
            ver: boolean;
            crear: boolean;
            actualizar: boolean;
            eliminar: boolean;
        }[];
    }>;
    findOne(id: number): Promise<{
        data: {
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
        };
    }>;
    create(dto: CrearDocumentoDto): Promise<{
        data: {
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
        };
    }>;
    update(id: number, dto: ActualizarDocumentoDto): Promise<{
        data: {
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
        };
    }>;
    remove(id: number): Promise<{
        data: {
            empresa: string | null;
            id: number;
            titulo: string;
            contenido: string | null;
            categoria: string | null;
            publico: boolean;
            creadoPor: string | null;
            fechaCreacion: Date;
            fechaActualizacion: Date;
        };
    }>;
    findPermisos(id: number): Promise<{
        data: {
            id: number;
            tipo: number;
            codigoColab: string;
            documentoId: number;
        }[];
    }>;
    updatePermisos(id: number, dto: UpdatePermisosDto): Promise<{
        data: {
            id: number;
            tipo: number;
            codigoColab: string;
            documentoId: number;
        }[];
    }>;
    subirImagen(id: number, file: Express.Multer.File): Promise<{
        data: {
            url: string;
        };
    }>;
    eliminarImagen(id: number, nombre: string): Promise<{
        data: {
            message: string;
        };
    }>;
}
