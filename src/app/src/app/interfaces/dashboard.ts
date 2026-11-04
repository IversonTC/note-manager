export interface BarraItem {
  label: string;
  valor: number;
  color?: string;
}

/** Nodo para el diagrama de barras con drill-down jerárquico */
export interface BarraJerarquica {
  label: string;
  valor: number;
  color?: string;
  /** Sub-nivel al hacer clic */
  hijos?: BarraJerarquica[];
  /** Ítems hoja (tickets, registros…) mostrados en la vista de detalle */
  detalle?: { label: string; descripcion?: string; color?: string }[];
}

export interface LineaPunto {
  label: string;
  valor: number;
}

export interface LineaSerie {
  nombre: string;
  color:  string;
  puntos: LineaPunto[];
}

export interface DonaSegmento {
  label: string;
  valor: number;
  color: string;
}

export interface RangoFecha {
  desde: string;  // YYYY-MM-DD or ''
  hasta: string;  // YYYY-MM-DD or ''
}

/** Un badge de estado dentro de una tarjeta de persona */
export interface PersonaBadge {
  label: string;
  valor: number;
  color: string;   // CSS color (hex, var(), etc.)
  icono: string;   // clase Font Awesome
}

/** Datos para una tarjeta de carga por persona */
export interface PersonaResumen {
  nombre:         string;
  iniciales:      string;
  total:          number;
  completadas:    number;   // cantidad usada para la barra de progreso
  pctCompletadas: number;   // 0-100
  badges:         PersonaBadge[];
}
