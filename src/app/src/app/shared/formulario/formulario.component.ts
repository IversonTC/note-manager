import { PaletaColoresService } from './../../services/paleta-colores.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { LoadingService } from '../../services/loading.service';
import { CampoFormulario, SelectOption } from '../../interfaces/formulario';
import { PruebaApiService } from '../../services/prueba-api.service';
import { ApiFactoryService } from '../../services/api-factory.service';

@Component({
  selector: 'app-formulario',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './formulario.component.html',
})
export default class FormularioComponent {
  formulario!: FormGroup;
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() campos: CampoFormulario[] = [];
  @Input() submitConfig?: { servicio: string; metodo: string };
  /** Modo embebido: elimina el wrapper full-page y el header de color */
  @Input() compact = false;
  /** Ocultar la cabecera título/subtítulo en modo compact */
  @Input() mostrarHeader = true;
  /** Texto personalizado para el botón submit. Si no se pasa, usa 'Guardar' o 'Registrar' según compact */
  @Input() textoSubmit = '';
  @Output() accion = new EventEmitter<string>();
  @Output() formSubmit = new EventEmitter<any>();
  @Output() campoChange = new EventEmitter<{ campo: string; value: any }>();

  opciones?: SelectOption[];

  // Panel modal-select
  panelCampo: CampoFormulario | null = null;
  labelsPorCampo: Record<string, string> = {};

  // Search-select
  searchAbierto: string | null = null;
  searchTexto: Record<string, string> = {};

  // ── Multi-select ──────────────────────────────────────────────
  multiSeleccionados: Record<string, any[]> = {};
  multiAbierto: string | null = null;
  multiSearchTexto: Record<string, string> = {};

  // ── Posicionamiento inteligente de dropdowns (multi-select / search-select) ──
  // Se ancla con position:fixed a coordenadas del viewport (no del contenedor padre)
  // para escapar de cualquier ancestro con overflow:hidden (ej. cards rounded-2xl
  // overflow-hidden, un patrón común en la app). Decide si abre arriba o abajo según
  // el espacio real disponible y limita su alto máximo para no cortarse ni desbordar.
  dropdownPos: Record<string, {
    openUp: boolean; maxHeight: number; left: number; width: number; top?: number; bottom?: number;
  }> = {};

  /** Alto del navbar fijo (top-16 = 4rem = 64px) — el dropdown nunca debe
   *  invadir esa franja, o tapa el botón de hamburguesa en móvil/tablet. */
  private readonly NAVBAR_ALTO = 64;

