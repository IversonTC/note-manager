import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { RecordatoriosModuloService } from '../../services/recordatorios-modulo.service';
import { ColaboradoresService, ColaboradorApi } from '../../services/colaboradores.service';
import {
  Recordatorio, FormRecordatorio, CrearRecordatorioDto,
  FORM_RECORDATORIO_VACIO, DIAS_SEMANA, FRECUENCIAS,
  DiaSemana, RecordatorioEstado, RecordatorioTipo,
} from '../../interfaces/recordatorios';

type TabKey = 'pendientes' | 'recurrentes' | 'completados';

@Component({
  selector: 'app-recordatorios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recordatorios.component.html',
})
export class RecordatoriosComponent implements OnInit, OnDestroy {
  private svc      = inject(RecordatoriosModuloService);
  private colabSvc = inject(ColaboradoresService);

  // ── Catálogos ─────────────────────────────────────────────────────────────
  readonly diasSemana  = DIAS_SEMANA;
  readonly frecuencias = FRECUENCIAS;

  // ── Tabs ──────────────────────────────────────────────────────────────────
  tabActiva: TabKey = 'pendientes';

  tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'pendientes',  label: 'Pendientes',  icon: 'fa-solid fa-clock'            },
    { key: 'recurrentes', label: 'Recurrentes', icon: 'fa-solid fa-repeat'           },
    { key: 'completados', label: 'Completados', icon: 'fa-solid fa-circle-check'     },
  ];

  // ── Datos ─────────────────────────────────────────────────────────────────
  pendientes:  Recordatorio[] = [];
  recurrentes: Recordatorio[] = [];
  completados: Recordatorio[] = [];
  cargando = false;

  // ── Toasts ────────────────────────────────────────────────────────────────
  toasts: { id: number; tipo: 'ok' | 'error'; msg: string }[] = [];
  private toastId = 0;

  toast(tipo: 'ok' | 'error', msg: string): void {
    const id = ++this.toastId;
    this.toasts.push({ id, tipo, msg });
    setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, 4000);
  }

  private err(e: any, fb: string): string {
    console.error('[Recordatorios]', e);
    return e?.error?.message ?? e?.message ?? fb;
  }

  // ── Modal crear/editar ────────────────────────────────────────────────────
  modalAbierto      = false;
  editando: Recordatorio | null = null;
  guardando         = false;
  form: FormRecordatorio = { ...FORM_RECORDATORIO_VACIO };

  // ── Búsqueda de destinatarios ─────────────────────────────────────────────
  buscandoDestinatarios = false;
  destinatariosBusqueda = '';
  destinatariosSugeridos: ColaboradorApi[] = [];
  private _nombresDestinatarios: Record<string, string> = {};
  private buscarDestinatarios$ = new Subject<string>();
  private subs = new Subscription();

  // ── Eliminar confirmación ─────────────────────────────────────────────────
  recordatorioAEliminar: Recordatorio | null = null;
  modalEliminar = false;
  eliminando    = false;

  // ── Detalle expandido ─────────────────────────────────────────────────────
  detalleAbierto: number | null = null;

  // ─────────────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.cargar();

    // Debounce búsqueda destinatarios
    const sub = this.buscarDestinatarios$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        this.buscandoDestinatarios = true;
        return this.colabSvc.getAliados({ buscar: q, porPagina: 10 });
      }),
    ).subscribe({
      next: res => { this.destinatariosSugeridos = res.items; this.buscandoDestinatarios = false; },
      error: ()  => { this.buscandoDestinatarios = false; },
    });
    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.buscarDestinatarios$.complete();
  }

  // ── Carga ─────────────────────────────────────────────────────────────────

  cargar(): void {
    this.cargando = true;
    this.svc.listar().subscribe({
      next: todos => {
        this.pendientes  = todos.filter(r => r.estado === 'pendiente' && r.tipo === 'temporal');
        this.recurrentes = todos.filter(r => r.tipo === 'recurrente');
        this.completados = todos.filter(r => r.estado === 'completado');
        this.cargando    = false;
      },
      error: e => { this.cargando = false; this.toast('error', this.err(e, 'Error cargando recordatorios.')); },
    });
  }

  get listaActiva(): Recordatorio[] {
    switch (this.tabActiva) {
      case 'pendientes':  return this.pendientes;
      case 'recurrentes': return this.recurrentes;
      case 'completados': return this.completados;
    }
  }

  cambiarTab(tab: TabKey): void { this.tabActiva = tab; }

  // ── Modal crear / editar ──────────────────────────────────────────────────

  abrirCrear(): void {
    this.editando = null;
    this.form     = { ...FORM_RECORDATORIO_VACIO };
    this._nombresDestinatarios = {};
    this.destinatariosBusqueda = '';
    this.destinatariosSugeridos = [];
    this.modalAbierto = true;
  }

  abrirEditar(r: Recordatorio): void {
    this.editando = r;
    this.form = {
      titulo:         r.titulo,
      descripcion:    r.descripcion ?? '',
      tipo:           r.tipo,
      alcance:        r.alcance,
      hora:           r.hora,
      fecha_unica:    r.fecha_unica ?? '',
      frecuencia:     r.frecuencia ?? 'semanal',
      dias_semana:    r.dias_semana ?? [],
      dia_mes:        r.dia_mes ?? 1,
      intervalo_dias: r.intervalo_dias ?? 1,
      fecha_inicio:   r.fecha_inicio ?? '',
      fecha_fin:      r.fecha_fin ?? '',
      sin_fecha_fin:  r.sin_fecha_fin,
      destinatarios:  (r.destinatarios ?? []).map(d => d.codigo),
    };
    // Cargar nombres de destinatarios
    (r.destinatarios ?? []).forEach(d => { this._nombresDestinatarios[d.codigo] = d.nombre; });
    this.destinatariosBusqueda = '';
    this.destinatariosSugeridos = [];
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    if (this.guardando) return;
    this.modalAbierto = false;
    this.editando     = null;
  }

  guardar(): void {
    if (!this.form.titulo.trim() || this.guardando) return;
    if (this.form.tipo === 'temporal' && !this.form.fecha_unica) {
      this.toast('error', 'Debes indicar la fecha para el recordatorio temporal.');
      return;
    }
    if (this.form.tipo === 'recurrente' && this.form.frecuencia === 'semanal' && !this.form.dias_semana.length) {
      this.toast('error', 'Selecciona al menos un día de la semana.');
      return;
    }

    this.guardando = true;
    const dto: CrearRecordatorioDto = {
      titulo:      this.form.titulo.trim(),
      descripcion: this.form.descripcion || undefined,
      tipo:        this.form.tipo,
      alcance:     this.form.alcance,
      hora:        this.form.hora,
    };

    if (this.form.tipo === 'temporal') {
      dto.fecha_unica = this.form.fecha_unica;
    } else {
      dto.frecuencia     = this.form.frecuencia;
      dto.dias_semana    = this.form.frecuencia === 'semanal' ? this.form.dias_semana : undefined;
      dto.dia_mes        = this.form.frecuencia === 'mensual' ? this.form.dia_mes : undefined;
      dto.intervalo_dias = this.form.frecuencia === 'personalizado' ? this.form.intervalo_dias : undefined;
      dto.fecha_inicio   = this.form.fecha_inicio || undefined;
      dto.fecha_fin      = !this.form.sin_fecha_fin ? (this.form.fecha_fin || undefined) : undefined;
      dto.sin_fecha_fin  = this.form.sin_fecha_fin;
    }

    if (this.form.alcance === 'grupal') {
      dto.destinatarios = this.form.destinatarios;
    }

    const op$ = this.editando
      ? this.svc.actualizar(this.editando.id, dto)
      : this.svc.crear(dto);

    op$.subscribe({
      next: () => {
        this.guardando    = false;
        this.modalAbierto = false;
        this.toast('ok', this.editando ? 'Recordatorio actualizado.' : 'Recordatorio creado.');
        this.cargar();
      },
      error: e => { this.guardando = false; this.toast('error', this.err(e, 'Error guardando recordatorio.')); },
    });
  }

  // ── Completar / Reactivar ─────────────────────────────────────────────────

  completar(r: Recordatorio): void {
    this.svc.completar(r.id).subscribe({
      next: () => { this.toast('ok', 'Recordatorio completado.'); this.cargar(); },
      error: e => this.toast('error', this.err(e, 'Error al completar.')),
    });
  }

  reactivar(r: Recordatorio): void {
    this.svc.reactivar(r.id).subscribe({
      next: () => { this.toast('ok', 'Recordatorio reactivado.'); this.cargar(); },
      error: e => this.toast('error', this.err(e, 'Error al reactivar.')),
    });
  }

  // ── Eliminar ──────────────────────────────────────────────────────────────

  confirmarEliminar(r: Recordatorio): void {
    this.recordatorioAEliminar = r;
    this.modalEliminar         = true;
  }

  cerrarModalEliminar(): void {
    if (this.eliminando) return;
    this.modalEliminar         = false;
    this.recordatorioAEliminar = null;
  }

  eliminar(): void {
    if (!this.recordatorioAEliminar || this.eliminando) return;
    this.eliminando = true;
    this.svc.eliminar(this.recordatorioAEliminar.id).subscribe({
      next: () => {
        this.eliminando        = false;
        this.modalEliminar     = false;
        this.recordatorioAEliminar = null;
        this.toast('ok', 'Recordatorio eliminado.');
        this.cargar();
      },
      error: e => { this.eliminando = false; this.toast('error', this.err(e, 'Error al eliminar.')); },
    });
  }

  // ── Dias semana toggle ────────────────────────────────────────────────────

  toggleDia(dia: DiaSemana): void {
    const idx = this.form.dias_semana.indexOf(dia);
    if (idx >= 0) {
      this.form.dias_semana = this.form.dias_semana.filter(d => d !== dia);
    } else {
      this.form.dias_semana = [...this.form.dias_semana, dia];
    }
  }

  tieneDia(dia: DiaSemana): boolean {
    return this.form.dias_semana.includes(dia);
  }

  // ── Destinatarios ─────────────────────────────────────────────────────────

  onBuscarDestinatarios(q: string): void {
    this.destinatariosBusqueda = q;
    if (q.trim().length >= 2) this.buscarDestinatarios$.next(q.trim());
    else this.destinatariosSugeridos = [];
  }

  yaEsDestinatario(codigo: string): boolean {
    return this.form.destinatarios.includes(codigo);
  }

  agregarDestinatario(colab: { codigo: string; nombre: string }): void {
    if (!this.yaEsDestinatario(colab.codigo)) {
      this.form.destinatarios = [...this.form.destinatarios, colab.codigo];
      this._nombresDestinatarios[colab.codigo] = colab.nombre;
      this.destinatariosBusqueda  = '';
      this.destinatariosSugeridos = [];
    }
  }

  quitarDestinatario(codigo: string): void {
    this.form.destinatarios = this.form.destinatarios.filter(c => c !== codigo);
  }

  getNombreDestinatario(codigo: string): string {
    return this._nombresDestinatarios[codigo] ?? codigo;
  }

  inicialNombre(nombre: string): string {
    return nombre?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() ?? '?';
  }

  // ── Detalle ───────────────────────────────────────────────────────────────

  toggleDetalle(id: number): void {
    this.detalleAbierto = this.detalleAbierto === id ? null : id;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  describir(r: Recordatorio): string {
    return this.svc.describir(r);
  }

  estaVencido(r: Recordatorio): boolean {
    if (!r.fecha_unica) return false;
    return new Date(r.fecha_unica + 'T' + r.hora) < new Date();
  }

  proximoLabel(r: Recordatorio): string {
    if (!r.proxima_ejecucion) return '—';
    const d = new Date(r.proxima_ejecucion);
    return d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  colorEstado(estado: RecordatorioEstado): string {
    const mapa: Record<RecordatorioEstado, string> = {
      pendiente:  'var(--color-primary)',
      completado: '#22c55e',
      vencido:    '#ef4444',
    };
    return mapa[estado] ?? '#94a3b8';
  }
}
