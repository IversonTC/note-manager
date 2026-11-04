declare class PersonaPermiso {
    codigo_colab: string;
    tipo?: number;
}
export declare class CrearDocumentoDto {
    titulo: string;
    contenido?: string;
    categoria?: string;
    publico?: boolean;
    personas?: PersonaPermiso[];
}
export {};
