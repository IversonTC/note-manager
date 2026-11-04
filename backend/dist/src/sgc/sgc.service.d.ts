import { PrismaService } from '../prisma/prisma.service';
import { CrearAccionDto } from './dto/crear-accion.dto';
import { ActualizarAccionDto } from './dto/actualizar-accion.dto';
import { CrearPlanDto } from './dto/crear-plan.dto';
import { ActividadesDto } from './dto/actividades.dto';
import { CrearSeguimientoDto } from './dto/seguimiento.dto';
import { EncabezadoDto } from './dto/encabezado.dto';
export declare class SgcService {
    private prisma;
    constructor(prisma: PrismaService);
    findFormatos(): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        empresaNit: string | null;
        idFormato: number;
    }[]>;
    findTiposAccion(): import("@prisma/client").Prisma.GetAccionSgcGroupByPayload<{
        by: ("tipoAccion" | "nomTipo")[];
    }>;
    findOrigenesAccion(): import("@prisma/client").Prisma.GetAccionSgcGroupByPayload<{
        by: ("origen" | "nomOrigen")[];
    }>;
    findEncabezado(empresa: string, formato: number): import("@prisma/client").Prisma.Prisma__EncabezadoSgcClient<{
        empresa: string;
        id: number;
        icono: string | null;
        formato: number;
        sgcTitulo1: string;
        sgcTitulo2: string;
        sgcTitulo3: string;
        sgcCodigo: string;
        sgcVersion: string;
        sgcFecha: string;
        nomEmpresa: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findEncabezados(empresa: string): import("@prisma/client").Prisma.PrismaPromise<{
        empresa: string;
        id: number;
        icono: string | null;
        formato: number;
        sgcTitulo1: string;
        sgcTitulo2: string;
        sgcTitulo3: string;
        sgcCodigo: string;
        sgcVersion: string;
        sgcFecha: string;
        nomEmpresa: string;
    }[]>;
    upsertEncabezado(dto: EncabezadoDto): Promise<{
        empresa: string;
        id: number;
        icono: string | null;
        formato: number;
        sgcTitulo1: string;
        sgcTitulo2: string;
        sgcTitulo3: string;
        sgcCodigo: string;
        sgcVersion: string;
        sgcFecha: string;
        nomEmpresa: string;
    }>;
    findAcciones(empresa?: string, tipo_accion?: number, origen?: number, buscar?: string, pagina?: number, por_pagina?: number): import("@prisma/client").Prisma.PrismaPromise<({
        actividades: {
            id: number;
            accionConsecutivo: number;
            actividad: string;
            responsable: string | null;
            nomResponsable: string | null;
            fechaImplementacion: Date;
        }[];
        seguimientos: {
            id: number;
            accionConsecutivo: number;
            actividad: string;
            nomResponsable: string;
            fechaSeguimiento: Date;
        }[];
    } & {
        empresa: string;
        createdAt: Date;
        descripcion: string;
        origen: number | null;
        consecutivo: number;
        numero: number;
        tipoAccion: number | null;
        nomTipo: string;
        nomOrigen: string;
        analisis: string | null;
        evidencia: string | null;
        fechaDeteccion: Date;
        nomRegistradoPor: string | null;
    })[]>;
    findOneAccion(consecutivo: number): Promise<{
        actividades: {
            id: number;
            accionConsecutivo: number;
            actividad: string;
            responsable: string | null;
            nomResponsable: string | null;
            fechaImplementacion: Date;
        }[];
        seguimientos: {
            id: number;
            accionConsecutivo: number;
            actividad: string;
            nomResponsable: string;
            fechaSeguimiento: Date;
        }[];
    } & {
        empresa: string;
        createdAt: Date;
        descripcion: string;
        origen: number | null;
        consecutivo: number;
        numero: number;
        tipoAccion: number | null;
        nomTipo: string;
        nomOrigen: string;
        analisis: string | null;
        evidencia: string | null;
        fechaDeteccion: Date;
        nomRegistradoPor: string | null;
    }>;
    createAccion(dto: CrearAccionDto): Promise<{
        actividades: {
            id: number;
            accionConsecutivo: number;
            actividad: string;
            responsable: string | null;
            nomResponsable: string | null;
            fechaImplementacion: Date;
        }[];
        seguimientos: {
            id: number;
            accionConsecutivo: number;
            actividad: string;
            nomResponsable: string;
            fechaSeguimiento: Date;
        }[];
    } & {
        empresa: string;
        createdAt: Date;
        descripcion: string;
        origen: number | null;
        consecutivo: number;
        numero: number;
        tipoAccion: number | null;
        nomTipo: string;
        nomOrigen: string;
        analisis: string | null;
        evidencia: string | null;
        fechaDeteccion: Date;
        nomRegistradoPor: string | null;
    }>;
    updateAccion(consecutivo: number, dto: ActualizarAccionDto): Promise<{
        actividades: {
            id: number;
            accionConsecutivo: number;
            actividad: string;
            responsable: string | null;
            nomResponsable: string | null;
            fechaImplementacion: Date;
        }[];
        seguimientos: {
            id: number;
            accionConsecutivo: number;
            actividad: string;
            nomResponsable: string;
            fechaSeguimiento: Date;
        }[];
    } & {
        empresa: string;
        createdAt: Date;
        descripcion: string;
        origen: number | null;
        consecutivo: number;
        numero: number;
        tipoAccion: number | null;
        nomTipo: string;
        nomOrigen: string;
        analisis: string | null;
        evidencia: string | null;
        fechaDeteccion: Date;
        nomRegistradoPor: string | null;
    }>;
    findActividades(consecutivo: number): Promise<{
        id: number;
        accionConsecutivo: number;
        actividad: string;
        responsable: string | null;
        nomResponsable: string | null;
        fechaImplementacion: Date;
    }[]>;
    updateActividades(consecutivo: number, dto: ActividadesDto): Promise<{
        id: number;
        accionConsecutivo: number;
        actividad: string;
        responsable: string | null;
        nomResponsable: string | null;
        fechaImplementacion: Date;
    }[]>;
    findSeguimientos(consecutivo: number): Promise<{
        id: number;
        accionConsecutivo: number;
        actividad: string;
        nomResponsable: string;
        fechaSeguimiento: Date;
    }[]>;
    createSeguimiento(consecutivo: number, dto: CrearSeguimientoDto): Promise<{
        id: number;
        accionConsecutivo: number;
        actividad: string;
        nomResponsable: string;
        fechaSeguimiento: Date;
    }>;
    findPlanMejoras(cerrado?: number, colaborador?: string, pagina?: number, por_pagina?: number): import("@prisma/client").Prisma.PrismaPromise<{
        empresa: string;
        createdAt: Date;
        id: number;
        optNombrePropuesta: string;
        optDescripcion: string | null;
        optImportancia: string | null;
        optPosibleMejora: string | null;
        optFechaSeguimiento: Date | null;
        optPasos: string | null;
        aliado: string | null;
        nomAliado: string | null;
        tiempo: string | null;
        valorHora: string | null;
        optConclusion: string | null;
        cerrado: number;
    }[]>;
    findOnePlanMejora(id: number): Promise<{
        seguimientos: {
            id: number;
            nomResponsable: string | null;
            fechaSeguimiento: Date;
            planId: number;
            seguimiento: string;
        }[];
    } & {
        empresa: string;
        createdAt: Date;
        id: number;
        optNombrePropuesta: string;
        optDescripcion: string | null;
        optImportancia: string | null;
        optPosibleMejora: string | null;
        optFechaSeguimiento: Date | null;
        optPasos: string | null;
        aliado: string | null;
        nomAliado: string | null;
        tiempo: string | null;
        valorHora: string | null;
        optConclusion: string | null;
        cerrado: number;
    }>;
    createPlanMejora(dto: CrearPlanDto): Promise<{
        seguimientos: {
            id: number;
            nomResponsable: string | null;
            fechaSeguimiento: Date;
            planId: number;
            seguimiento: string;
        }[];
    } & {
        empresa: string;
        createdAt: Date;
        id: number;
        optNombrePropuesta: string;
        optDescripcion: string | null;
        optImportancia: string | null;
        optPosibleMejora: string | null;
        optFechaSeguimiento: Date | null;
        optPasos: string | null;
        aliado: string | null;
        nomAliado: string | null;
        tiempo: string | null;
        valorHora: string | null;
        optConclusion: string | null;
        cerrado: number;
    }>;
    cerrarPlanMejora(id: number): Promise<{
        empresa: string;
        createdAt: Date;
        id: number;
        optNombrePropuesta: string;
        optDescripcion: string | null;
        optImportancia: string | null;
        optPosibleMejora: string | null;
        optFechaSeguimiento: Date | null;
        optPasos: string | null;
        aliado: string | null;
        nomAliado: string | null;
        tiempo: string | null;
        valorHora: string | null;
        optConclusion: string | null;
        cerrado: number;
    }>;
    findSeguimientosPlan(id: number): Promise<{
        id: number;
        nomResponsable: string | null;
        fechaSeguimiento: Date;
        planId: number;
        seguimiento: string;
    }[]>;
    createSeguimientoPlan(id: number, dto: CrearSeguimientoDto): Promise<{
        id: number;
        nomResponsable: string | null;
        fechaSeguimiento: Date;
        planId: number;
        seguimiento: string;
    }>;
}
