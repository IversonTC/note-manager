import { SgcService } from './sgc.service';
import { CrearAccionDto } from './dto/crear-accion.dto';
import { ActualizarAccionDto } from './dto/actualizar-accion.dto';
import { CrearPlanDto } from './dto/crear-plan.dto';
import { ActividadesDto } from './dto/actividades.dto';
import { CrearSeguimientoDto } from './dto/seguimiento.dto';
import { EncabezadoDto } from './dto/encabezado.dto';
export declare class SgcController {
    private readonly service;
    constructor(service: SgcService);
    findFormatos(): Promise<{
        data: {
            nombre: string;
            empresaNit: string | null;
            idFormato: number;
        }[];
    }>;
    findTiposAccion(): Promise<{
        data: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.AccionSgcGroupByOutputType, ("tipoAccion" | "nomTipo")[]> & {})[];
    }>;
    findOrigenesAccion(): Promise<{
        data: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.AccionSgcGroupByOutputType, ("origen" | "nomOrigen")[]> & {})[];
    }>;
    findEncabezado(empresa: string, formato: number): Promise<{
        data: {
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
        } | null;
    }>;
    findEncabezados(empresa: string): Promise<{
        data: {
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
        }[];
    }>;
    upsertEncabezado(dto: EncabezadoDto): Promise<{
        data: {
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
        };
    }>;
    findAcciones(empresa?: string, tipo_accion?: number, origen?: number, buscar?: string, pagina?: number, por_pagina?: number): Promise<{
        data: ({
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
        })[];
    }>;
    findOneAccion(consecutivo: number): Promise<{
        data: {
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
        };
    }>;
    createAccion(dto: CrearAccionDto): Promise<{
        data: {
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
        };
    }>;
    updateAccion(consecutivo: number, dto: ActualizarAccionDto): Promise<{
        data: {
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
        };
    }>;
    findActividades(consecutivo: number): Promise<{
        data: {
            id: number;
            accionConsecutivo: number;
            actividad: string;
            responsable: string | null;
            nomResponsable: string | null;
            fechaImplementacion: Date;
        }[];
    }>;
    updateActividades(consecutivo: number, dto: ActividadesDto): Promise<{
        data: {
            id: number;
            accionConsecutivo: number;
            actividad: string;
            responsable: string | null;
            nomResponsable: string | null;
            fechaImplementacion: Date;
        }[];
    }>;
    findSeguimientos(consecutivo: number): Promise<{
        data: {
            id: number;
            accionConsecutivo: number;
            actividad: string;
            nomResponsable: string;
            fechaSeguimiento: Date;
        }[];
    }>;
    createSeguimiento(consecutivo: number, dto: CrearSeguimientoDto): Promise<{
        data: {
            id: number;
            accionConsecutivo: number;
            actividad: string;
            nomResponsable: string;
            fechaSeguimiento: Date;
        };
    }>;
    findPlanMejoras(cerrado?: number, colaborador?: string, pagina?: number, por_pagina?: number): Promise<{
        data: {
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
        }[];
    }>;
    findOnePlanMejora(id: number): Promise<{
        data: {
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
        };
    }>;
    createPlanMejora(dto: CrearPlanDto): Promise<{
        data: {
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
        };
    }>;
    cerrarPlanMejora(id: number): Promise<{
        data: {
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
        };
    }>;
    findSeguimientosPlan(id: number): Promise<{
        data: {
            id: number;
            nomResponsable: string | null;
            fechaSeguimiento: Date;
            planId: number;
            seguimiento: string;
        }[];
    }>;
    createSeguimientoPlan(id: number, dto: CrearSeguimientoDto): Promise<{
        data: {
            id: number;
            nomResponsable: string | null;
            fechaSeguimiento: Date;
            planId: number;
            seguimiento: string;
        };
    }>;
}
