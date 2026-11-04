// ── Tipos base ────────────────────────────────────────────────────────────────

export type RecordatorioTipo       = 'temporal' | 'recurrente';
export type RecordatorioFrecuencia = 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'personalizado';
export type RecordatorioEstado     = 'pendiente' | 'completado' | 'vencido';
export type RecordatorioAlcance    = 'personal' | 'grupal';

export type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

export const DIAS_SEMANA: { key: DiaSemana; label: string; short: string }[] = [
  { key: 'lunes',     label: 'Lunes',     short: 'L'  },
  { key: 'martes',    label: 'Martes',    short: 'M'  },
  { key: 'miercoles', label: 'Miércoles', short: 'Mi' },
  { key: 'jueves',    label: 'Jueves',    short: 'J'  },
  { key: 'viernes',   label: 'Viernes',   short: 'V'  },
  { key: 'sabado',    label: 'Sábado',    short: 'S'  },
  { key: 'domingo',   label: 'Domingo',   short: 'D'  },
];

export const FRECUENCIAS: { key: RecordatorioFrecuencia; label: string; icon: string }[] = [
  { key: 'diario',        label: 'Diario',        icon: 'fa-solid fa-sun'            },
  { key: 'semanal',       label: 'Semanal',       icon: 'fa-solid fa-calendar-week'  },
  { key: 'quincenal',     label: 'Quincenal',     icon: 'fa-solid fa-calendar-days'  },
  { key: 'mensual',       label: 'Mensual',       icon: 'fa-solid fa-calendar'       },
  { key: 'personalizado', label: 'Personalizado', icon: 'fa-solid fa-sliders'        },
];

// ── Interfaces principales ────────────────────────────────────────────────────

export interface Recordatorio {
  id:               number;
  titulo:           string;
  descripcion?:     string | null;
  tipo:             RecordatorioTipo;
  alcance:          RecordatorioAlcance;
  estado:           RecordatorioEstado;

  // Configuración temporal (tipo = 'temporal')
  fecha_unica?:     string | null;   // YYYY-MM-DD
  hora:             string;          // HH:mm

  // Configuración recurrente (tipo = 'recurrente')
  frecuencia?:      RecordatorioFrecuencia | null;
  dias_semana?:     DiaSemana[] | null;    // Para frecuencia = 'semanal'
  dia_mes?:         number | null;         // Para frecuencia = 'mensual' (1-31)
  intervalo_dias?:  number | null;         // Para frecuencia = 'personalizado'

  // Vigencia
  fecha_inicio?:    string | null;
  fecha_fin?:       string | null;
  sin_fecha_fin:    boolean;

  // Destinatarios (alcance = 'grupal')
  destinatarios?:   DestinatarioRecordatorio[];

  // Creador
  creado_por:       string;
  creado_por_nombre: string;

  // Seguimiento
  fecha_creacion:   string;
  proxima_ejecucion?: string | null;
  ultima_ejecucion?:  string | null;
  total_ejecuciones:  number;
}

export interface DestinatarioRecordatorio {
  codigo:  string;
  nombre:  string;
  empresa: string;
  leido:   boolean;
}

export interface NotificacionRecordatorio {
  id:               number;
  recordatorio_id:  number;
  titulo:           string;
  descripcion?:     string | null;
  fecha_ejecucion:  string;
  leida:            boolean;
  completada:       boolean;
}

// ── DTOs ─────────────────────────────────────────────────────────────────────

export interface CrearRecordatorioDto {
  titulo:           string;
  descripcion?:     string;
  tipo:             RecordatorioTipo;
  alcance:          RecordatorioAlcance;
  hora:             string;

  // Temporal
  fecha_unica?:     string;

  // Recurrente
  frecuencia?:      RecordatorioFrecuencia;
  dias_semana?:     DiaSemana[];
  dia_mes?:         number;
  intervalo_dias?:  number;

  // Vigencia
  fecha_inicio?:    string;
  fecha_fin?:       string;
  sin_fecha_fin?:   boolean;

  // Destinatarios
  destinatarios?:   string[];  // Códigos
}

// ── Estado del formulario (UI) ────────────────────────────────────────────────

export interface FormRecordatorio {
  titulo:          string;
  descripcion:     string;
  tipo:            RecordatorioTipo;
  alcance:         RecordatorioAlcance;
  hora:            string;

  // Temporal
  fecha_unica:     string;

  // Recurrente
  frecuencia:      RecordatorioFrecuencia;
  dias_semana:     DiaSemana[];
  dia_mes:         number;
  intervalo_dias:  number;

  // Vigencia
  fecha_inicio:    string;
  fecha_fin:       string;
  sin_fecha_fin:   boolean;

  // Destinatarios
  destinatarios:   string[];
}

export const FORM_RECORDATORIO_VACIO: FormRecordatorio = {
  titulo:         '',
  descripcion:    '',
  tipo:           'temporal',
  alcance:        'personal',
  hora:           '08:00',
  fecha_unica:    '',
  frecuencia:     'semanal',
  dias_semana:    [],
  dia_mes:        1,
  intervalo_dias: 1,
  fecha_inicio:   '',
  fecha_fin:      '',
  sin_fecha_fin:  true,
  destinatarios:  [],
};
