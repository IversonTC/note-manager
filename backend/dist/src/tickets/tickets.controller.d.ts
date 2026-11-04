import { TicketsService } from './tickets.service';
import { CrearTicketDto } from './dto/crear-ticket.dto';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';
import { RespuestaDto } from './dto/respuesta.dto';
import { ComentarioDto } from './dto/comentario.dto';
export declare class TicketsController {
    private readonly service;
    constructor(service: TicketsService);
    findCategorias(): Promise<{
        data: {
            nombre: string;
            idCategoria: number;
        }[];
    }>;
    findEstados(): Promise<{
        data: {
            nombre: string;
            color: string;
            idEstado: number;
        }[];
    }>;
    findPrioridades(): Promise<{
        data: {
            nombre: string;
            color: string;
            idPrioridad: number;
        }[];
    }>;
    findResumen(desde?: string, hasta?: string): Promise<{
        data: {
            empresa: string;
            fechaCreacion: Date;
            usuarioCodigo: string | null;
            detalle: string;
            idTicket: number;
            numeroTicket: string;
            prioridadId: number;
            estadoId: number;
            categoriaId: number;
            usuarioNombre: string;
            fechaCierre: Date | null;
            horasResolucion: number | null;
        }[];
    }>;
    findDashboardEvolucion(desde?: string, hasta?: string): Promise<{
        data: {
            empresa: string;
            fechaCreacion: Date;
            usuarioCodigo: string | null;
            detalle: string;
            idTicket: number;
            numeroTicket: string;
            prioridadId: number;
            estadoId: number;
            categoriaId: number;
            usuarioNombre: string;
            fechaCierre: Date | null;
            horasResolucion: number | null;
        }[];
    }>;
    findAll(estado_id?: number, prioridad_id?: number, categoria_id?: number, empresa?: string, usuario_codigo?: string, buscar?: string, pagina?: number, por_pagina?: number): Promise<{
        data: {
            empresa: string;
            fechaCreacion: Date;
            usuarioCodigo: string | null;
            detalle: string;
            idTicket: number;
            numeroTicket: string;
            prioridadId: number;
            estadoId: number;
            categoriaId: number;
            usuarioNombre: string;
            fechaCierre: Date | null;
            horasResolucion: number | null;
        }[];
    }>;
    findHistorial(empresa?: string, categoria_id?: number, buscar?: string, pagina?: number, por_pagina?: number): Promise<{
        data: {
            empresa: string;
            fechaCreacion: Date;
            usuarioCodigo: string | null;
            detalle: string;
            idTicket: number;
            numeroTicket: string;
            prioridadId: number;
            estadoId: number;
            categoriaId: number;
            usuarioNombre: string;
            fechaCierre: Date | null;
            horasResolucion: number | null;
        }[];
    }>;
    findOne(id: number): Promise<{
        data: {
            comentarios: {
                fecha: Date;
                comentario: string;
                autorNombre: string;
                idComentario: number;
                ticketId: number;
                esInterno: boolean;
            }[];
        } & {
            empresa: string;
            fechaCreacion: Date;
            usuarioCodigo: string | null;
            detalle: string;
            idTicket: number;
            numeroTicket: string;
            prioridadId: number;
            estadoId: number;
            categoriaId: number;
            usuarioNombre: string;
            fechaCierre: Date | null;
            horasResolucion: number | null;
        };
    }>;
    create(dto: CrearTicketDto): Promise<{
        data: {
            empresa: string;
            fechaCreacion: Date;
            usuarioCodigo: string | null;
            detalle: string;
            idTicket: number;
            numeroTicket: string;
            prioridadId: number;
            estadoId: number;
            categoriaId: number;
            usuarioNombre: string;
            fechaCierre: Date | null;
            horasResolucion: number | null;
        };
    }>;
    cambiarEstado(id: number, dto: CambiarEstadoDto): Promise<{
        data: {
            comentarios: {
                fecha: Date;
                comentario: string;
                autorNombre: string;
                idComentario: number;
                ticketId: number;
                esInterno: boolean;
            }[];
        } & {
            empresa: string;
            fechaCreacion: Date;
            usuarioCodigo: string | null;
            detalle: string;
            idTicket: number;
            numeroTicket: string;
            prioridadId: number;
            estadoId: number;
            categoriaId: number;
            usuarioNombre: string;
            fechaCierre: Date | null;
            horasResolucion: number | null;
        };
    }>;
    responder(id: number, dto: RespuestaDto): Promise<{
        data: {
            comentarios: {
                fecha: Date;
                comentario: string;
                autorNombre: string;
                idComentario: number;
                ticketId: number;
                esInterno: boolean;
            }[];
        } & {
            empresa: string;
            fechaCreacion: Date;
            usuarioCodigo: string | null;
            detalle: string;
            idTicket: number;
            numeroTicket: string;
            prioridadId: number;
            estadoId: number;
            categoriaId: number;
            usuarioNombre: string;
            fechaCierre: Date | null;
            horasResolucion: number | null;
        };
    }>;
    findComentarios(id: number): Promise<{
        data: {
            fecha: Date;
            comentario: string;
            autorNombre: string;
            idComentario: number;
            ticketId: number;
            esInterno: boolean;
        }[];
    }>;
    createComentario(id: number, dto: ComentarioDto): Promise<{
        data: {
            fecha: Date;
            comentario: string;
            autorNombre: string;
            idComentario: number;
            ticketId: number;
            esInterno: boolean;
        };
    }>;
}
