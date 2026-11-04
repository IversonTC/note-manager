import { EmpresasService } from './empresas.service';
export declare class EmpresasController {
    private readonly service;
    constructor(service: EmpresasService);
    findAll(): Promise<{
        data: {
            nombre: string;
            nit: string;
            logo: string | null;
            empresasUsuario: string | null;
        }[];
    }>;
    findByCedula(cedula: string): Promise<{
        data: {
            nombre: string;
            nit: string;
            logo: string | null;
            empresasUsuario: string | null;
        }[];
    }>;
    findOne(nit: string): Promise<{
        data: {
            nombre: string;
            nit: string;
            logo: string | null;
            empresasUsuario: string | null;
        };
    }>;
    findCentrosCosto(nit: string): Promise<{
        data: {
            nombre: string;
            id: string;
            empresaNit: string;
        }[];
    }>;
}
