import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RangoFecha } from '../../../interfaces/dashboard';


interface Preset {
  key: string;
  label: string;
}

@Component({
  selector: 'app-filtro-fecha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtro-fecha.component.html',
})
export class FiltroDashboardComponent {
  @Input() cargando = false;
  @Input() presets: Preset[] = [
    { key: 'semana',    label: '7d' },
    { key: 'mes',       label: 'Mes' },
    { key: 'trimestre', label: 'Trim.' },
    { key: 'semestre',  label: 'Sem.' },
    { key: 'anio',      label: 'Año' },
    { key: 'todo',      label: 'Todo' },
  ];

  @Output() cambio = new EventEmitter<RangoFecha>();

  presetActivo = 'todo';
  desde = '';
  hasta = '';

  fmtFecha(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dia}`;
  }

  aplicarPreset(key: string): void {
    this.presetActivo = key;
    const hoy = new Date();

    switch (key) {
      case 'semana': {
        const d = new Date(hoy);
        d.setDate(hoy.getDate() - 6);
        this.desde = this.fmtFecha(d);
        this.hasta = this.fmtFecha(hoy);
        break;
      }
      case 'mes': {
        const d = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        this.desde = this.fmtFecha(d);
        this.hasta = this.fmtFecha(hoy);
        break;
      }
      case 'trimestre': {
        const d = new Date(hoy);
        d.setMonth(hoy.getMonth() - 3);
        this.desde = this.fmtFecha(d);
        this.hasta = this.fmtFecha(hoy);
        break;
      }
      case 'semestre': {
        const d = new Date(hoy);
        d.setMonth(hoy.getMonth() - 6);
        this.desde = this.fmtFecha(d);
        this.hasta = this.fmtFecha(hoy);
        break;
      }
      case 'anio': {
        const d = new Date(hoy.getFullYear(), 0, 1);
        this.desde = this.fmtFecha(d);
        this.hasta = this.fmtFecha(hoy);
        break;
      }
      case 'todo':
      default:
        this.desde = '';
        this.hasta = '';
        break;
    }

    this.cambio.emit({ desde: this.desde, hasta: this.hasta });
  }

  aplicarCustom(): void {
    if (this.desde && this.hasta) {
      this.presetActivo = '';
      this.cambio.emit({ desde: this.desde, hasta: this.hasta });
    }
  }
}
