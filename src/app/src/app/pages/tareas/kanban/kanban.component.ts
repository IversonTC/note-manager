import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {
  CdkDragDrop, DragDropModule,
  moveItemInArray, transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TareasService } from '../../../services/tareas.service';
import { ColaboradoresService, ColaboradorApi } from '../../../services/colaboradores.service';
import { Subject, Subscription, interval } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {
  KanbanData, ColumnaTablero, Tarea, EtiquetaTablero,
  MiembroTablero, PRIORIDADES_TAREA, TareaPrioridad,
  ComentarioTarea, ChecklistTarea, ChecklistItem, HistorialTarea, AuditoriaItem, AuditoriaAccion,
} from '../../../interfaces/tareas';
import { environment } from '../../../environment/environment';
import { CronogramaComponent } from '../../../shared/cronograma/cronograma.component';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, CronogramaComponent],
  templateUrl: './kanban.component.html',
})
export class KanbanComponent implements OnInit, OnDestroy {
  private svc       = inject(TareasService);
  private colabSvc  = inject(ColaboradoresService);
  private route     = inject(ActivatedRoute);
  private router    = inject(Router);
  private sanitizer = inject(DomSanitizer);

  // ── Toasts ────────────────────────────────────────────────────────────────
  toasts: { id: number; tipo: 'ok' | 'error'; msg: string }[] = [];
  private toastId = 0;

