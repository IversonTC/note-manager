import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarraItem, BarraJerarquica } from '../../../interfaces/dashboard';
import { ChartTooltipComponent, TooltipState, emptyTooltip } from '../chart-tooltip.component';

interface NivelPila {
  label: string;
  items: BarraJerarquica[];
}

@Component({
  selector: 'app-barras-verticales',
  standalone: true,
  imports: [CommonModule, ChartTooltipComponent],
  templateUrl: './barras-verticales.component.html',
})
export class BarrasVerticalesComponent {
  @Input() titulo   = '';
  @Input() icono    = 'fa-solid fa-chart-column';
  @Input() cargando = false;
  @Input() msgVacio = 'Sin datos';
  @Input() alto     = 180;

  /**
   * 'clasica'  — barras con guías, labels, porcentajes, drill-down completo
   * 'compacta' — barras más limpias, sin guías, solo valores encima (para 2×2, 3×2)
   * 'minima'   — solo las barras con colores, todo vía tooltip (para 2×1, 2×2 pequeño)
   */
  @Input() variante: 'clasica' | 'compacta' | 'minima' = 'clasica';

  /** Modo plano (sin drill-down) */
  @Input() items: BarraItem[] = [];

  /** Modo jerárquico (con drill-down) */
  @Input() set jerarquia(v: BarraJerarquica[]) {
    this._raiz = v;
    this.pila  = [];
    this.hoja  = null;
    this.animando = false;
  }

  /** Emite el nodo hoja cuando el usuario llega al último nivel */
  @Output() hojaSeleccionada = new EventEmitter<BarraJerarquica>();

  _raiz: BarraJerarquica[] = [];
  pila:  NivelPila[]       = [];   // historial de navegación
  hoja:  BarraJerarquica | null = null;  // nodo hoja seleccionado
  animando = false;

  // ── SVG ──────────────────────────────────────────────────────────────────
  readonly PADDING_L = 36;
  readonly PADDING_R = 12;
  readonly PADDING_T = 20;
  readonly PADDING_B = 44;
  readonly ANCHO_SVG = 600;

  get viewBox(): string { return `0 0 ${this.ANCHO_SVG} ${this.alto}`; }

  get altoPadded(): number { return this.alto - this.PADDING_T - this.PADDING_B; }

  get itemsMostrar(): BarraJerarquica[] {
    if (this._raiz.length) {
      return this.pila.length ? this.pila[this.pila.length - 1].items : this._raiz;
    }
    return this.items as BarraJerarquica[];
  }

  get modoJerarquico(): boolean { return this._raiz.length > 0; }

  get maxVal(): number {
    return Math.max(...this.itemsMostrar.map(i => i.valor), 1);
  }

  get anchoBarra(): number {
    const n = this.itemsMostrar.length || 1;
    const espacio = (this.ANCHO_SVG - this.PADDING_L - this.PADDING_R) / n;
    return Math.min(espacio * 0.55, 60);
  }

  barX(i: number): number {
    const n = this.itemsMostrar.length;
    const espacio = (this.ANCHO_SVG - this.PADDING_L - this.PADDING_R) / n;
    return this.PADDING_L + espacio * i + espacio / 2 - this.anchoBarra / 2;
  }
  barH(valor: number): number { return (valor / this.maxVal) * this.altoPadded; }
  barY(valor: number): number { return this.PADDING_T + this.altoPadded - this.barH(valor); }
  labelX(i: number): number   { return this.barX(i) + this.anchoBarra / 2; }

  get guias(): { y: number; label: string }[] {
    return [0, 0.25, 0.5, 0.75, 1].map(p => ({
      y: this.PADDING_T + this.altoPadded * (1 - p),
      label: Math.round(this.maxVal * p).toLocaleString(),
    }));
  }

  // ── Navegación ───────────────────────────────────────────────────────────
  navegar(item: BarraJerarquica): void {
    if (this.animando) return;

    if (item.hijos?.length) {
      this._transicion(() => {
        this.pila.push({ label: item.label, items: item.hijos! });
        this.hoja = null;
      });
      return;
    }

    if (this.modoJerarquico) {
      this.hoja = item;
      this.hojaSeleccionada.emit(item);
    }
  }

  irNivel(idx: number): void {
    if (this.animando) return;
    this._transicion(() => {
      this.pila = this.pila.slice(0, idx);
      this.hoja = null;
    });
  }

  retroceder(): void { this.irNivel(this.pila.length - 1); }

  private _transicion(fn: () => void): void {
    this.animando = true;
    setTimeout(() => {
      fn();
      this.animando = false;
    }, 200);
  }

  // ── Breadcrumb ───────────────────────────────────────────────────────────
  get breadcrumb(): { label: string; idx: number }[] {
    return [
      { label: 'Inicio', idx: -1 },
      ...this.pila.map((n, i) => ({ label: n.label, idx: i })),
    ];
  }

  skeletons = [1, 2, 3, 4, 5];

  // ── Tooltip ──────────────────────────────────────────────────────────────
  tooltip: TooltipState = emptyTooltip();
  containerW = 0;

  onSvgMove(e: MouseEvent): void {
    this.containerW = window.innerWidth;
    this.tooltip.x  = e.clientX;
    this.tooltip.y  = e.clientY;
  }

  onBarHover(item: BarraJerarquica | BarraItem): void {
    const pct = ((item.valor / (this.maxVal || 1)) * 100).toFixed(1);
    const tieneHijos = 'hijos' in item && !!item.hijos?.length;
    this.tooltip.visible = true;
    this.tooltip.titulo  = item.label;
    this.tooltip.lineas  = [
      { label: 'Cantidad',  valor: item.valor.toLocaleString(), color: item.color ?? 'var(--color-primary)' },
      { label: 'Del total', valor: pct + '%' },
      ...(tieneHijos ? [{ label: 'Acción', valor: 'Clic para desglosar' }] : []),
    ];
  }

  onLeave(): void { this.tooltip.visible = false; }
}
