// ─────────────────────────────────────────────────────────────────────────────
// Dominio del módulo de Tareas (estilo Trello / Jira)
// ─────────────────────────────────────────────────────────────────────────────

export type TareaPrioridad = 'baja' | 'media' | 'alta' | 'critica';
export type TareaOrigen    = 'manual' | 'compromiso' | 'reunion' | 'sistema';

/** Mapa de prioridades a etiqueta + color (usar como fallback en UI). */
export const PRIORIDADES_TAREA: Record<TareaPrioridad, { label: string; color: string }> = {
  baja:    { label: 'Baja',     color: '#22c55e' },
  media:   { label: 'Media',    color: '#3b82f6' },
  alta:    { label: 'Alta',     color: '#f59e0b' },
  critica: { label: 'Crítica',  color: '#ef4444' },
};

// ── Tableros ─────────────────────────────────────────────────────────────────

export interface Tablero {
  id:                number;
  nombre:            string;
  descripcion?:      string;
  color?:            string;
  icono?:            string;
  visibilidad?:      'privado' | 'equipo' | 'publico';
  equipo_id?:        number | null;
  propietario?:      string;
  propietario_nombre?: string;
  total_tareas?:     number;
  total_columnas?:   number;
  total_miembros?:   number;
  fecha_creacion?:   string;
  fecha_actualizacion?: string;
}

export interface ColumnaTablero {
  id:        number;
  tablero_id: number;
  nombre:    string;
  color?:    string;
  posicion:  number;
  /** Solo en vista kanban. */
  tareas?:   Tarea[];
}

export interface EtiquetaTablero {
  id:        number;
  tablero_id: number;
  nombre:    string;
  color:     string;
}

export interface MiembroTablero {
  codigo:    string;
  nombre:    string;
  rol?:      'admin' | 'editor' | 'lector';
  avatar?:   string;
  empresa?:  string;
}

export interface KanbanData {
  tablero:   Tablero;
  columnas:  ColumnaTablero[];
  etiquetas: EtiquetaTablero[];
  miembros:  MiembroTablero[];
}

// ── Tareas ───────────────────────────────────────────────────────────────────

export interface Tarea {
  id:               number;
  tablero_id:       number;
  columna_id:       number;
  titulo:           string;
  descripcion?:     string;
  prioridad:        TareaPrioridad;
  posicion?:        number;
  fecha_inicio?:    string | null;
  fecha_vencimiento?: string | null;
  fecha_completada?: string | null;
  origen?:          TareaOrigen;
  reunion_id?:      string | null;
  creado_por?:      string;
  creado_por_nombre?: string;
  fecha_creacion?:  string;
  fecha_actualizacion?: string;
  // Relaciones (presentes según endpoint)
  asignados?:       AsignadoTarea[];
  etiquetas?:       EtiquetaTablero[];
  comentarios?:     ComentarioTarea[];
  checklists?:      ChecklistTarea[];
  archivos?:        ArchivoTarea[];
  recordatorios?:   RecordatorioTarea[];
  // Contadores rápidos para tarjeta kanban
  total_comentarios?: number;
  total_checklist_total?: number;
  total_checklist_completados?: number;
  total_archivos?:  number;
  vencida?:         boolean;
}

export interface AsignadoTarea {
  codigo:  string;
  nombre:  string;
  avatar?: string;
  fecha_asignacion?: string;
}

export interface ComentarioTarea {
  id:           number;
  tarea_id:     number;
  autor_codigo: string;
  autor_nombre: string;
  comentario:   string;
  fecha:        string;
  editado?:     boolean;
}

export interface ChecklistTarea {
  id:         number;
  tarea_id:   number;
  titulo:     string;
  posicion?:  number;
  items:      ChecklistItem[];
  total?:     number;
  completados?: number;
}

export interface ChecklistItem {
  id:          number;
  checklist_id: number;
  texto:       string;
  completado:  boolean;
  posicion?:   number;
  completado_por?: string;
  fecha_completado?: string | null;
}

export interface ArchivoTarea {
  id:             number;
  tarea_id:       number;
  nombre:         string;
  nombre_original?: string;
  url:            string;
  tamanio?:       number;
  mime?:          string;
  subido_por?:    string;
  subido_por_nombre?: string;
  fecha_subida?:  string;
}

export interface RecordatorioTarea {
  id:         number;
  tarea_id:   number;
  fecha:      string;
  mensaje?:   string;
  notificado?: boolean;
}

export interface HistorialTarea {
  id:        number;
  tarea_id:  number;
  accion:    string;
  detalle?:  string;
  autor_codigo: string;
  autor_nombre: string;
  fecha:     string;
}

export type AuditoriaAccion =
  | 'creada'
  | 'campo_editado'
  | 'prioridad_cambiada'
  | 'estado_cambiado'
  | 'archivada'
  | 'asignado_agregado'
  | 'asignado_eliminado'
  | 'comentario_agregado'
  | 'archivo_adjunto';

export interface AuditoriaItem {
  id:              number;
  tarea_id:        number;
  usuario_codigo:  string;
  usuario_nombre:  string;
  accion:          AuditoriaAccion;
  campo?:          string | null;
  valor_anterior?: string | null;
  valor_nuevo?:    string | null;
  descripcion?:    string | null;
  ip?:             string | null;
  created_at:      string;
}

// ── Equipos ──────────────────────────────────────────────────────────────────

export interface Equipo {
  id:           number;
  nombre:       string;
  descripcion?: string;
  color?:       string;
  total_miembros?: number;
  propietario?: string;
  fecha_creacion?: string;
}

export interface MiembroEquipo {
  codigo:  string;
  nombre:  string;
  rol?:    'admin' | 'miembro';
  empresa?: string;
}

// ── Filtros & DTOs ───────────────────────────────────────────────────────────

export interface FiltrosTareas {
  tablero_id?:  number;
  asignado?:    string;
  prioridad?:   TareaPrioridad;
  buscar?:      string;
  vencidas?:    boolean;
  reunion_id?:  string;
  columna_id?:  number;
}

export interface DashboardTareas {
  total:        number;
  pendientes:   number;
  en_proceso:   number;
  completadas:  number;
  vencidas:     number;
  proximas:     Tarea[];
  asignadas:    Tarea[];
}

export interface CrearTableroDto {
  nombre:              string;
  descripcion?:        string;
  color?:              string;
  icono?:              string;
  visibilidad?:        'privado' | 'equipo' | 'publico';
  equipo_id?:          number | null;
  miembros_iniciales?: string[];
}

export interface CrearTareaDto {
  tablero_id:        number;
  columna_id:        number;
  titulo:            string;
  descripcion?:      string;
  prioridad?:        TareaPrioridad;
  fecha_inicio?:     string;
  fecha_vencimiento?: string;
  reunion_id?:       string;
  origen?:           TareaOrigen;
  asignados?:        string[];
  etiquetas?:        number[];
}

// ── Notificaciones de tareas ──────────────────────────────────────────────────

export type NotificacionTareaTipo = 'asignacion_tarea' | 'miembro_tablero';

export interface NotificacionTarea {
  id:                number;
  tipo:              NotificacionTareaTipo;
  para_codigo:       string;
  de_codigo:         string;
  de_nombre:         string;
  referencia_id:     number;
  referencia_titulo: string;
  leida:             boolean;
  fecha_creacion:    string;
}
