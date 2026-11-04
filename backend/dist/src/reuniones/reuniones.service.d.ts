import { PrismaService } from '../prisma/prisma.service';
import { CrearReunionDto } from './dto/crear-reunion.dto';
import { ActualizarReunionDto } from './dto/actualizar-reunion.dto';
import { AsistenciaReunionDto } from './dto/asistencia-reunion.dto';
import { ConvocadosReunionDto } from './dto/convocados-reunion.dto';
export declare class ReunionesService {
    private prisma;
    constructor(prisma: PrismaService);
    findMisReuniones(codigo?: string): import("@prisma/client").Prisma.PrismaPromise<({
        asistencias: {
            id: number;
            codigoColab: string;
            colaboradorNombre: string;
            colaboradorCedula: string;
            fechaRegistro: Date;
            horaRegistro: string;
            confirmacion: string;
            observacion: string | null;
            codigoReunion: string;
        }[];
        convocados: {
            nombre: string;
            id: number;
            codigoColab: string;
            codigoReunion: string;
        }[];
    } & {
        empresa: string;
        tipoReunion: number | null;
        codigo: string;
        estado: number;
        fecha: Date;
        tema: string;
        horaInicio: string;
        horaFin: string;
        tipoEvento: number | null;
        objetivo: string | null;
        conclusiones: string | null;
        lugar: number | null;
        anfitrion: string | null;
        lider: string | null;
        secretario: string | null;
    })[]>;
    findActivas(): import("@prisma/client").Prisma.PrismaPromise<({
        asistencias: {
            id: number;
            codigoColab: string;
            colaboradorNombre: string;
            colaboradorCedula: string;
            fechaRegistro: Date;
            horaRegistro: string;
            confirmacion: string;
            observacion: string | null;
            codigoReunion: string;
        }[];
        convocados: {
            nombre: string;
            id: number;
            codigoColab: string;
            codigoReunion: string;
        }[];
    } & {
        empresa: string;
        tipoReunion: number | null;
        codigo: string;
        estado: number;
        fecha: Date;
        tema: string;
        horaInicio: string;
        horaFin: string;
        tipoEvento: number | null;
        objetivo: string | null;
        conclusiones: string | null;
        lugar: number | null;
        anfitrion: string | null;
        lider: string | null;
        secretario: string | null;
    })[]>;
    findOne(codigo: string): Promise<{
        asistencias: {
            id: number;
            codigoColab: string;
            colaboradorNombre: string;
            colaboradorCedula: string;
            fechaRegistro: Date;
            horaRegistro: string;
            confirmacion: string;
            observacion: string | null;
            codigoReunion: string;
        }[];
        convocados: {
            nombre: string;
            id: number;
            codigoColab: string;
            codigoReunion: string;
        }[];
    } & {
        empresa: string;
        tipoReunion: number | null;
        codigo: string;
        estado: number;
        fecha: Date;
        tema: string;
        horaInicio: string;
        horaFin: string;
        tipoEvento: number | null;
        objetivo: string | null;
        conclusiones: string | null;
        lugar: number | null;
        anfitrion: string | null;
        lider: string | null;
        secretario: string | null;
    }>;
    create(dto: CrearReunionDto): Promise<{
        asistencias: {
            id: number;
            codigoColab: string;
            colaboradorNombre: string;
            colaboradorCedula: string;
            fechaRegistro: Date;
            horaRegistro: string;
            confirmacion: string;
            observacion: string | null;
            codigoReunion: string;
        }[];
        convocados: {
            nombre: string;
            id: number;
            codigoColab: string;
            codigoReunion: string;
        }[];
    } & {
        empresa: string;
        tipoReunion: number | null;
        codigo: string;
        estado: number;
        fecha: Date;
        tema: string;
        horaInicio: string;
        horaFin: string;
        tipoEvento: number | null;
        objetivo: string | null;
        conclusiones: string | null;
        lugar: number | null;
        anfitrion: string | null;
        lider: string | null;
        secretario: string | null;
    }>;
    update(codigo: string, dto: ActualizarReunionDto): Promise<{
        asistencias: {
            id: number;
            codigoColab: string;
            colaboradorNombre: string;
            colaboradorCedula: string;
            fechaRegistro: Date;
            horaRegistro: string;
            confirmacion: string;
            observacion: string | null;
            codigoReunion: string;
        }[];
        convocados: {
            nombre: string;
            id: number;
            codigoColab: string;
            codigoReunion: string;
        }[];
    } & {
        empresa: string;
        tipoReunion: number | null;
        codigo: string;
        estado: number;
        fecha: Date;
        tema: string;
        horaInicio: string;
        horaFin: string;
        tipoEvento: number | null;
        objetivo: string | null;
        conclusiones: string | null;
        lugar: number | null;
        anfitrion: string | null;
        lider: string | null;
        secretario: string | null;
    }>;
    registrarAsistencia(codigo: string, dto: AsistenciaReunionDto): Promise<{
        id: number;
        codigoColab: string;
        colaboradorNombre: string;
        colaboradorCedula: string;
        fechaRegistro: Date;
        horaRegistro: string;
        confirmacion: string;
        observacion: string | null;
        codigoReunion: string;
    }>;
    findAsistencia(codigo: string): Promise<{
        id: number;
        codigoColab: string;
        colaboradorNombre: string;
        colaboradorCedula: string;
        fechaRegistro: Date;
        horaRegistro: string;
        confirmacion: string;
        observacion: string | null;
        codigoReunion: string;
    }[]>;
    agregarConvocados(codigo: string, dto: ConvocadosReunionDto): Promise<{
        nombre: string;
        id: number;
        codigoColab: string;
        codigoReunion: string;
    }[]>;
    findTiposReunion(): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        id: number;
    }[]>;
    findLugares(empresa?: string): import("@prisma/client").Prisma.PrismaPromise<{
        empresa: string | null;
        nombre: string;
        id: number;
    }[]>;
    findProcesos(): import("@prisma/client").Prisma.PrismaPromise<{
        empresa: string;
        nombre: string;
        id: number;
    }[]>;
}
