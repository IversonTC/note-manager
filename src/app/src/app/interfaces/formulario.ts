export interface FormularioConfig {
  titulo: string;
  subtitulo?: string;

  campos: CampoFormulario[];
}

export interface CampoFormulario {
  campo?: string;
  label?: string;

  tipo:
    | 'input'
    | 'select'
    | 'multi-select'
    | 'modal-select'
    | 'search-select'
    | 'boton-accion'
    | 'textarea'
    | 'checkbox'
    | 'radio'
    | 'date'
    | 'file'
    | 'imagen'
    | 'grupo';

  textoBoton?: string;
  icono?: string;

  inputType?: string;

  obligatorio?: boolean;

  caracterMin?: number;
  caracterMax?: number;

  validar?: 'number' | 'no-number' | 'celular' | 'email' | 'fecha';

  colSpan?: number;

  opciones?: SelectOption[];

  accept?: string;

  apiConfig?: {
    servicio: string;
    metodo: string;
    /**
     * Método alterno para búsqueda remota (recibe el texto tecleado y retorna
     * SelectOption[] ya filtrado desde el backend). Úsalo cuando el catálogo
     * completo supera el límite de página del endpoint normal — evita que el
     * buscador del select solo filtre los primeros N registros cargados.
     */
    metodoBusqueda?: string;
  };

  camposHijos?: CampoFormulario[];
}

export interface SelectOption {
  value: string | number | Record<string, any>;
  label: string;
}
