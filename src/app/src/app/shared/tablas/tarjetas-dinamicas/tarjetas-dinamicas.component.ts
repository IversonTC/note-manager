import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tarjetas-dinamicas',
  imports: [CommonModule, FormsModule],
  templateUrl: './tarjetas-dinamicas.component.html',
})
export class TarjetasDinamicasComponent {
  @Input() items: any[] = [];
  @Input() config: any;
  @Input() totalItems = 0;
  @Input() paginaActual = 1;
  @Input() pageSize = 10;
  @Input() search = '';
  @Input() filtrosSelect: any[] = [];

  @Output() buscar = new EventEmitter();
  @Output() filtrosChange = new EventEmitter();
  @Output() paginaChange = new EventEmitter();
  @Output() accion = new EventEmitter<{ accion: string; item: any }>();

  ejecutarAccion(accion: string, item: any) {
    this.accion.emit({ accion, item });
  }

  // ── Estilo inline dinámico de botones usando CSS vars de la paleta ──
  getBtnStyle(color?: string): string {
    switch (color) {
      case 'primary':
        return 'background: var(--color-primary);';
      case 'warning':
        return 'background: #f59e0b;';
      case 'danger':
        return 'background: #ef4444;';
      default:
        return 'background: var(--color-secondary);';
    }
  }

  formatear(valor: any, tipo?: string): string {
    if (valor == null) return '';
    switch (tipo) {
      case 'moneda':
        return '$' + Number(valor).toLocaleString('es-CO');
      case 'numero':
        return Number(valor).toLocaleString('es-CO');
      default:
        return valor;
    }
  }

  emitirFiltro(key: string, valor: any) {
    this.filtrosChange.emit({ [key]: valor });
  }

  onBuscarChange() {
    this.buscar.emit(this.search);
  }

  irAPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaChange.emit(pagina);
  }

  // ════════════════════
  // 📄 PAGINACIÓN
  // ════════════════════
  get totalPaginas(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get paginasVisibles(): number[] {
    const max = 5;
    let inicio = Math.max(1, this.paginaActual - Math.floor(max / 2));
    let fin = inicio + max - 1;
    if (fin > this.totalPaginas) {
      fin = this.totalPaginas;
      inicio = Math.max(1, fin - max + 1);
    }
    return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
  }
}
