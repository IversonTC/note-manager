import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnaTabla, AccionTabla } from '../../../interfaces/tabla';

@Component({
  selector: 'app-tabla-dinamica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tabla-dinamica.component.html',
})
export class TablaDinamicaComponent {

  hoverRow: any = null;

  // ─── Encabezado ───────────────────────────────
  @Input() titulo = '';
  @Input() subtitulo = '';

  /**
   * Variante visual de la tabla:
   *  'clasica'  — header con fondo primario, filas alternas (por defecto)
   *  'moderna'  — header suave, filas con hover de color, más redondeado
   *  'minima'   — sin background en header, solo líneas, muy limpia
   */
  @Input() variante: 'clasica' | 'moderna' | 'minima' = 'clasica';

  // ─── Datos ────────────────────────────────────
  @Input() columnas: ColumnaTabla[] = [];
  @Input() items: any[] = [];

  // ─── Acciones por fila ────────────────────────
  @Input() acciones: AccionTabla[] = [];

  // ─── Filtros ──────────────────────────────────
  @Input() search = '';
  @Input() filtrosSelect: {
    key: string;
    label: string;
    opciones: { valor: string; label: string }[];
    valor: string;
  }[] = [];

  @Input() filtrosMulti: {
    key:     string;
    label:   string;
    opciones: { valor: string; label: string; color?: string }[];
    valores: string[];
  }[] = [];

  // Controla qué dropdown multi está abierto
  multiAbierto: string | null = null;

  // ─── Paginación ───────────────────────────────
  @Input() paginaActual = 1;
  @Input() pageSize = 10;
  @Input() totalItems = 0;

  // ─── Estado ───────────────────────────────────
  @Input() cargando = false;
  @Input() msgVacio = 'No se encontraron registros';

  // ─── Eventos ──────────────────────────────────
  @Output() buscar    = new EventEmitter<string>();
  @Output() filtrosChange = new EventEmitter<any>();
  @Output() paginaChange  = new EventEmitter<number>();
  @Output() accion        = new EventEmitter<{ accion: string; item: any }>();

  // ─── Handlers ─────────────────────────────────
  onBuscarChange(): void {
    this.buscar.emit(this.search);
  }

  onFiltroSelectChange(): void {
    const filtros: any = {};
    this.filtrosSelect.forEach(f => (filtros[f.key] = f.valor));
    this.filtrosMulti.forEach(f  => (filtros[f.key] = f.valores));
    this.filtrosChange.emit(filtros);
  }

  toggleMultiOpcion(filtro: { key: string; valores: string[] }, valor: string): void {
    const idx = filtro.valores.indexOf(valor);
    if (idx >= 0) filtro.valores.splice(idx, 1);
    else          filtro.valores.push(valor);
    this.onFiltroSelectChange();
  }

  limpiarMulti(filtro: { valores: string[] }): void {
    filtro.valores.length = 0;
    this.onFiltroSelectChange();
  }

  toggleMultiDropdown(key: string): void {
    this.multiAbierto = this.multiAbierto === key ? null : key;
  }

  cerrarMultiDropdown(): void {
    this.multiAbierto = null;
  }

  labelMulti(filtro: { label: string; valores: string[] }): string {
    if (filtro.valores.length === 0) return 'Todos';
    if (filtro.valores.length === 1) return filtro.valores[0];
    return `${filtro.valores.length} seleccionados`;
  }

  irAPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaChange.emit(pagina);
  }

  emitirAccion(key: string, item: any): void {
    this.accion.emit({ accion: key, item });
  }

  accionVisible(accion: AccionTabla, item: any): boolean {
    return accion.visible ? accion.visible(item) : true;
  }

  // ─── Paginación ───────────────────────────────
  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get paginasVisibles(): number[] {
    const max = 5;
    let inicio = Math.max(1, this.paginaActual - Math.floor(max / 2));
    let fin = Math.min(this.totalPaginas, inicio + max - 1);
    inicio = Math.max(1, fin - max + 1);
    return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
  }

  get desde(): number { return (this.paginaActual - 1) * this.pageSize + 1; }
  get hasta(): number { return Math.min(this.paginaActual * this.pageSize, this.totalItems); }

  // ─── Formateo ─────────────────────────────────
  formatear(valor: any, tipo?: string): string {
    if (valor == null || valor === '') return '—';
    switch (tipo) {
      case 'moneda':  return '$' + Number(valor).toLocaleString('es-CO');
      case 'numero':  return Number(valor).toLocaleString('es-CO');
      case 'fecha':   return this.formatFecha(String(valor));
      default:        return String(valor);
    }
  }

  private formatFecha(fecha: string): string {
    try {
      return new Date(fecha).toLocaleDateString('es-CO', {
        year: 'numeric', month: 'short', day: 'numeric',
      });
    } catch { return fecha; }
  }

  badgeClasses(col: ColumnaTabla, valor: any): string {
    const config = col.badge?.[String(valor)];
    // Si tiene hexColor se aplica via badgeStyle(); aquí no se pone clase de color
    if (config?.hexColor) return '';
    const colorMap: Record<string, string> = {
      verde:    'bg-green-100 text-green-700',
      rojo:     'bg-red-100 text-red-600',
      amarillo: 'bg-yellow-100 text-yellow-700',
      azul:     'bg-blue-100 text-blue-700',
      gris:     'bg-gray-100 text-gray-600',
    };
    return colorMap[config?.color ?? 'gris'] ?? colorMap['gris'];
  }

  /** Estilo inline cuando el badge usa hexColor del backend */
  badgeStyle(col: ColumnaTabla, valor: any): string {
    const hex = col.badge?.[String(valor)]?.hexColor;
    if (!hex) return '';
    return `background:${hex};color:white`;
  }

  badgeBg(col: ColumnaTabla, valor: any): string {
    return col.badge?.[String(valor)]?.hexColor ?? '';
  }

  badgeFg(col: ColumnaTabla, valor: any): string {
    return col.badge?.[String(valor)]?.hexColor ? 'white' : '';
  }

  badgeLabel(col: ColumnaTabla, valor: any): string {
    const cfg = col.badge?.[String(valor)];
    if (cfg?.soloIcono) return '';
    return cfg?.label ?? String(valor);
  }

  badgeIcon(col: ColumnaTabla, valor: any): string {
    return col.badge?.[String(valor)]?.icon ?? '';
  }

  badgeSoloIcono(col: ColumnaTabla, valor: any): boolean {
    return col.badge?.[String(valor)]?.soloIcono ?? false;
  }

  badgeTitle(col: ColumnaTabla, valor: any): string {
    const cfg = col.badge?.[String(valor)];
    return cfg?.soloIcono ? (cfg.label ?? String(valor)) : '';
  }

  accionColorStyle(color?: string): string {
    if (!color || color === 'primary') return 'background:var(--color-primary);color:white';
    const map: Record<string, string> = {
      danger:  'background:#fee2e2;color:#dc2626',
      warning: 'background:#fef9c3;color:#ca8a04',
      success: 'background:#dcfce7;color:#16a34a',
    };
    return map[color] ?? map['danger'];
  }

  trackByIndex(index: number): number { return index; }

  get skeletonRows(): number[] { return Array.from({ length: this.pageSize }, (_, i) => i); }
  get tieneAcciones(): boolean { return this.acciones.length > 0; }

  // ─── Estilos por variante ──────────────────────
  get thStyle(): string {
    switch (this.variante) {
      // Header con tinte primario más visible + borde inferior de acento
      case 'moderna': return 'background:color-mix(in srgb,var(--color-primary) 12%,transparent);color:var(--color-primary)';
      case 'minima':  return 'background:transparent;color:var(--color-text)';
      // Clásica: fondo muy sutil, texto primario — se acopla a cualquier fondo
      default:        return 'background:color-mix(in srgb,var(--color-text) 4%,transparent);color:var(--color-primary)';
    }
  }

  get thClass(): string {
    const base = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap';
    switch (this.variante) {
      case 'minima': return base + ' opacity-40';
      default:       return base;
    }
  }

  rowStyle(odd: boolean, hover: boolean): string {
    if (hover) return 'background:color-mix(in srgb,var(--color-primary) 6%,transparent)';
    if (this.variante === 'clasica' && odd) return 'background:color-mix(in srgb,var(--color-text) 2.5%,transparent)';
    if (this.variante === 'moderna' && odd) return 'background:color-mix(in srgb,var(--color-primary) 3%,transparent)';
    return '';
  }
}
