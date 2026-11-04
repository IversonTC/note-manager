export type TipoColumna = 'texto' | 'numero' | 'moneda' | 'fecha' | 'badge' | 'roles-array';

export interface BadgeConfig {
  /**
   * Mapa valor → configuración de badge.
   * - `label`     texto visible (omitir si solo se quiere ícono)
   * - `color`     paleta predefinida
   * - `icon`      clase FontAwesome (ej. 'fa-solid fa-clock')
   * - `soloIcono` oculta el label y muestra solo el ícono (con title para accesibilidad)
   */
  [valor: string]: {
    label?:     string;
    color:      'verde' | 'rojo' | 'amarillo' | 'azul' | 'gris';
    icon?:      string;
    soloIcono?: boolean;
    /** Color hex directo del backend (ej. '#ef4444'). Cuando está presente,
     *  se usa como fondo sólido con texto blanco en lugar de las clases Tailwind. */
    hexColor?:  string;
  };
}

export interface ColumnaTabla {
  key: string;
  label: string;
  tipo?: TipoColumna;
  truncate?: boolean;
  /** Solo cuando tipo = 'badge' */
  badge?: BadgeConfig;
  /** Alineación de la celda */
  align?: 'left' | 'center' | 'right';
}

export interface AccionTabla {
  key: string;
  label: string;
  icon: string;
  /** 'primary' usa var(--color-primary), resto son colores tailwind */
  color?: 'primary' | 'danger' | 'warning' | 'success';
  /** Función para ocultar la acción según el item */
  visible?: (item: any) => boolean;
}

export interface CampoTarjeta {
  label: string;
  key: string;
  icon?: string;
  tipo?: TipoColumna;
  truncate?: boolean;
}

export interface ConfigTarjetaMovil {
  titulo: { key: string; icon: string; };
  subtitulo?: { key: string; icon: string; tipo?: string; };
  campos: { key: string; label: string; icon?: string; tipo?: string; }[];
  acciones?: AccionTabla[];
  colorClase?: (item: any) => string;
}

