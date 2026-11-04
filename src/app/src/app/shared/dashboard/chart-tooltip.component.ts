import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TooltipLinea {
  label: string;
  valor: string;
  color?: string;
}

export interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  titulo: string;
  lineas: TooltipLinea[];
}

export function emptyTooltip(): TooltipState {
  return { visible: false, x: 0, y: 0, titulo: '', lineas: [] };
}

@Component({
  selector: 'app-chart-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (state.visible) {
      <div class="fixed z-[9999] pointer-events-none rounded-xl px-3 py-2.5 text-xs shadow-xl"
           style="background:var(--color-bg-sidebar);
                  border:1px solid color-mix(in srgb,var(--color-primary) 25%,transparent);
                  backdrop-filter:blur(8px);
                  min-width:120px;
                  max-width:220px;"
           [style.left.px]="adjustX"
           [style.top.px]="adjustY">
        @if (state.titulo) {
          <p class="font-bold mb-1.5 truncate" style="color:var(--color-text)">
            {{ state.titulo }}
          </p>
        }
        @for (l of state.lineas; track l.label) {
          <div class="flex items-center gap-1.5 py-0.5">
            @if (l.color) {
              <span class="w-2 h-2 rounded-full shrink-0"
                    [style.background]="l.color"></span>
            }
            <span class="truncate"
                  style="color:color-mix(in srgb,var(--color-text) 55%,transparent)">
              {{ l.label }}
            </span>
            <span class="ml-auto font-semibold tabular-nums pl-2"
                  style="color:var(--color-text)">
              {{ l.valor }}
            </span>
          </div>
        }
      </div>
    }
  `,
})
export class ChartTooltipComponent {
  @Input() state: TooltipState = emptyTooltip();
  /** Ancho del contenedor padre (para evitar que el tooltip se salga por la derecha) */
  @Input() containerW = 0;

  get adjustX(): number {
    const w = 220;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    return this.state.x + w + 16 > vw ? this.state.x - w - 16 : this.state.x + 14;
  }

  get adjustY(): number {
    return Math.max(4, this.state.y - 8);
  }
}
