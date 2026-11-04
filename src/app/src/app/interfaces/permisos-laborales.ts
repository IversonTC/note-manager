export interface TipoPermiso {
  codigo: string;
  nombre: string;
  descripcion?: string;
}

export interface TiempoCompensado {
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  horas_compensadas: number;
  observacion?: string;
}

export interface PermisoLaboral {
  consecutivo: number;
  codigo_colab: string;
  colaborador_nombre: string;
  fecha_salida: string;
  fecha_final: string;
  tipo_permiso: string;
  tipo_nombre?: string;
  duracion: number;
  compensado: 'S' | 'N';
  remunerado: 'S' | 'N';
  observacion?: string;
  remitir_autoriza?: string;
  firma_solicita: string | null;
  firma_autoriza: string | null;
  empresa?: string;
  tiempo_compensado?: TiempoCompensado[];
}

export interface CrearPermisoDto {
  codigo_colab: string;
  fecha_salida: string;
  tipo_permiso: string;
  duracion: number;
  compensado: 'S' | 'N';
  remunerado: 'S' | 'N';
  observacion?: string;
  fecha_final?: string;
  remitir_autoriza?: string;
  tiempo_compensado?: TiempoCompensado[];
}

export interface Colaborador {
  codigo: string;
  nombre: string;
  apellido?: string;
  rol?: number;
}