  toast(tipo: 'ok' | 'error', msg: string): void {
    const id = ++this.toastId;
    this.toasts.push({ id, tipo, msg });
    setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, 4000);
  }

  /** Extrae el mensaje de error del backend o usa el fallback. */
  private err(e: any, fallback: string): string {
    console.error('[Tareas]', e);
    return e?.error?.message ?? e?.error?.error ?? e?.message ?? fallback;
  }

  readonly prioridades = PRIORIDADES_TAREA;
  readonly prioridadKeys: TareaPrioridad[] = ['baja', 'media', 'alta', 'critica'];
  readonly apiBase = environment.apiBase;

  // ── Datos Kanban ──────────────────────────────────────────────────────────
  kanban: KanbanData | null = null;
  tableroId = 0;
  cargando  = false;

  // ── IDs de columnas para CDK connected lists ──────────────────────────────
  get columnIds(): string[] {
    return (this.kanban?.columnas ?? []).map(c => 'col-' + c.id);
  }

  // ── Panel detalle tarea ───────────────────────────────────────────────────
  panelAbierto       = false;
  tareaDetalle: Tarea | null = null;
  cargandoDetalle    = false;

  // ── Tabs del panel ────────────────────────────────────────────────────────
  tabActiva: 'info' | 'comentarios' | 'checklist' | 'archivos' | 'recordatorios' | 'historial' | 'auditoria' = 'info';

  // ── Edición inline título ─────────────────────────────────────────────────
  editandoTitulo     = false;
  tituloEditado      = '';
  guardandoTitulo    = false;

  // ── Comentarios ───────────────────────────────────────────────────────────
  comentarios: ComentarioTarea[] = [];
  nuevoComentario    = '';
  enviandoComentario = false;

  // ── Checklist ─────────────────────────────────────────────────────────────
  checklists: ChecklistTarea[] = [];
  nuevoChecklistTitulo = '';
  creandoChecklist     = false;
  nuevoItemTexto: Record<number, string> = {};

  // ── Historial ─────────────────────────────────────────────────────────────
  historial: HistorialTarea[] = [];

  // ── Auditoría ─────────────────────────────────────────────────────────────
  auditoria: AuditoriaItem[] = [];
  cargandoAuditoria = false;

  // ── Asignados ─────────────────────────────────────────────────────────────
  buscarColab        = '';
  resultadosColab: ColaboradorApi[] = [];
  buscandoColab      = false;
  private buscarColab$ = new Subject<string>();

  // ── Etiquetas ─────────────────────────────────────────────────────────────
  // (las etiquetas disponibles vienen de kanban.etiquetas)
  // Las asignadas están en tareaDetalle.etiquetas

  // ── Recordatorios ─────────────────────────────────────────────────────────
  recordatorios: import('../../../interfaces/tareas').RecordatorioTarea[] = [];
  nuevoRecordatorioFecha   = '';
  nuevoRecordatorioMensaje = '';
  creandoRecordatorio      = false;

  // ── Archivos ──────────────────────────────────────────────────────────────
  subiendoArchivo    = false;
  errorArchivo       = '';

  // ── Lightbox ──────────────────────────────────────────────────────────────
  lightboxUrl: string | null = null;

  // ── Markdown descripción ──────────────────────────────────────────────────
  modoPreviewDesc    = false;
  previewDescHtml: SafeHtml = '';

  // ── Alertas de recordatorios ──────────────────────────────────────────────
  private recordatorioTimer: ReturnType<typeof setInterval> | null = null;
  alertasRecordatorio: { id: number; tarea: string; mensaje: string }[] = [];

  // ── Polling — refresca el tablero cada 2s para simular tiempo real ─────────
  private subs: { unsubscribe(): void }[] = [];
  private pollSub: Subscription | null = null;
  private cerrarWS(): void {}

  private iniciarPolling(): void {
    this.pollSub = interval(2000).pipe(
      switchMap(() => this.svc.obtenerKanban(this.tableroId)),
    ).subscribe({
      next: data => {
        // No pisar el tablero mientras el usuario tiene un modal/panel abierto
        if (this.panelAbierto || this.modalNuevaTarea || this.modalNuevaColumna) return;
        this.kanban = data;
      },
      error: () => {},
    });
  }

  private detenerPolling(): void {
    this.pollSub?.unsubscribe();
    this.pollSub = null;
  }

  // ── Modal nueva tarea ─────────────────────────────────────────────────────
  modalNuevaTarea    = false;
  columnaDestino: ColumnaTablero | null = null;
  guardandoTarea     = false;
  errorNuevaTarea    = '';
  formTarea = {
    titulo:           '',
    descripcion:      '',
    prioridad:        'media' as TareaPrioridad,
    fecha_vencimiento: '',
    asignados:        [] as string[],
  };
  asignadosBusqueda      = '';
  asignadosSugeridos: ColaboradorApi[] = [];
  buscandoAsignadosTarea = false;
  // Miembros del equipo/tablero disponibles para asignación rápida
  miembrosDisponibles: MiembroTablero[] = [];
  private buscarAsignadosTarea$ = new Subject<string>();

  // ── Dashboard del tablero ─────────────────────────────────────────────────
  mostrarDashboard = false;

  private get todasLasTareas(): Tarea[] {
    return this.kanban?.columnas?.flatMap(c => c.tareas ?? []) ?? [];
  }

  private esVencida(t: Tarea): boolean {
    if (!t.fecha_vencimiento || t.fecha_completada) return false;
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    const v = new Date(t.fecha_vencimiento); v.setHours(0, 0, 0, 0);
    return v < hoy;
  }

  private venceHoy(t: Tarea): boolean {
    if (!t.fecha_vencimiento || t.fecha_completada) return false;
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    const v = new Date(t.fecha_vencimiento); v.setHours(0, 0, 0, 0);
    return v.getTime() === hoy.getTime();
  }

  get dashStats() {
    const todas      = this.todasLasTareas;
    const completadas = todas.filter(t => !!t.fecha_completada);
    const activas     = todas.filter(t => !t.fecha_completada);
    const vencidas    = activas.filter(t => this.esVencida(t));
    const hoy         = activas.filter(t => this.venceHoy(t));
    const sinAsignar  = activas.filter(t => !(t.asignados?.length));
    const pct = todas.length ? Math.round(completadas.length / todas.length * 100) : 0;
    return { total: todas.length, completadas: completadas.length, activas: activas.length,
             vencidas: vencidas.length, hoy: hoy.length, sinAsignar: sinAsignar.length, pct };
  }

  get dashPorColumna() {
    return (this.kanban?.columnas ?? []).map(c => {
      const tareas = c.tareas ?? [];
      const completadas = tareas.filter(t => !!t.fecha_completada).length;
      const max = Math.max(...(this.kanban?.columnas ?? []).map(x => (x.tareas ?? []).length), 1);
      return { nombre: c.nombre, color: c.color || 'var(--color-primary)',
               total: tareas.length, completadas,
               pctBarra: Math.round(tareas.length / max * 100) };
    });
  }

  get dashPorPrioridad() {
    const todas = this.todasLasTareas;
    if (!todas.length) return [];
    const map: Record<string, number> = {};
    todas.forEach(t => { map[t.prioridad] = (map[t.prioridad] ?? 0) + 1; });
    return (['critica','alta','media','baja'] as TareaPrioridad[])
      .filter(p => map[p])
      .map(p => ({
        prioridad: p,
        label: PRIORIDADES_TAREA[p]?.label ?? p,
        color: PRIORIDADES_TAREA[p]?.color ?? '#6b7280',
        count: map[p],
        pct: Math.round(map[p] / todas.length * 100),
      }));
  }

  get dashPorAsignado() {
    const todas = this.todasLasTareas;
    const map: Record<string, { nombre: string; total: number; completadas: number; vencidas: number }> = {};
    todas.forEach(t => {
      (t.asignados ?? []).forEach(a => {
        if (!map[a.codigo]) map[a.codigo] = { nombre: a.nombre, total: 0, completadas: 0, vencidas: 0 };
        map[a.codigo].total++;
        if (t.fecha_completada)    map[a.codigo].completadas++;
        else if (this.esVencida(t)) map[a.codigo].vencidas++;
      });
    });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 8);
  }

  get dashTareasVencidas() {
    return this.todasLasTareas.filter(t => this.esVencida(t))
      .sort((a, b) => a.fecha_vencimiento!.localeCompare(b.fecha_vencimiento!))
      .slice(0, 6);
  }

  // ── Vista Lista ───────────────────────────────────────────────────────────
  vistaLista = false;
  checklistsPorTarea:      Record<number, ChecklistTarea[]> = {};
  cargandoChecklistLista:  Record<number, boolean>          = {};
  tareasExpandidas:        Record<number, boolean>          = {};   // Record en vez de Set para change detection
  nuevoItemTextoLista:     Record<number, string>           = {};

  get tareasListaFlat(): Tarea[] {
    return this.kanban?.columnas.flatMap(c => c.tareas ?? []) ?? [];
  }

  get countCompletadasLista(): number {
    return this.tareasListaFlat.filter(t => !!t.fecha_completada).length;
  }

  toggleVistaLista(): void { this.vistaLista = !this.vistaLista; }

  // ── Cronograma del tablero (calendario de vencimientos, solo este tablero) ──
  mostrarCronograma = false;
  toggleCronograma(): void { this.mostrarCronograma = !this.mostrarCronograma; }

  estaExpandidaLista(id: number): boolean { return !!this.tareasExpandidas[id]; }

  toggleExpandirTareaLista(tarea: Tarea): void {
    if (this.tareasExpandidas[tarea.id]) {
      // Colapsar — nueva referencia del objeto para forzar change detection
      this.tareasExpandidas = { ...this.tareasExpandidas, [tarea.id]: false };
    } else {
      // Expandir — siempre recarga para obtener datos frescos
      this.tareasExpandidas = { ...this.tareasExpandidas, [tarea.id]: true };
      this.cargarChecklistsLista(tarea.id);
    }
  }

  private cargarChecklistsLista(tareaId: number): void {
    this.cargandoChecklistLista[tareaId] = true;
    this.svc.listarChecklists(tareaId).subscribe({
      next: cls  => {
        this.checklistsPorTarea = { ...this.checklistsPorTarea, [tareaId]: cls };
        this.cargandoChecklistLista[tareaId] = false;
      },
      error: ()  => { this.cargandoChecklistLista[tareaId] = false; },
    });
  }

  toggleHechoLista(tarea: Tarea, ev: Event): void {
    ev.stopPropagation();
    const eraCompletada  = !!tarea.fecha_completada;
    const nuevaFecha     = eraCompletada ? null : new Date().toISOString().slice(0, 10);
    const fechaAnterior  = tarea.fecha_completada ?? null;

    // ── Actualización optimista: refleja el cambio inmediatamente en la UI ──
    this.actualizarTareaEnKanban({ ...tarea, fecha_completada: nuevaFecha });

    (this.svc.actualizarTarea as any)(tarea.id, {
      titulo:           tarea.titulo,
      fecha_completada: nuevaFecha,
    }).subscribe({
      error: (e: any) => {
        // Solo revertir si falla — el optimista ya está correcto
        this.actualizarTareaEnKanban({ ...tarea, fecha_completada: fechaAnterior });
        this.toast('error', this.err(e, 'Error actualizando tarea.'));
      },
    });
  }

  toggleItemLista(tarea: Tarea, cl: ChecklistTarea, item: ChecklistItem, ev: Event): void {
    ev.stopPropagation();
    const anterior  = item.completado;
    item.completado = !anterior;   // optimista inmediato
    this.svc.toggleItemChecklist(tarea.id, cl.id, item.id).subscribe({
      next: updated => { item.completado = updated.completado; },  // confirmar con el servidor
      error: () => { item.completado = anterior; },  // solo revertir si falla
    });
  }

  agregarItemLista(tarea: Tarea, cl: ChecklistTarea): void {
    const texto = (this.nuevoItemTextoLista[cl.id] ?? '').trim();
    if (!texto) return;
    this.svc.agregarItemChecklist(tarea.id, cl.id, texto).subscribe({
      next: item => { cl.items.push(item); this.nuevoItemTextoLista[cl.id] = ''; },
      error: e => this.toast('error', this.err(e, 'Error agregando ítem.')),
    });
  }

  eliminarItemLista(tarea: Tarea, cl: ChecklistTarea, item: ChecklistItem, ev: Event): void {
    ev.stopPropagation();
    this.svc.eliminarItemChecklist(tarea.id, cl.id, item.id).subscribe({
      next: () => { cl.items = cl.items.filter(i => i.id !== item.id); },
      error: e => this.toast('error', this.err(e, 'Error eliminando ítem.')),
    });
  }

  // ── Modal nueva columna ───────────────────────────────────────────────────
  modalNuevaColumna  = false;
  guardandoColumna   = false;
  nombreColumna      = '';
  colorColumna       = '#3b82f6';

  readonly coloresColumna = [
    '#3b82f6','#22c55e','#f59e0b','#ef4444',
    '#8b5cf6','#ec4899','#14b8a6','#6366f1',
  ];

  // ─────────────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.tableroId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar();
    this.iniciarMonitorRecordatorios();
    this.iniciarPolling();

    // Debounce búsqueda de colaboradores (para panel detalle)
    this.buscarColab$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        this.buscandoColab = true;
        return this.colabSvc.getAliados({ buscar: q, porPagina: 10 });
      }),
    ).subscribe({
      next: res => { this.resultadosColab = res.items; this.buscandoColab = false; },
      error: ()  => { this.buscandoColab = false; },
    });

    // Debounce búsqueda de asignados (para crear tarea)
    this.buscarAsignadosTarea$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        this.buscandoAsignadosTarea = true;
        return this.colabSvc.getAliados({ buscar: q, porPagina: 10 });
      }),
    ).subscribe({
      next: res => { this.asignadosSugeridos = res.items; this.buscandoAsignadosTarea = false; },
      error: ()  => { this.buscandoAsignadosTarea = false; },
    });
  }

  cargar(): void {
    this.cargando = true;
    this.svc.obtenerKanban(this.tableroId).subscribe({
      next: data => { this.kanban = data; this.cargando = false; },
      error: e   => { this.cargando = false; this.toast('error', this.err(e, 'Error cargando el tablero.')); },
    });
  }

  volverTableros(): void {
    this.router.navigate(['/layout/tareas']);
  }

  // ── Drag & Drop ───────────────────────────────────────────────────────────

  onDrop(event: CdkDragDrop<Tarea[]>, columna: ColumnaTablero): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(columna.tareas!, event.previousIndex, event.currentIndex);
      this.svc.moverTarea(columna.tareas![event.currentIndex].id, {
        columna_id: columna.id, posicion: event.currentIndex,
      }).subscribe({ error: e => this.toast('error', this.err(e, 'Error reordenando tarea.')) });
    } else {
      transferArrayItem(
        event.previousContainer.data, event.container.data,
        event.previousIndex, event.currentIndex,
      );
      const tarea = columna.tareas![event.currentIndex];
      this.svc.moverTarea(tarea.id, {
        columna_id: columna.id, posicion: event.currentIndex,
      }).subscribe({ error: e => this.toast('error', this.err(e, 'Error moviendo tarea.')) });
    }
  }

  onDropColumna(event: CdkDragDrop<ColumnaTablero[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.kanban!.columnas, event.previousIndex, event.currentIndex);
    const ids = this.kanban!.columnas.map(c => c.id);
    this.svc.reordenarColumnas(this.tableroId, ids).subscribe({
      error: e => {
        // Revertir si falla
        moveItemInArray(this.kanban!.columnas, event.currentIndex, event.previousIndex);
        this.toast('error', this.err(e, 'Error al reordenar columnas.'));
      },
    });
  }

  // ── Columnas ──────────────────────────────────────────────────────────────

  abrirModalColumna(): void {
    this.nombreColumna  = '';
    this.colorColumna   = '#3b82f6';
    this.modalNuevaColumna = true;
  }

  cerrarModalColumna(): void { this.modalNuevaColumna = false; }

  guardarColumna(): void {
    if (!this.nombreColumna.trim() || this.guardandoColumna) return;
    this.guardandoColumna = true;
    this.svc.crearColumna(this.tableroId, {
      nombre:   this.nombreColumna.trim(),
      color:    this.colorColumna,
      posicion: (this.kanban?.columnas.length ?? 0),
    }).subscribe({
      next: col => {
        this.kanban?.columnas.push({ ...col, tareas: [] });
        this.guardandoColumna  = false;
        this.modalNuevaColumna = false;
        this.toast('ok', `Columna "${col.nombre}" creada.`);
      },
      error: e => { this.guardandoColumna = false; this.toast('error', this.err(e, 'Error creando columna.')); },
    });
  }

  eliminarColumna(col: ColumnaTablero, ev: Event): void {
    ev.stopPropagation();
    if (!confirm(`¿Eliminar la columna "${col.nombre}"? Las tareas dentro también se eliminarán.`)) return;
    this.svc.eliminarColumna(this.tableroId, col.id).subscribe({
      next: () => {
        if (this.kanban) this.kanban.columnas = this.kanban.columnas.filter(c => c.id !== col.id);
        this.toast('ok', `Columna eliminada.`);
      },
      error: e => this.toast('error', this.err(e, 'Error eliminando columna.')),
    });
  }

  // ── Modal nueva tarea ─────────────────────────────────────────────────────

  abrirModalNuevaTarea(col: ColumnaTablero): void {
    // Siempre usar la referencia original en kanban.columnas para que
    // el push post-creación actualice el array que CDK observa
    this.columnaDestino = this.kanban?.columnas.find(c => c.id === col.id) ?? col;
    this.formTarea      = { titulo: '', descripcion: '', prioridad: 'media', fecha_vencimiento: '', asignados: [] };
    this.asignadosBusqueda = '';
    this.asignadosSugeridos = [];
    this.errorNuevaTarea = '';
    // Cargar miembros del equipo si el tablero es de equipo
    this.cargarMiembrosEquipoSiAplica();
    this.modalNuevaTarea = true;
  }

  cerrarModalNuevaTarea(): void {
    if (this.guardandoTarea) return;
    this.modalNuevaTarea    = false;
    this._nombresAsignados  = {};
    this.asignadosBusqueda  = '';
    this.asignadosSugeridos = [];
  }

  guardarNuevaTarea(): void {
    if (!this.formTarea.titulo.trim() || this.guardandoTarea || !this.columnaDestino) return;
    this.guardandoTarea  = true;
    this.errorNuevaTarea = '';
    this.svc.crearTarea({
      tablero_id: this.tableroId,
      columna_id: this.columnaDestino.id,
      titulo:     this.formTarea.titulo.trim(),
      descripcion: this.formTarea.descripcion || undefined,
      prioridad:  this.formTarea.prioridad,
      fecha_vencimiento: this.formTarea.fecha_vencimiento || undefined,
      asignados:  this.formTarea.asignados.length > 0 ? this.formTarea.asignados : undefined,
    }).subscribe({
      next: tarea => {
        this.columnaDestino!.tareas = [...(this.columnaDestino!.tareas ?? []), tarea];
        this.guardandoTarea  = false;
        this.modalNuevaTarea = false;
        this.asignadosBusqueda = '';
        this.asignadosSugeridos = [];
        this.toast('ok', `Tarea "${tarea.titulo}" creada.`);
      },
      error: e => {
        this.guardandoTarea  = false;
        this.errorNuevaTarea = this.err(e, 'Error al crear la tarea.');
        this.toast('error', this.errorNuevaTarea);
      },
    });
  }

  // ── Panel detalle ─────────────────────────────────────────────────────────

  abrirDetalle(tarea: Tarea): void {
    this.tareaDetalle   = tarea;
    this.tabActiva      = 'info';
    this.panelAbierto   = true;
    this.cargandoDetalle = true;
    this.comentarios    = [];
    this.checklists     = [];
    this.historial      = [];
    this.auditoria      = [];
    this.recordatorios  = [];
    this.buscarColab    = '';
    this.resultadosColab = [];

    this.archivosRotos = new Set();
    this.svc.obtenerTarea(tarea.id).subscribe({
      next: t => { this.tareaDetalle = t; this.cargandoDetalle = false; },
      error: e => { this.cargandoDetalle = false; this.toast('error', this.err(e, 'Error cargando detalle.')); },
    });
  }

  cerrarPanel(): void {
    this.panelAbierto = false;
    this.tareaDetalle = null;
  }

  cambiarTab(tab: string): void {
    this.tabActiva = tab as typeof this.tabActiva;
    if (!this.tareaDetalle) return;
    const id = this.tareaDetalle.id;
    if (tab === 'comentarios') {
      this.svc.listarComentarios(id).subscribe({
        next: d => this.comentarios = d,
        error: e => this.toast('error', this.err(e, 'Error cargando comentarios.')),
      });
    }
    if (tab === 'archivos') {
      this.archivosRotos = new Set();
      this.svc.listarArchivos(id).subscribe({
        next: d => { if (this.tareaDetalle) this.tareaDetalle.archivos = d; },
        error: e => this.toast('error', this.err(e, 'Error cargando archivos.')),
      });
    }
    if (tab === 'checklist' && !this.checklists.length) {
      this.svc.listarChecklists(id).subscribe({
        next: d => this.checklists = d,
        error: e => this.toast('error', this.err(e, 'Error cargando checklists.')),
      });
    }
    if (tab === 'recordatorios' && !this.recordatorios.length) {
      this.svc.listarRecordatorios(id).subscribe({
        next: d => this.recordatorios = d,
        error: e => this.toast('error', this.err(e, 'Error cargando recordatorios.')),
      });
    }
    if (tab === 'historial' && !this.historial.length) {
      this.svc.listarHistorial(id).subscribe({
        next: d => this.historial = d,
        error: e => this.toast('error', this.err(e, 'Error cargando historial.')),
      });
    }
    if (tab === 'auditoria' && !this.auditoria.length && !this.cargandoAuditoria) {
      this.cargandoAuditoria = true;
      this.svc.listarAuditoria(id).subscribe({
        next: d => { this.auditoria = d; this.cargandoAuditoria = false; },
        error: e => { this.cargandoAuditoria = false; this.toast('error', this.err(e, 'Error cargando auditoría.')); },
      });
    }
  }

  // ── Título inline ─────────────────────────────────────────────────────────

  iniciarEdicionTitulo(): void {
    this.tituloEditado   = this.tareaDetalle?.titulo ?? '';
    this.editandoTitulo  = true;
  }

  guardarTitulo(): void {
    if (!this.tituloEditado.trim() || this.guardandoTitulo || !this.tareaDetalle) return;
    this.guardandoTitulo = true;
    this.svc.actualizarTarea(this.tareaDetalle.id, { titulo: this.tituloEditado.trim() }).subscribe({
      next: t => {
        this.tareaDetalle!.titulo = t.titulo;
        this.actualizarTareaEnKanban(t);
        this.editandoTitulo  = false;
        this.guardandoTitulo = false;
        this.toast('ok', 'Título actualizado.');
      },
      error: e => { this.guardandoTitulo = false; this.toast('error', this.err(e, 'Error guardando título.')); },
    });
  }

  cancelarEdicionTitulo(): void { this.editandoTitulo = false; }

  // ── Prioridad / fecha / descripción ──────────────────────────────────────

  cambiarPrioridad(p: TareaPrioridad): void {
    if (!this.tareaDetalle) return;
    this.svc.actualizarTarea(this.tareaDetalle.id, {
      titulo:   this.tareaDetalle.titulo,
      prioridad: p,
    }).subscribe({
      next: t => { this.tareaDetalle!.prioridad = t.prioridad; this.actualizarTareaEnKanban(t); this.toast('ok', 'Prioridad actualizada.'); },
      error: e => this.toast('error', this.err(e, 'Error cambiando prioridad.')),
    });
  }

  guardarDescripcion(): void {
    if (!this.tareaDetalle) return;
    this.svc.actualizarTarea(this.tareaDetalle.id, {
      titulo:      this.tareaDetalle.titulo,
      descripcion: this.tareaDetalle.descripcion,
    }).subscribe({
      next: t => {
        this.actualizarTareaEnKanban(t);
        // Refrescar preview si está activo
        if (this.modoPreviewDesc) {
          this.previewDescHtml = this.sanitizer.bypassSecurityTrustHtml(
            this.parsearMarkdown(this.tareaDetalle?.descripcion ?? '')
          );
        }
        this.toast('ok', 'Descripción guardada.');
      },
      error: e => this.toast('error', this.err(e, 'Error guardando descripción.')),
    });
  }

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  cambiarFechaVencimiento(fecha: string): void {
    if (!this.tareaDetalle) return;
    this.svc.actualizarTarea(this.tareaDetalle.id, {
      titulo:            this.tareaDetalle.titulo,
      fecha_vencimiento: fecha || undefined,
    }).subscribe({
      next: t => { this.tareaDetalle!.fecha_vencimiento = t.fecha_vencimiento; this.actualizarTareaEnKanban(t); },
    });
  }

  // ── Comentarios ───────────────────────────────────────────────────────────

  enviarComentario(): void {
    if (!this.nuevoComentario.trim() || this.enviandoComentario || !this.tareaDetalle) return;
    const texto = this.nuevoComentario.trim();
    this.nuevoComentario    = '';
    this.enviandoComentario = true;

    const tareaId = this.tareaDetalle.id;
    this.svc.agregarComentario(tareaId, texto).subscribe({
      next: () => {
        this.svc.listarComentarios(tareaId).subscribe({
          next: d => { this.comentarios = d; this.enviandoComentario = false; },
          error: () => { this.enviandoComentario = false; },
        });
        if (this.tareaDetalle) this.tareaDetalle.total_comentarios = (this.tareaDetalle.total_comentarios ?? 0) + 1;
      },
      error: e => {
        this.nuevoComentario    = texto;
        this.enviandoComentario = false;
        this.toast('error', this.err(e, 'Error enviando comentario.'));
      },
    });
  }

  eliminarComentario(c: ComentarioTarea): void {
    if (!this.tareaDetalle) return;
    this.svc.eliminarComentario(this.tareaDetalle.id, c.id).subscribe({
      next: () => { this.comentarios = this.comentarios.filter(x => x.id !== c.id); },
    });
  }

  // ── Checklist ─────────────────────────────────────────────────────────────

  crearChecklist(): void {
    if (!this.nuevoChecklistTitulo.trim() || this.creandoChecklist || !this.tareaDetalle) return;
    this.creandoChecklist = true;
    this.svc.crearChecklist(this.tareaDetalle.id, this.nuevoChecklistTitulo.trim()).subscribe({
      next: cl => {
        this.checklists.push({ ...cl, items: [] });
        this.nuevoChecklistTitulo = '';
        this.creandoChecklist     = false;
      },
      error: e => { this.creandoChecklist = false; this.toast('error', this.err(e, 'Error creando checklist.')); },
    });
  }

  agregarItem(cl: ChecklistTarea): void {
    const texto = (this.nuevoItemTexto[cl.id] ?? '').trim();
    if (!texto || !this.tareaDetalle) return;
    this.svc.agregarItemChecklist(this.tareaDetalle.id, cl.id, texto).subscribe({
      next: item => {
        cl.items.push(item);
        this.nuevoItemTexto[cl.id] = '';
      },
    });
  }

  toggleItem(cl: ChecklistTarea, item: ChecklistItem): void {
    if (!this.tareaDetalle) return;
    this.svc.toggleItemChecklist(this.tareaDetalle.id, cl.id, item.id).subscribe({
      next: updated => { item.completado = updated.completado; },
    });
  }

  eliminarChecklist(cl: ChecklistTarea): void {
    if (!this.tareaDetalle) return;
    this.svc.eliminarChecklist(this.tareaDetalle.id, cl.id).subscribe({
      next: () => { this.checklists = this.checklists.filter(x => x.id !== cl.id); },
    });
  }

  porcentajeChecklist(cl: ChecklistTarea): number {
    if (!cl.items.length) return 0;
    return Math.round((cl.items.filter(i => i.completado).length / cl.items.length) * 100);
  }

  // ── Lightbox ──────────────────────────────────────────────────────────────

  abrirLightbox(url: string): void  { this.lightboxUrl = url; }
  cerrarLightbox(): void            { this.lightboxUrl = null; }

  // Set de IDs de archivos cuya carga falló (no son imágenes o URL incorrecta)
  archivosRotos = new Set<number>();

  onImageError(id: number): void {
    this.archivosRotos.add(id);
    // Fuerza re-render creando un nuevo Set (inmutabilidad para change detection)
    this.archivosRotos = new Set(this.archivosRotos);
  }

  esImagenCargada(id: number): boolean {
    return !this.archivosRotos.has(id);
  }

  // ── Markdown ──────────────────────────────────────────────────────────────

  togglePreviewDesc(): void {
    this.modoPreviewDesc = !this.modoPreviewDesc;
    if (this.modoPreviewDesc) {
      this.previewDescHtml = this.sanitizer.bypassSecurityTrustHtml(
        this.parsearMarkdown(this.tareaDetalle?.descripcion ?? '')
      );
    }
  }

  private parsearMarkdown(texto: string): string {
    if (!texto) return '<p class="text-gray-400 text-sm italic">Sin descripción.</p>';
    let html = texto
      // Escapar HTML
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      // Headings
      .replace(/^### (.+)$/gm, '<h3 class="text-sm font-bold text-gray-800 mt-3 mb-1">$1</h3>')
      .replace(/^## (.+)$/gm,  '<h2 class="text-base font-bold text-gray-800 mt-4 mb-1">$1</h2>')
      .replace(/^# (.+)$/gm,   '<h1 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h1>')
      // Bold + italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g,     '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,         '<em>$1</em>')
      .replace(/_(.+?)_/g,           '<em>$1</em>')
      // Código inline
      .replace(/`(.+?)`/g, '<code class="bg-gray-100 text-pink-600 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
      // Listas
      .replace(/^[-*] (.+)$/gm, '<li class="ml-4 list-disc text-sm text-gray-700">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-sm text-gray-700">$2</li>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" class="text-blue-500 underline hover:text-blue-700">$1</a>')
      // Separador
      .replace(/^---$/gm, '<hr class="my-2 border-gray-200">')
      // Párrafos y saltos
      .replace(/\n\n/g, '</p><p class="text-sm text-gray-700 mt-2">')
      .replace(/\n/g,   '<br>');
    return `<p class="text-sm text-gray-700 leading-relaxed">${html}</p>`;
  }

  // ── Alertas recordatorios ─────────────────────────────────────────────────

  private iniciarMonitorRecordatorios(): void {
    this.verificarRecordatorios();
    this.recordatorioTimer = setInterval(() => this.verificarRecordatorios(), 60_000);
  }

  private verificarRecordatorios(): void {
    if (!this.tareaDetalle?.id || !this.recordatorios.length) return;
    const ahora = new Date();
    this.recordatorios.forEach(r => {
      if (r.notificado) return;
      const fechaR = new Date(r.fecha);
      if (fechaR <= ahora) {
        const yaAlertado = this.alertasRecordatorio.some(a => a.id === r.id);
        if (!yaAlertado) {
          const alerta = {
            id:      r.id,
            tarea:   this.tareaDetalle?.titulo ?? 'Tarea',
            mensaje: r.mensaje ?? 'Recordatorio de tarea',
          };
          this.alertasRecordatorio = [...this.alertasRecordatorio, alerta];
          this.toast('ok', `🔔 ${alerta.tarea}: ${alerta.mensaje}`);
          // Notificación nativa del SO
          if ('Notification' in window && Notification.permission === 'granted') {
            try {
              const n = new Notification(`🔔 ${alerta.tarea}`, {
                body: alerta.mensaje, icon: '/favicon.ico',
              });
              setTimeout(() => n.close(), 8000);
            } catch {}
          }
        }
      }
    });
  }

  descartarAlertaRecordatorio(id: number): void {
    this.alertasRecordatorio = this.alertasRecordatorio.filter(a => a.id !== id);
  }

  ngOnDestroy(): void {
    if (this.recordatorioTimer) clearInterval(this.recordatorioTimer);
    this.cerrarWS();
    this.detenerPolling();
    this.subs.forEach(s => s.unsubscribe());
  }

  // ── Archivos ──────────────────────────────────────────────────────────────

  onArchivoSeleccionado(ev: Event): void {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file || !this.tareaDetalle) return;
    this.errorArchivo   = '';
    if (file.size > 20 * 1024 * 1024) { this.errorArchivo = 'Máximo 20 MB.'; return; }
    this.subiendoArchivo = true;
    const tareaId = this.tareaDetalle.id;
    this.svc.subirArchivo(tareaId, file).subscribe({
      next: () => {
        this.svc.listarArchivos(tareaId).subscribe({
          next: d => { if (this.tareaDetalle) this.tareaDetalle.archivos = d; this.subiendoArchivo = false; },
          error: () => { this.subiendoArchivo = false; },
        });
      },
      error: () => { this.subiendoArchivo = false; this.errorArchivo = 'Error al subir el archivo.'; },
    });
  }

  eliminarArchivo(a: { id: number }): void {
    if (!this.tareaDetalle) return;
    this.svc.eliminarArchivo(this.tareaDetalle.id, a.id).subscribe({
      next: () => {
        this.tareaDetalle!.archivos = this.tareaDetalle!.archivos?.filter(x => x.id !== a.id);
      },
    });
  }

  archivoUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const clean = url.startsWith('/') ? url.slice(1) : url;
    return `${this.apiBase}/${clean}`;
  }

  // ── Eliminar tarea ────────────────────────────────────────────────────────

  eliminarTareaActual(): void {
    if (!this.tareaDetalle) return;
    if (!confirm(`¿Eliminar la tarea "${this.tareaDetalle.titulo}"? Esta acción no se puede deshacer.`)) return;
    this.svc.eliminarTarea(this.tareaDetalle.id).subscribe({
      next: () => {
        this.quitarTareaDelKanban(this.tareaDetalle!.id);
        this.cerrarPanel();
        this.toast('ok', 'Tarea eliminada.');
      },
      error: e => this.toast('error', this.err(e, 'Error eliminando tarea.')),
    });
  }

  // ── Asignados ─────────────────────────────────────────────────────────────

  onBuscarColab(q: string): void {
    this.buscarColab = q;
    if (q.trim().length >= 2) this.buscarColab$.next(q.trim());
    else this.resultadosColab = [];
  }

  yaAsignado(codigo: string): boolean {
    return !!(this.tareaDetalle?.asignados?.some(a => a.codigo === codigo));
  }

  asignar(colab: ColaboradorApi): void {
    if (!this.tareaDetalle || this.yaAsignado(colab.codigo)) return;
    this.svc.asignarUsuario(this.tareaDetalle.id, colab.codigo).subscribe({
      next: a => {
        this.tareaDetalle!.asignados = [...(this.tareaDetalle!.asignados ?? []), a];
        this.buscarColab = '';
        this.resultadosColab = [];
        this.toast('ok', `${colab.nombre} asignado.`);
      },
      error: e => this.toast('error', this.err(e, 'Error asignando colaborador.')),
    });
  }

  quitarAsignado(codigo: string): void {
    if (!this.tareaDetalle) return;
    this.svc.quitarAsignado(this.tareaDetalle.id, codigo).subscribe({
      next: () => {
        this.tareaDetalle!.asignados = this.tareaDetalle!.asignados?.filter(a => a.codigo !== codigo);
        this.toast('ok', 'Asignado removido.');
      },
      error: e => this.toast('error', this.err(e, 'Error removiendo asignado.')),
    });
  }

  // ── Etiquetas ─────────────────────────────────────────────────────────────

  tieneEtiqueta(etId: number): boolean {
    return !!(this.tareaDetalle?.etiquetas?.some(e => e.id === etId));
  }

  toggleEtiqueta(etId: number): void {
    if (!this.tareaDetalle) return;
    const actuales = (this.tareaDetalle.etiquetas ?? []).map(e => e.id);
    const nuevas = actuales.includes(etId)
      ? actuales.filter(id => id !== etId)
      : [...actuales, etId];

    this.svc.sincronizarEtiquetas(this.tareaDetalle.id, nuevas).subscribe({
      next: () => {
        this.tareaDetalle!.etiquetas = (this.kanban?.etiquetas ?? []).filter(e => nuevas.includes(e.id));
        this.actualizarTareaEnKanban(this.tareaDetalle!);
      },
      error: e => this.toast('error', this.err(e, 'Error actualizando etiquetas.')),
    });
  }

  // ── Recordatorios ─────────────────────────────────────────────────────────

  crearRecordatorio(): void {
    if (!this.nuevoRecordatorioFecha.trim() || this.creandoRecordatorio || !this.tareaDetalle) return;
    this.creandoRecordatorio = true;
    this.svc.crearRecordatorio(this.tareaDetalle.id, {
      codigo_colab: this.obtenerUsuarioActual().codigo,
      fecha:        this.nuevoRecordatorioFecha,
      mensaje:      this.nuevoRecordatorioMensaje || undefined,
    }).subscribe({
      next: r => {
        this.recordatorios.push(r);
        this.nuevoRecordatorioFecha   = '';
        this.nuevoRecordatorioMensaje = '';
        this.creandoRecordatorio      = false;
        this.toast('ok', 'Recordatorio creado.');
      },
      error: e => { this.creandoRecordatorio = false; this.toast('error', this.err(e, 'Error creando recordatorio.')); },
    });
  }

  eliminarRecordatorio(id: number): void {
    if (!this.tareaDetalle) return;
    this.svc.eliminarRecordatorio(this.tareaDetalle.id, id).subscribe({
      next: () => { this.recordatorios = this.recordatorios.filter(r => r.id !== id); this.toast('ok', 'Recordatorio eliminado.'); },
      error: e => this.toast('error', this.err(e, 'Error eliminando recordatorio.')),
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private actualizarTareaEnKanban(tarea: Tarea): void {
    this.kanban?.columnas.forEach(col => {
      const idx = col.tareas?.findIndex(t => t.id === tarea.id) ?? -1;
      if (idx !== -1) col.tareas![idx] = { ...col.tareas![idx], ...tarea };
    });
  }

  private quitarTareaDelKanban(id: number): void {
    this.kanban?.columnas.forEach(col => {
      col.tareas = col.tareas?.filter(t => t.id !== id) ?? [];
    });
  }

  getEtiquetasColor(etiqueta: EtiquetaTablero): string {
    return etiqueta.color + '25';
  }

  estaVencida(fecha?: string | null): boolean {
    if (!fecha) return false;
    return new Date(fecha) < new Date();
  }

  miembro(codigo: string): MiembroTablero | undefined {
    return this.kanban?.miembros.find(m => m.codigo === codigo);
  }

  inicialNombre(nombre: string): string {
    return nombre?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() ?? '?';
  }

  pctCompletadasAsignado(completadas: number, total: number): number {
    return total ? Math.round(completadas / total * 100) : 0;
  }

  getNombreColumna(id: number): string {
    return this.kanban?.columnas.find(c => c.id === id)?.nombre ?? '';
  }

  // ── Auditoría helpers ─────────────────────────────────────────────────────

  auditoriaIcon(accion: AuditoriaAccion): string {
    const map: Record<AuditoriaAccion, string> = {
      creada:             'fa-solid fa-sparkles',
      campo_editado:      'fa-solid fa-pen',
      prioridad_cambiada: 'fa-solid fa-flag',
      estado_cambiado:    'fa-solid fa-arrow-right-arrow-left',
      archivada:          'fa-solid fa-box-archive',
      asignado_agregado:  'fa-solid fa-user-plus',
      asignado_eliminado: 'fa-solid fa-user-minus',
      comentario_agregado:'fa-regular fa-comment',
      archivo_adjunto:    'fa-solid fa-paperclip',
    };
    return map[accion] ?? 'fa-solid fa-circle-dot';
  }

  auditoriaColor(accion: AuditoriaAccion): string {
    const map: Record<AuditoriaAccion, string> = {
      creada:             'var(--color-primary)',
      campo_editado:      '#6366f1',
      prioridad_cambiada: '#f59e0b',
      estado_cambiado:    '#3b82f6',
      archivada:          '#6b7280',
      asignado_agregado:  '#22c55e',
      asignado_eliminado: '#ef4444',
      comentario_agregado:'var(--color-primary)',
      archivo_adjunto:    '#14b8a6',
    };
    return map[accion] ?? '#6b7280';
  }

  auditoriaLabel(accion: AuditoriaAccion): string {
    const map: Record<AuditoriaAccion, string> = {
      creada:             'Creada',
      campo_editado:      'Campo editado',
      prioridad_cambiada: 'Prioridad cambiada',
      estado_cambiado:    'Estado cambiado',
      archivada:          'Archivada',
      asignado_agregado:  'Asignado agregado',
      asignado_eliminado: 'Asignado eliminado',
      comentario_agregado:'Comentario agregado',
      archivo_adjunto:    'Archivo adjunto',
    };
    return map[accion] ?? accion;
  }

  // ── Permisos y Filtrado ───────────────────────────────────────────────────

  /**
   * Obtiene el usuario actual desde sessionStorage
   */
  private obtenerUsuarioActual(): { codigo: string; nombre: string; empresa: string } {
    try {
      const raw = sessionStorage.getItem('usuario');
      return raw ? JSON.parse(raw) : { codigo: '', nombre: '', empresa: '' };
    } catch {
      return { codigo: '', nombre: '', empresa: '' };
    }
  }

  /**
   * Determina el rol del usuario actual en el tablero
   */
  obtenerMiRol(): 'admin' | 'editor' | 'lector' | null {
    if (!this.kanban) return null;
    const usuario = this.obtenerUsuarioActual();
    const miembro = this.kanban.miembros?.find(m => m.codigo === usuario.codigo);
    return (miembro?.rol as any) ?? null;
  }

  /**
   * Verifica si el usuario puede ver la tarea según permisos
   */
  private puedoVerTarea(tarea: Tarea): boolean {
    if (!this.kanban) return false;
    const usuario = this.obtenerUsuarioActual();
    const tablero = this.kanban.tablero;

    // Soy el creador → siempre visible
    if (tarea.creado_por === usuario.codigo) return true;

    // Tablero público → visible para todos
    if (tablero.visibilidad === 'publico') return true;

    // Tablero privado → solo si soy miembro
    if (tablero.visibilidad === 'privado') {
      return this.soyMiembroTablero();
    }

    // Tablero equipo → si soy miembro del equipo
    if (tablero.visibilidad === 'equipo') {
      return this.soyMiembroTablero();
    }

    return false;
  }

  /**
   * Verifica si el usuario es miembro del tablero actual
   */
  private soyMiembroTablero(): boolean {
    if (!this.kanban) return false;
    const usuario = this.obtenerUsuarioActual();
    return this.kanban.miembros?.some(m => m.codigo === usuario.codigo) ?? false;
  }

  /**
   * Verifica si el usuario puede editar una tarea según su rol
   */
  puedoEditarTarea(tarea: Tarea): boolean {
    const miRol = this.obtenerMiRol();
    const usuario = this.obtenerUsuarioActual();

    if (!miRol || miRol === 'lector') return false;

    // Admin puede editar todo
    if (miRol === 'admin') return true;

    // Editor solo puede editar propias o asignadas
    if (miRol === 'editor') {
      return (
        tarea.creado_por === usuario.codigo ||
        (tarea.asignados?.some(a => a.codigo === usuario.codigo) ?? false)
      );
    }

    return false;
  }

  /**
   * Cuenta tareas visibles en una columna para el contador del header.
   * Los miembros del tablero ven todas las tareas; creadores ven las propias.
   */
  contarTareasVisibles(col: ColumnaTablero): number {
    return (col.tareas ?? []).filter(t => this.puedoVerTarea(t)).length;
  }

  /**
   * Carga los miembros del equipo/tablero para asignación rápida.
   * Si el tablero tiene equipo_id, usa los miembros del tablero directamente.
   */
  cargarMiembrosEquipoSiAplica(): void {
    this.miembrosDisponibles = this.kanban?.miembros ?? [];
  }

  /**
   * Búsqueda de colaboradores para asignados en crear tarea
   */
  onBuscarAsignados(q: string): void {
    this.asignadosBusqueda = q;
    if (q.trim().length >= 2) {
      this.buscarAsignadosTarea$.next(q.trim());
    } else {
      this.asignadosSugeridos = [];
    }
  }

  /**
   * Verifica si un colaborador ya está asignado en la tarea que se está creando
   */
  yaAsignadoEnForm(codigo: string): boolean {
    return this.formTarea.asignados.includes(codigo);
  }

  /**
   * Agrega un colaborador a los asignados de la tarea que se está creando.
   * Acepta cualquier objeto que tenga codigo y nombre.
   */
  agregarAsignadoForm(colab: { codigo: string; nombre: string }): void {
    if (!this.yaAsignadoEnForm(colab.codigo)) {
      this.formTarea.asignados.push(colab.codigo);
      // Guardar nombre para el getter getNombreAsignado
      this._nombresAsignados[colab.codigo] = colab.nombre;
      this.asignadosBusqueda = '';
      this.asignadosSugeridos = [];
    }
  }

  /** Cache local de nombres de asignados (para mostrar en el modal) */
  private _nombresAsignados: Record<string, string> = {};

  /**
   * Remueve un colaborador de los asignados de la tarea que se está creando
   */
  quitarAsignadoForm(codigo: string): void {
    this.formTarea.asignados = this.formTarea.asignados.filter(c => c !== codigo);
  }

  /**
   * Obtiene el nombre de un colaborador por su código
   */
  getNombreAsignado(codigo: string): string {
    return (
      this._nombresAsignados[codigo] ??
      this.kanban?.miembros?.find(m => m.codigo === codigo)?.nombre ??
      this.asignadosSugeridos?.find(a => a.codigo === codigo)?.nombre ??
      codigo
    );
  }
}
