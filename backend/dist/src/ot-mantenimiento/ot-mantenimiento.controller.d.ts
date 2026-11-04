import { OtMantenimientoService } from './ot-mantenimiento.service';
import { CrearOtDto } from './dto/crear-ot.dto';
export declare class OtMantenimientoController {
    private readonly service;
    constructor(service: OtMantenimientoService);
    findEmpresas(): Promise<{
        data: {
            nit: string;
            nombre: string;
        }[];
    }>;
    findAll(): Promise<{
        data: {
            estado: string | null;
            otConsecutivo: number;
            otFechaSolicitud: Date;
            otEmpresa: string;
            otSolicitanteUbicacion: string;
            otSolicitanteDescripcion: string;
            eotNombre: string | null;
        }[];
    }>;
    create(dto: CrearOtDto): Promise<{
        data: {
            estado: string | null;
            otConsecutivo: number;
            otFechaSolicitud: Date;
            otEmpresa: string;
            otSolicitanteUbicacion: string;
            otSolicitanteDescripcion: string;
            eotNombre: string | null;
        };
    }>;
}
