import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareasService } from '../../services/tareas.service';
import { Tarea, TareaPrioridad } from '../../interfaces/tareas';

interface DiaCalendario { fecha: Date | null; tareas: Tarea[]; }

/**
 * Calendario mensual de vencimientos, reutilizable en la vista general de
 * Tableros (todas las tareas) y dentro de cada tablero individual (solo las
 * suyas). El padre solo pasa `tareas` — este componente filtra, arma la
 * grilla y gestiona su propio modal de detalle.
 */
@Component({
  selector: 'app-cronograma',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cronograma.component.html',
})
export class CronogramaComponent implements OnInit, OnChanges {
  private svc = inject(TareasService);

  @Input() tareas: Tarea[] = [];
  /** Oculta el botón "Ver en el tablero" cuando ya se está dentro de ese tablero. */
  @Input() mostrarBotonTablero = true;

  @Output() irATablero = new EventEmitter<number>();
  @Output() tareaActualizada = new EventEmitter<Tarea>();

  viewDate = new Date();
  tareasConFecha: Tarea[] = [];
  tareasFiltradas: Tarea[] = [];
  diasDelMes: DiaCalendario[] = [];

  buscar = '';
  prioridadFiltro: TareaPrioridad | '' = '';
  mesSeleccionado = new Date().getMonth();
  anioSeleccionado = new Date().getFullYear();

  readonly meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  readonly anios = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
  readonly prioridades: { value: TareaPrioridad; label: string }[] = [
    { value: 'baja',    label: 'Baja'    },
    { value: 'media',   label: 'Media'   },
    { value: 'alta',    label: 'Alta'    },
    { value: 'critica', label: 'Crítica' },
  ];

  modalAbierto = false;
  tareaSeleccionada: Tarea | null = null;
  actualizando = false;

  ngOnInit(): void {
    // Red de seguridad: garantiza que la grilla se construya en el primer render
    // aunque, por el orden de creación del componente (mount vía @if + getter
    // como [tareas]), ngOnChanges no llegue a disparar antes del primer pintado.
    this.tareasConFecha = (this.tareas ?? []).filter(t => !!t.fecha_vencimiento);
    this.aplicarFiltros();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tareas'] && !changes['tareas'].isFirstChange()) {
      this.tareasConFecha = (this.tareas ?? []).filter(t => !!t.fecha_vencimiento);
      this.aplicarFiltros();
    }
  }

  aplicarFiltros(): void {
    const termino = this.buscar.trim().toLowerCase();
    this.tareasFiltradas = this.tareasConFecha.filter(t => {
      const coincidePrioridad = !this.prioridadFiltro || t.prioridad === this.prioridadFiltro;
      const coincideBusqueda  = !termino
        || t.titulo?.toLowerCase().includes(termino)
        || (t.descripcion ?? '').toLowerCase().includes(termino);
      return coincidePrioridad && coincideBusqueda;
    });
    this.generarCalendario();
  }

  private generarCalendario(): void {
    const anio = this.viewDate.getFullYear();
    const mes  = this.viewDate.getMonth();
    const primerDia = new Date(anio, mes, 1).getDay();
    const totalDias = new Date(anio, mes + 1, 0).getDate();

    const dias: DiaCalendario[] = [];
    for (let i = 0; i < primerDia; i++) dias.push({ fecha: null, tareas: [] });

    for (let i = 1; i <= totalDias; i++) {
      const fechaActual = new Date(anio, mes, i);
      const fechaStr = this.formatoFechaLocal(fechaActual);
      const tareasDelDia = this.tareasFiltradas.filter(t =>
        (t.fecha_vencimiento ?? '').slice(0, 10) === fechaStr);
      dias.push({ fecha: fechaActual, tareas: tareasDelDia });
    }
    this.diasDelMes = dias;
  }

  /** yyyy-mm-dd en hora local — toISOString() corrige a UTC y puede correr el día */
  private formatoFechaLocal(f: Date): string {
    const y = f.getFullYear();
    const m = String(f.getMonth() + 1).padStart(2, '0');
    const d = String(f.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  cambiarMes(valor: number): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + valor, 1);
    this.mesSeleccionado  = this.viewDate.getMonth();
    this.anioSeleccionado = this.viewDate.getFullYear();
    this.generarCalendario();
  }

  irAMes(): void {
    this.viewDate = new Date(this.anioSeleccionado, this.mesSeleccionado, 1);
    this.generarCalendario();
  }

  get nombreMesActual(): string {
    return this.meses[this.viewDate.getMonth()];
  }

  abrirTarea(t: Tarea): void {
    this.tareaSeleccionada = t;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.tareaSeleccionada = null;
  }

  toggleCompletada(): void {
    if (!this.tareaSeleccionada) return;
    const t = this.tareaSeleccionada;
    const nuevaFecha = t.fecha_completada ? null : new Date().toISOString();

    this.actualizando = true;
    this.svc.actualizarTarea(t.id, { fecha_completada: nuevaFecha }).subscribe({
      next: actualizada => {
        Object.assign(t, actualizada);
        this.aplicarFiltros();
        this.actualizando = false;
        this.tareaActualizada.emit(t);
      },
      error: () => { this.actualizando = false; },
    });
  }

  verEnTablero(): void {
    if (!this.tareaSeleccionada) return;
    this.irATablero.emit(this.tareaSeleccionada.tablero_id);
    this.cerrarModal();
  }

  claseColor(t: Tarea): string {
    if (t.fecha_completada) return 'bg-green-100 text-green-600 border-green-500';
    if (t.vencida) return 'bg-red-100 text-red-600 border-red-500';

    const dias = this.diasParaVencer(t.fecha_vencimiento);
    if (dias !== null && dias <= 2) return 'bg-orange-100 text-orange-600 border-orange-500';

    switch (t.prioridad) {
      case 'critica': return 'bg-orange-100 text-orange-600 border-orange-500';
      case 'alta':    return 'bg-yellow-100 text-yellow-600 border-yellow-500';
      case 'media':   return 'bg-blue-100 text-blue-600 border-blue-500';
      default:        return 'bg-gray-200 text-gray-700 border-gray-500';
    }
  }

  icono(t: Tarea): string {
    if (t.fecha_completada) return 'fa-circle-check';
    if (t.vencida) return 'fa-triangle-exclamation';
    return 'fa-clock';
  }

  private diasParaVencer(fecha?: string | null): number | null {
    if (!fecha) return null;
    const hoy = new Date();  hoy.setHours(0, 0, 0, 0);
    const venc = new Date(fecha); venc.setHours(0, 0, 0, 0);
    return Math.round((venc.getTime() - hoy.getTime()) / 86400000);
  }
}
