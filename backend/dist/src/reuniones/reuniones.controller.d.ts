import { ReunionesService } from './reuniones.service';
import { CrearReunionDto } from './dto/crear-reunion.dto';
import { ActualizarReunionDto } from './dto/actualizar-reunion.dto';
import { AsistenciaReunionDto } from './dto/asistencia-reunion.dto';
import { ConvocadosReunionDto } from './dto/convocados-reunion.dto';
export declare class ReunionesController {
    private readonly service;
    constructor(service: ReunionesService);
    findMisReuniones(codigo?: string): Promise<{
        data: ({
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
        })[];
    }>;
    findActivas(): Promise<{
        data: ({
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
        })[];
    }>;
    findTiposReunion(): Promise<{
        data: {
            nombre: string;
            id: number;
        }[];
    }>;
    findLugares(empresa?: string): Promise<{
        data: {
            empresa: string | null;
            nombre: string;
            id: number;
        }[];
    }>;
    findProcesos(): Promise<{
        data: {
            empresa: string;
            nombre: string;
            id: number;
        }[];
    }>;
    findOne(codigo: string): Promise<{
        data: {
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
        };
    }>;
    create(dto: CrearReunionDto): Promise<{
        data: {
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
        };
    }>;
    update(codigo: string, dto: ActualizarReunionDto): Promise<{
        data: {
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
        };
    }>;
    registrarAsistencia(codigo: string, dto: AsistenciaReunionDto): Promise<{
        data: {
            id: number;
            codigoColab: string;
            colaboradorNombre: string;
            colaboradorCedula: string;
            fechaRegistro: Date;
            horaRegistro: string;
            confirmacion: string;
            observacion: string | null;
            codigoReunion: string;
        };
    }>;
    findAsistencia(codigo: string): Promise<{
        data: {
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
    }>;
    agregarConvocados(codigo: string, dto: ConvocadosReunionDto): Promise<{
        data: {
            nombre: string;
            id: number;
            codigoColab: string;
            codigoReunion: string;
        }[];
    }>;
}
