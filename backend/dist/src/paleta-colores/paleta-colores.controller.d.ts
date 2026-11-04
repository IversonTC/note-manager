import { PaletaColoresService } from './paleta-colores.service';
export declare class PaletaColoresController {
    private readonly service;
    constructor(service: PaletaColoresService);
    findByEmpresa(empresa: string): Promise<{
        data: {
            primary_color: string;
            color_primario_hover: string;
            color_fondo: string;
            color_acento: string;
            color_secundario: string;
            color_texto: string;
            sidebar_bg: string;
            sidebar_text: string;
            navbar_bg: string;
            navbar_text: string;
            logo: string | null;
        };
    }>;
}
