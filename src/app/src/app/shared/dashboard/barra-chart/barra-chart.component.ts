import { Component, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { BarraItem } from '../../../interfaces/dashboard';
import { ChartTooltipComponent, TooltipState, emptyTooltip } from '../chart-tooltip.component';

@Component({
  selector: 'app-barra-chart',
  standalone: true,
  imports: [CommonModule, DecimalPipe, ChartTooltipComponent],
  templateUrl: './barra-chart.component.html',
})
export class BarraChartComponent {
  @Input() titulo = '';
  @Input() icono = 'fa-solid fa-chart-bar';
  @Input() items: BarraItem[] = [];
  @Input() total: number | null = null;
  @Input() cargando = false;
  @Input() msgVacio = 'Sin datos';

  tooltip: TooltipState = emptyTooltip();
  containerW = 0;

  get totalEfectivo(): number {
    const t = this.total ?? this.items.reduce((s, i) => s + i.valor, 0);
    return t === 0 ? 1 : t;
  }

  get itemsOrdenados(): BarraItem[] {
    return [...this.items].sort((a, b) => b.valor - a.valor);
  }

  pct(valor: number): number {
    return Math.round((valor / this.totalEfectivo) * 1000) / 10;
  }

  onMove(e: MouseEvent): void {
    this.containerW = (e.currentTarget as HTMLElement).offsetWidth;
    this.tooltip.x  = e.clientX;
    this.tooltip.y  = e.clientY;
  }

  onBarHover(item: BarraItem): void {
    this.tooltip.visible = true;
    this.tooltip.titulo  = item.label;
    this.tooltip.lineas  = [
      { label: 'Cantidad', valor: item.valor.toLocaleString(), color: item.color ?? 'var(--color-primary)' },
      { label: 'Del total', valor: this.pct(item.valor) + '%' },
    ];
  }

  onLeave(): void { this.tooltip.visible = false; }

  skeletons = [1, 2, 3];
}