  private calcularPosicionDropdown(trigger: HTMLElement) {
    const rect = trigger.getBoundingClientRect();
    const margen = 8;
    const alturaIdeal = 280;
    const minimo = 140;
    const limiteSuperior = this.NAVBAR_ALTO + margen;

    const espacioAbajo = window.innerHeight - rect.bottom - margen;
    const espacioArriba = rect.top - limiteSuperior;

    // Prioriza abrir hacia abajo; solo voltea si abajo no alcanza ni el mínimo
    // y arriba hay claramente más espacio disponible (ya descontando el navbar).
    const openUp = espacioAbajo < minimo && espacioArriba > espacioAbajo;
    const disponible = openUp ? espacioArriba : espacioAbajo;
    const maxHeight = Math.max(minimo, Math.min(alturaIdeal, disponible));

    return {
      openUp,
      maxHeight,
      left: rect.left,
      width: rect.width,
      ...(openUp
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
    };
  }

  /** Ancho de ventana en el último cálculo — para distinguir un resize real
   *  (rotación de pantalla) del que dispara el teclado virtual en móvil, que
   *  solo cambia el alto y no debería cerrar el dropdown de golpe. */
  private ultimoAnchoVentana = typeof window !== 'undefined' ? window.innerWidth : 0;

  /** Si la página hace scroll, el dropdown quedaría desalineado respecto al
   *  trigger (está anclado por coordenadas fijas) — se cierra por seguridad. */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.multiAbierto)  this.multiAbierto  = null;
    if (this.searchAbierto) this.searchAbierto = null;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    const anchoActual = window.innerWidth;
    // En móvil, abrir el teclado virtual dispara "resize" cambiando solo el
    // alto de la ventana — no cerrar el dropdown en ese caso.
    if (anchoActual === this.ultimoAnchoVentana) return;
    this.ultimoAnchoVentana = anchoActual;
    if (this.multiAbierto)  this.multiAbierto  = null;
    if (this.searchAbierto) this.searchAbierto = null;
  }

  toggleMultiSelect(campo: CampoFormulario, event: MouseEvent): void {
    const key = campo.campo!;
    if (this.multiAbierto === key) { this.multiAbierto = null; return; }
    this.dropdownPos[key] = this.calcularPosicionDropdown(event.currentTarget as HTMLElement);
    this.multiAbierto = key;
    this.multiSearchTexto[key] = '';
    if (campo.apiConfig?.metodoBusqueda) this.dispararBusquedaRemota(campo, '', true);
  }

  onMultiSearchTextoChange(campo: CampoFormulario): void {
    this.dispararBusquedaRemota(campo, this.multiSearchTexto[campo.campo!] ?? '', true);
  }

  onSearchTextoChange(campo: CampoFormulario): void {
    this.dispararBusquedaRemota(campo, this.searchTexto[campo.campo!] ?? '', false);
  }

  // ── Búsqueda remota (apiConfig.metodoBusqueda) ────────────────────────────
  private buscarTimeouts: Record<string, ReturnType<typeof setTimeout>> = {};
  buscandoRemoto: Record<string, boolean> = {};
  errorBusquedaRemota: Record<string, string> = {};

  private dispararBusquedaRemota(campo: CampoFormulario, texto: string, esMulti: boolean): void {
    if (!campo.apiConfig?.metodoBusqueda) return;
    const key = campo.campo!;
    clearTimeout(this.buscarTimeouts[key]);

    const servicio = this.apiFactory.obtenerServicio(campo.apiConfig!.servicio);
    if (!servicio) {
      console.warn('[FormularioComponent] Servicio no encontrado para búsqueda remota:', campo.apiConfig!.servicio);
      this.errorBusquedaRemota[key] = 'Servicio no configurado.';
      return;
    }
    const metodo = servicio[campo.apiConfig!.metodoBusqueda!];
    if (!metodo) {
      console.warn('[FormularioComponent] Método de búsqueda no encontrado:', campo.apiConfig!.metodoBusqueda);
      this.errorBusquedaRemota[key] = 'Método de búsqueda no configurado.';
      return;
    }

    this.buscandoRemoto[key]       = true;
    this.errorBusquedaRemota[key]  = '';

    this.buscarTimeouts[key] = setTimeout(() => {
      metodo.call(servicio, texto).subscribe({
        next: (data: SelectOption[]) => {
          console.log(`[FormularioComponent] "${key}" — búsqueda remota OK, ${data.length} opciones:`, data);
          this.buscandoRemoto[key] = false;
          if (esMulti) {
            // Conserva en la lista las opciones ya seleccionadas (aunque no
            // vengan en esta página de resultados) para que sigan como chips.
            const seleccionadosVal = this.multiSeleccionados[key] ?? [];
            const yaEnLista = campo.opciones ?? [];
            const seleccionadas = yaEnLista.filter(o => seleccionadosVal.some(v => v == o.value));
            const nuevas = data.filter(d => !seleccionadas.some(s => s.value == d.value));
            campo.opciones = [...seleccionadas, ...nuevas];
          } else {
            campo.opciones = data;
          }
        },
        error: (err: unknown) => {
          console.error(`[FormularioComponent] "${key}" — error en búsqueda remota:`, err);
          this.buscandoRemoto[key]      = false;
          this.errorBusquedaRemota[key] = 'Error al cargar. Revisa la consola.';
        },
      });
    }, 350);
  }

  cerrarMultiSelect(): void { this.multiAbierto = null; }

  toggleMultiOpcion(campo: CampoFormulario, op: SelectOption): void {
    const key = campo.campo!;
    if (!this.multiSeleccionados[key]) this.multiSeleccionados[key] = [];
    const idx = this.multiSeleccionados[key].findIndex(v => v == op.value);
    if (idx >= 0) this.multiSeleccionados[key].splice(idx, 1);
    else          this.multiSeleccionados[key].push(op.value);
    this.campoChange.emit({ campo: key, value: [...this.multiSeleccionados[key]] });
  }

  isMultiSel(campo: string, value: any): boolean {
    return (this.multiSeleccionados[campo] ?? []).some(v => v == value);
  }

  removeMultiItem(campo: string, value: any, event: Event): void {
    event.stopPropagation();
    const arr = this.multiSeleccionados[campo] ?? [];
    this.multiSeleccionados[campo] = arr.filter(v => v != value);
    this.campoChange.emit({ campo, value: [...this.multiSeleccionados[campo]] });
  }

  getLabelForValue(campo: CampoFormulario, value: any): string {
    return campo.opciones?.find(o => o.value == value)?.label?.toString() ?? String(value);
  }

  opcionesMultiFiltradas(campo: CampoFormulario): SelectOption[] {
    // Con búsqueda remota el backend ya filtró por el texto — no re-filtrar en cliente
    // (el backend puede matchear por cédula/código, que no aparece en el label).
    if (campo.apiConfig?.metodoBusqueda) return campo.opciones ?? [];
    const texto = (this.multiSearchTexto[campo.campo!] ?? '').toLowerCase();
    return (campo.opciones ?? []).filter(op => op.label.toString().toLowerCase().includes(texto));
  }

  seleccionarTodos(campo: CampoFormulario): void {
    this.multiSeleccionados[campo.campo!] = (campo.opciones ?? []).map(op => op.value);
    this.campoChange.emit({ campo: campo.campo!, value: [...this.multiSeleccionados[campo.campo!]] });
  }

  deseleccionarTodos(campo: CampoFormulario): void {
    this.multiSeleccionados[campo.campo!] = [];
    this.campoChange.emit({ campo: campo.campo!, value: [] });
  }

  /** Actualiza las opciones de un campo multi-select desde fuera (ej: al filtrar) */
  setOpciones(campoClave: string, opciones: SelectOption[]): void {
    const c = this.campos.find(f => f.campo === campoClave);
    if (c) c.opciones = opciones;
  }

  toggleSearchSelect(campo: CampoFormulario, event: MouseEvent): void {
    const key = campo.campo!;
    if (this.searchAbierto === key) { this.searchAbierto = null; return; }
    this.dropdownPos[key] = this.calcularPosicionDropdown(event.currentTarget as HTMLElement);
    this.searchAbierto = key;
    this.searchTexto[key] = '';
    if (campo.apiConfig?.metodoBusqueda) this.dispararBusquedaRemota(campo, '', false);
  }

  cerrarSearchSelect(): void {
    this.searchAbierto = null;
  }

  seleccionarSearchOption(campo: CampoFormulario, op: SelectOption): void {
    this.formulario.patchValue({ [campo.campo!]: op.value });
    this.formulario.get(campo.campo!)?.markAsTouched();
    this.labelsPorCampo[campo.campo!] = String(op.label);
    this.searchAbierto = null;
    this.campoChange.emit({ campo: campo.campo!, value: op.value });
  }

  opcionesFiltradas(campo: CampoFormulario): SelectOption[] {
    // Con búsqueda remota el backend ya filtró por el texto — no re-filtrar en cliente.
    if (campo.apiConfig?.metodoBusqueda) return campo.opciones ?? [];
    const texto = (this.searchTexto[campo.campo!] ?? '').toLowerCase();
    return (campo.opciones ?? []).filter((op) =>
      op.label.toString().toLowerCase().includes(texto),
    );
  }

  abrirPanel(campo: CampoFormulario): void {
    this.panelCampo = campo;
  }

  cerrarPanel(): void {
    this.panelCampo = null;
  }

  seleccionarOpcion(op: SelectOption): void {
    if (!this.panelCampo?.campo) return;
    this.formulario.patchValue({ [this.panelCampo.campo]: op.value });
    this.formulario.get(this.panelCampo.campo)?.markAsTouched();
    this.labelsPorCampo[this.panelCampo.campo] = String(op.label);
    this.cerrarPanel();
  }

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private pruebaApiService: PruebaApiService,
    private PaletaColoresService: PaletaColoresService,
    private apiFactory: ApiFactoryService,
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarApis();

    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    }, 1000);
  }

  cargarOpcionesApi(campo: CampoFormulario) {
    if (!campo.apiConfig) return;

    const servicio = this.apiFactory.obtenerServicio(campo.apiConfig.servicio);

    if (!servicio) {
      console.warn('Servicio no encontrado:', campo.apiConfig.servicio);
      return;
    }

    const metodo = servicio[campo.apiConfig.metodo];

    if (!metodo) {
      console.warn('Método no encontrado:', campo.apiConfig.metodo);
      return;
    }

    metodo.call(servicio).subscribe({
      next: (data: SelectOption[]) => {
        console.log('Opciones cargadas:', data);

        campo.opciones = data;
      },

      error: (err: unknown) => {
        console.error('Error API:', err);
      },
    });
  }

  cargarApis() {
    this.campos.forEach((campo) => {
      // Los campos con metodoBusqueda cargan sus opciones bajo demanda al abrir
      // el dropdown (ver toggleSearchSelect/toggleMultiSelect), no de una vez aquí.
      if (
        (campo.tipo === 'select' || campo.tipo === 'modal-select' || campo.tipo === 'search-select' || campo.tipo === 'multi-select')
        && campo.apiConfig && !campo.apiConfig.metodoBusqueda
      ) {
        this.cargarOpcionesApi(campo);
      }

      if (campo.tipo === 'grupo' && campo.camposHijos) {
        campo.camposHijos.forEach((hijo) => {
          if (hijo.tipo === 'select' && hijo.apiConfig) {
            this.cargarOpcionesApi(hijo);
          }
        });
      }
    });
  }
  crearFormulario() {
    const group: any = {};

    this.campos.forEach((campo) => {
      // SI ES UN GRUPO
      if (campo.tipo === 'grupo' && campo.camposHijos) {
        campo.camposHijos.forEach((hijo) => {
          const validators = [];

          if (hijo.obligatorio) validators.push(Validators.required);

          if (hijo.caracterMin)
            validators.push(Validators.minLength(hijo.caracterMin));

          if (hijo.caracterMax)
            validators.push(Validators.maxLength(hijo.caracterMax));

          if (hijo.validar === 'number')
            validators.push(Validators.pattern('^[0-9]+$'));

          if (hijo.validar === 'celular')
            validators.push(Validators.pattern('^[0-9]{10}$'));

          if (hijo.validar === 'no-number')
            validators.push(Validators.pattern('^[a-zA-Z ]+$'));

          group[hijo.campo!] = ['', validators];
        });
      }

      // BOTON-ACCION / MULTI-SELECT: no necesitan FormControl
      else if (campo.tipo === 'boton-accion' || campo.tipo === 'multi-select') {
        return;
      }

      // CAMPO NORMAL
      else {
        const validators = [];

        if (campo.obligatorio) validators.push(Validators.required);

        if (campo.caracterMin)
          validators.push(Validators.minLength(campo.caracterMin));

        if (campo.caracterMax)
          validators.push(Validators.maxLength(campo.caracterMax));

        if (campo.validar === 'number')
          validators.push(Validators.pattern('^[0-9]+$'));

        if (campo.validar === 'celular')
          validators.push(Validators.pattern('^[0-9]{10}$'));

        if (campo.validar === 'no-number')
          validators.push(Validators.pattern('^[a-zA-Z ]+$'));

        group[campo.campo!] = ['', validators];
      }
    });

    this.formulario = this.fb.group(group);
  }

  reset(): void {
    this.formulario.reset();
    this.labelsPorCampo    = {};
    this.searchAbierto     = null;
    this.searchTexto       = {};
    this.multiSeleccionados = {};
    this.multiAbierto      = null;
    this.multiSearchTexto  = {};
  }

  onFileChange(event: any, campo: string) {
    const file = event.target.files[0];

    if (!file) return;

    this.formulario.patchValue({
      [campo]: file,
    });
  }

  trackByCampo(index: number, campo: any) {
    return campo.campo || index;
  }

  onSubmit() {
    if (this.formulario.invalid) return;

    if (!this.submitConfig) {
      // Combinar valores del FormGroup con los multi-selects
      this.formSubmit.emit({ ...this.formulario.value, ...this.multiSeleccionados });
      return;
    }

    const servicio = this.apiFactory.obtenerServicio(this.submitConfig.servicio);
    if (!servicio) {
      console.warn('Servicio no encontrado:', this.submitConfig.servicio);
      return;
    }

    const metodo = servicio[this.submitConfig.metodo];
    if (!metodo) {
      console.warn('Método no encontrado:', this.submitConfig.metodo);
      return;
    }

    this.loadingService.show();

    metodo.call(servicio, this.formulario.value).subscribe({
      next: (res: any) => {
        this.loadingService.hide();
        this.formulario.reset();
        Swal.fire({
          icon: 'success',
          title: '¡Guardado!',
          text: res?.mensaje ?? 'Registro creado correctamente.',
          confirmButtonColor: 'var(--color-primary)',
        });
      },
      error: (err: any) => {
        this.loadingService.hide();
        console.error('Error al guardar:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.mensaje ?? 'No se pudo completar la operación.',
          confirmButtonColor: 'var(--color-primary)',
        });
      },
    });
  }
}
