import { Injectable } from '@angular/core';

/**
 * Colores semánticos de estado — consistentes en todos los módulos.
 * La clave puede ser una subcadena del nombre del estado (coincidencia parcial, lowercase).
 */
const STATE_COLORS: [string, string][] = [
  ['pendiente',   '#f59e0b'],   // ámbar
  ['en espera',   '#f97316'],   // naranja
  ['en proceso',  '#3b82f6'],   // azul
  ['en revisión', '#8b5cf6'],   // morado
  ['revision',    '#8b5cf6'],
  ['en pruebas',  '#6366f1'],   // índigo
  ['prueba',      '#6366f1'],
  ['aprobado',    '#22c55e'],   // verde
  ['terminado',   '#16a34a'],   // verde oscuro
  ['completado',  '#16a34a'],
  ['resuelto',    '#22c55e'],   // verde
  ['cerrado',     '#6b7280'],   // gris
  ['cancelado',   '#6b7280'],   // gris
  ['rechazado',   '#ef4444'],   // rojo
  ['anulado',     '#ef4444'],
  ['vencido',     '#dc2626'],   // rojo oscuro
  ['critica',     '#dc2626'],
  ['crítica',     '#dc2626'],
  ['alta',        '#f97316'],   // naranja
  ['media',       '#f59e0b'],   // ámbar
  ['baja',        '#22c55e'],   // verde
];

/** Paleta de fallback cuando el estado no coincide con ninguno semántico */
const FALLBACK_PALETTE = [
  '#3b82f6', '#22c55e', '#f59e0b', '#ef4444',
  '#8b5cf6', '#f97316', '#06b6d4', '#ec4899',
  '#10b981', '#6366f1', '#84cc16', '#14b8a6',
];

@Injectable({ providedIn: 'root' })
export class ChartColorsService {

  /**
   * Devuelve el color semántico de un estado por nombre.
   * Búsqueda parcial, case-insensitive.
   * Retorna null si no hay coincidencia.
   */
  getStateColor(label: string): string | null {
    const key = label.toLowerCase().trim();
    for (const [pattern, color] of STATE_COLORS) {
      if (key.includes(pattern)) return color;
    }
    return null;
  }

  /**
   * Resuelve el color de un ítem con prioridades:
   * 1. Color semántico por nombre (siempre gana para estados conocidos — garantiza consistencia)
   * 2. `provided` si es un hex/color válido y no está vacío
   * 3. Color de la paleta de fallback por índice
   */
  resolve(label: string, provided?: string | null, index = 0): string {
    const semantic = this.getStateColor(label);
    if (semantic) return semantic;
    if (provided && provided.trim() && provided !== 'undefined' && provided !== 'null') {
      return provided.trim();
    }
    return FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
  }

  /**
   * Aplica colores resueltos a un array de ítems con `label` y `color?`.
   * Muta una copia — el original no se modifica.
   */
  applyColors<T extends { label: string; color?: string | null }>(items: T[]): (T & { color: string })[] {
    return items.map((item, i) => ({
      ...item,
      color: this.resolve(item.label, item.color, i),
    }));
  }
}
