import { PermisosLaboralesService } from './permisos-laborales.service';
import { CrearPermisoLaboralDto } from './dto/crear-permiso-laboral.dto';
import { FirmarPermisoDto } from './dto/firmar-permiso.dto';
export declare class PermisosLaboralesController {
    private readonly service;
    constructor(service: PermisosLaboralesService);
    findTipos(): Promise<{
        data: {
            codigo: string;
            nombre: string;
            descripcion: string | null;
        }[];
    }>;
    create(dto: CrearPermisoLaboralDto): Promise<{
        data: {
            empresa: string | null;
            createdAt: Date;
            codigoColab: string;
            tipoPermiso: string;
            colaboradorNombre: string;
            observacion: string | null;
            fechaSalida: Date;
            fechaFinal: Date;
            tipoNombre: string | null;
            duracion: number;
            compensado: string;
            remunerado: string;
            remitirAutoriza: string | null;
            firmaSolicita: string | null;
            firmaAutoriza: string | null;
            consecutivo: number;
        };
    }>;
    findPendientesFirmar(): Promise<{
        data: {
            empresa: string | null;
            createdAt: Date;
            codigoColab: string;
            tipoPermiso: string;
            colaboradorNombre: string;
            observacion: string | null;
            fechaSalida: Date;
            fechaFinal: Date;
            tipoNombre: string | null;
            duracion: number;
            compensado: string;
            remunerado: string;
            remitirAutoriza: string | null;
            firmaSolicita: string | null;
            firmaAutoriza: string | null;
            consecutivo: number;
        }[];
    }>;
    findPendientesAutorizar(): Promise<{
        data: {
            empresa: string | null;
            createdAt: Date;
            codigoColab: string;
            tipoPermiso: string;
            colaboradorNombre: string;
            observacion: string | null;
            fechaSalida: Date;
            fechaFinal: Date;
            tipoNombre: string | null;
            duracion: number;
            compensado: string;
            remunerado: string;
            remitirAutoriza: string | null;
            firmaSolicita: string | null;
            firmaAutoriza: string | null;
            consecutivo: number;
        }[];
    }>;
    firmar(consecutivo: number, dto: FirmarPermisoDto): Promise<{
        data: {
            empresa: string | null;
            createdAt: Date;
            codigoColab: string;
            tipoPermiso: string;
            colaboradorNombre: string;
            observacion: string | null;
            fechaSalida: Date;
            fechaFinal: Date;
            tipoNombre: string | null;
            duracion: number;
            compensado: string;
            remunerado: string;
            remitirAutoriza: string | null;
            firmaSolicita: string | null;
            firmaAutoriza: string | null;
            consecutivo: number;
        };
    }>;
    findHistorial(empresa?: string, fecha_inicio?: string, fecha_fin?: string): Promise<{
        data: {
            empresa: string | null;
            createdAt: Date;
            codigoColab: string;
            tipoPermiso: string;
            colaboradorNombre: string;
            observacion: string | null;
            fechaSalida: Date;
            fechaFinal: Date;
            tipoNombre: string | null;
            duracion: number;
            compensado: string;
            remunerado: string;
            remitirAutoriza: string | null;
            firmaSolicita: string | null;
            firmaAutoriza: string | null;
            consecutivo: number;
        }[];
    }>;
    generarPdf(consecutivo: number): Promise<{
        data: {
            url: string;
        };
    }>;
}
