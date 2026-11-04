// ── Módulos ────────────────────────────────────────────────────────
// Shape real de GET /modulos?todos=1 — la clave es el código string `modulo`,
// no un id numérico (no existe `id_modulo` en la respuesta del backend).
export interface ModuloApi {
  modulo: string;
  nombre: string;
  tipo_modulo: number;
  enlace?: string | null;
}

// Módulo dentro de un rol (incluye flags CRUD)
export interface ModuloRol extends ModuloApi {
  puede_ver: 0 | 1;
  puede_crear: 0 | 1;
  puede_editar: 0 | 1;
  puede_eliminar: 0 | 1;
}

// ── Roles ──────────────────────────────────────────────────────────
export interface RolApi {
  id_rol: number;
  nombre: string;
  total_colaboradores?: number;
}

export interface RolDetalle extends RolApi {
  modulos: ModuloRol[];
}

// ── Permisos de colaborador ────────────────────────────────────────
// Shape real de GET /permisos/mis-permisos y GET /colaboradores/{codigo}/permisos
// (misma estructura segmentada en ambos). Ninguno de los dos trae `ruta` ni `id_modulo`
// — la clave es siempre el código string `modulo`.

// ⚠️ Los flags llegan como número 1/0 (a veces string "1"/"0") — usar == 1 (loose)
export interface MiPermiso {
  modulo:         string;          // Código único, ej: 'ACT', 'ALI', 'noticias'…
  nombre:         string;
  puede_ver:      number | string; // 1 | 0  (o "1" | "0")
  puede_crear:    number | string;
  puede_editar:   number | string;
  puede_eliminar: number | string;
}

// Permiso asignado explícitamente (con nivel y empresa) — nombres de flag
// distintos a MiPermiso (ver/crear/actualizar/eliminar en vez de puede_*).
export interface PermisoAsignado {
  modulo:      string;
  nombre:      string;
  tipo:        number;
  nombre_tipo: string;
  ver:         0 | 1;
  crear:       0 | 1;
  actualizar:  0 | 1;
  eliminar:    0 | 1;
  empresa:     string;
}

export interface PermisosColaborador {
  codigo:     string;
  efectivos:  MiPermiso[];        // todos los módulos con flags CRUD ya resueltos
  asignados:  PermisoAsignado[];  // solo los asignados explícitamente, con tipo/empresa
}

// ── Accesos por empresa (multi-empresa) ───────────────────────────
export interface UsuarioAcceso {
  cedula: string;
  nombre: string;
  empresa: string;
  rol?: string;
  empresas: string[];
}

// ── Accesos de colaborador (permisos laborales / horas extras / módulos) ──
// Shape real de GET /accesos/mis-accesos y GET /colaboradores/{codigo}/accesos
// (misma estructura segmentada en ambos).
export interface AccesoPermisoLaboral {
  id_dependencia: number;
  dependencia:    string;
}

export interface AccesoHoraExtra {
  id_dependencia: number;
  dependencia:    string;
  registrar:      0 | 1;
  autorizar:      0 | 1;
}

export interface AccesoModulo {
  modulo:        string;
  nombre_modulo: string;
  tipo_modulo:   string;
  tipo_permiso:  string;
  empresa:       string;
}

export interface AccesosColaborador {
  codigo:             string;
  permisos_laborales: AccesoPermisoLaboral[];
  horas_extras:       AccesoHoraExtra[];
  modulos:            AccesoModulo[];
}

// ── Helper para inicializar flags vacíos ──────────────────────────
export function flagsVacios(): Pick<ModuloRol, 'puede_ver' | 'puede_crear' | 'puede_editar' | 'puede_eliminar'> {
  return { puede_ver: 0, puede_crear: 0, puede_editar: 0, puede_eliminar: 0 };
}
