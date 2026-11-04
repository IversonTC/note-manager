import { PrismaService } from '../prisma/prisma.service';
import { CrearTicketDto } from './dto/crear-ticket.dto';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';
import { RespuestaDto } from './dto/respuesta.dto';
import { ComentarioDto } from './dto/comentario.dto';
export declare class TicketsService {
    private prisma;
    constructor(prisma: PrismaService);
    findCategorias(): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        idCategoria: number;
    }[]>;
    findEstados(): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        color: string;
        idEstado: number;
    }[]>;
    findPrioridades(): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        color: string;
        idPrioridad: number;
    }[]>;
    findResumen(desde?: string, hasta?: string): import("@prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    findDashboardEvolucion(desde?: string, hasta?: string): import("@prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    findAll(estado_id?: number, prioridad_id?: number, categoria_id?: number, empresa?: string, usuario_codigo?: string, buscar?: string, pagina?: number, por_pagina?: number): import("@prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    findHistorial(empresa?: string, categoria_id?: number, buscar?: string, pagina?: number, por_pagina?: number): import("@prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    findOne(id: number): Promise<{
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
    }>;
    create(dto: CrearTicketDto): Promise<{
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
    }>;
    cambiarEstado(id: number, dto: CambiarEstadoDto): Promise<{
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
    }>;
    responder(id: number, dto: RespuestaDto): Promise<{
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
    }>;
    findComentarios(id: number): Promise<{
        fecha: Date;
        comentario: string;
        autorNombre: string;
        idComentario: number;
        ticketId: number;
        esInterno: boolean;
    }[]>;
    createComentario(id: number, dto: ComentarioDto): Promise<{
        fecha: Date;
        comentario: string;
        autorNombre: string;
        idComentario: number;
        ticketId: number;
        esInterno: boolean;
    }>;
}
