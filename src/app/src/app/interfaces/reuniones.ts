export interface Reunion {
  codigo: string;
  tema: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  empresa: string;
  empresa_nombre?: string;
  tipo_evento?: number;
  tipo_evento_nombre?: string;
  tipo_reunion?: number;
  tipo_reunion_nombre?: string;
  num_convocados?: number;
  num_asistentes?: number;
  porcentaje_asistencia?: number; // calculado en frontend
  objetivo?: string;
  conclusiones?: string;
  lugar?: number;
  lugar_nombre?: string;
  anfitrion?: string;
  anfitrion_nombre?: string;
  lider?: string;
  lider_nombre?: string;
  secretario?: string;
  secretario_nombre?: string;
  tieneEvaluacion?: number; // 0 o 1
  estado?: number; // 1=Activa, 2=Finalizada, 3=Cancelada
  estado_label?: string; // resuelto en frontend
  roles?: RolReunion[]; // array del backend
  roles_texto?: string; // calculado en frontend para mostrar en tabla
}

export interface RolReunion {
  tipo: string;
  codigo: string;
  nombre: string;
}

export interface AsistenciaReunion {
  id: number;
  codigo_reunion: string;
  codigo_colab: string;
  colaborador_nombre: string;
  colaborador_cedula: string;
  fechaRegistro: string;
  horaRegistro: string;
  confirmacion: 'S' | 'N';
  observacion?: string;
}

export interface TipoReunion {
  id: number;
  nombre: string;
}

export interface LugarReunion {
  id: number;
  nombre: string;
  empresa?: string;
}

export interface ProcesoReunion {
  empresa: string;
  id: number;
  nombre: string;
}

export interface CrearReunionDto {
  tema: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  tipo_evento: number | null;
  anfitrion: string;
  empresa: string;
  instructor?: string;
  fecha_limite_respuesta?: string;
  empresa_formato?: string;
  costo_base?: number | null;
  requiere_evaluacion?: string;
  objetivo?: string;
  lugar?: number | null;
  empresa_ubicacion?: string;
  tipo_reunion?: number | null;
  proceso?: number | null;
  lider?: string;
  secretario?: string;
  observador?: string;
  controlador_tiempo?: string;
  conclusiones?: string;
}
