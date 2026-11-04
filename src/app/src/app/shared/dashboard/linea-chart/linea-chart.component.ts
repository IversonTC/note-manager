import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineaSerie } from '../../../interfaces/dashboard';
import { ChartTooltipComponent, TooltipState, emptyTooltip } from '../chart-tooltip.component';

@Component({
  selector: 'app-linea-chart',
  standalone: true,
  imports: [CommonModule, ChartTooltipComponent],
  templateUrl: './linea-chart.component.html',
})
export class LineaChartComponent {
  @Input() titulo = '';
  @Input() series: LineaSerie[] = [];
  @Input() cargando = false;
  @Input() msgVacio = 'Sin datos de evolución';
  @Input() alto = 160;

  /**
   * 'clasica'  — líneas + área rellena, leyenda arriba, grid lines, labels X (default)
   * 'compacta' — líneas sin área, chips de leyenda abajo, sin grid, con labels X
   * 'minima'   — sparklines puros: solo líneas, sin área, sin labels, sin leyenda
   */
  @Input() variante: 'clasica' | 'compacta' | 'minima' = 'clasica';

  tooltip: TooltipState = emptyTooltip();
  containerW = 0;

  get viewBox(): string { return `0 0 600 ${this.alto}`; }

  get maxVal(): number {
    let m = 0;
    for (const s of this.series)
      for (const p of s.puntos)
        if (p.valor > m) m = p.valor;
    return m < 1 ? 1 : m;
  }

  get numPuntos(): number { return this.series[0]?.puntos.length ?? 0; }

  pX(i: number): number {
    if (this.numPuntos <= 1) return 300;
    return 50 + (i / (this.numPuntos - 1)) * 500;
  }

  pY(val: number): number {
    return (this.alto - 30) - (val / this.maxVal) * (this.alto - 55);
  }

  polyline(serie: LineaSerie): string {
    return serie.puntos.map((p, i) => `${this.pX(i)},${this.pY(p.valor)}`).join(' ');
  }

  area(serie: LineaSerie): string {
    if (serie.puntos.length === 0) return '';
    const pts = serie.puntos.map((p, i) => `${this.pX(i)},${this.pY(p.valor)}`).join(' L ');
    const lastX = this.pX(serie.puntos.length - 1);
    const firstX = this.pX(0);
    return `M ${pts} L ${lastX},${this.alto - 30} L ${firstX},${this.alto - 30} Z`;
  }

  get labels(): { x: number; label: string }[] {
    return (this.series[0]?.puntos ?? []).map((p, i) => ({ x: this.pX(i), label: p.label }));
  }

  get gridLines(): number[] {
    return [0, 1, 2].map(i => this.pY((this.maxVal / 3) * (3 - i)));
  }

  firstSeriesY(i: number): number {
    return this.pY(this.series[0]?.puntos[i]?.valor ?? 0);
  }

  onSvgMove(e: MouseEvent): void {
    this.containerW = window.innerWidth;
    this.tooltip.x  = e.clientX;
    this.tooltip.y  = e.clientY;
  }

  onPuntoHover(idx: number, label: string): void {
    this.tooltip.visible = true;
    this.tooltip.titulo  = label;
    this.tooltip.lineas  = this.series.map(s => ({
      label: s.nombre,
      valor: (s.puntos[idx]?.valor ?? 0).toLocaleString(),
      color: s.color,
    }));
  }

  onLeave(): void { this.tooltip.visible = false; }
}
