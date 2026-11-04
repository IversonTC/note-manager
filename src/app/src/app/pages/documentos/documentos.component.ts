import { Component, OnInit, OnDestroy, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import {
  DocumentosService, Documento, CrearDocumentoDto,
  TipoPermiso, PersonaPermiso,
} from '../../services/documentos.service';
import { EmpresasService, EmpresaApi, CentroCostoApi } from '../../services/empresas.service';
import { ColaboradoresService, ColaboradorApi } from '../../services/colaboradores.service';

interface MdBtn { label: string; wrap: [string, string]; }

type Vista = 'preview' | 'editor' | 'split';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './documentos.component.html',
})
export class DocumentosComponent implements OnInit, OnDestroy {
  private svc       = inject(DocumentosService);
  private empresaSvc = inject(EmpresasService);
  private colabSvc  = inject(ColaboradoresService);
  private subs = new Subscription();

  // ── Lista ──────────────────────────────────────────────────────────────
  documentos:   Documento[] = [];
  cargandoLista = false;
  busqueda      = '';
  categoriaFiltro = '';

  // ── Documento activo ───────────────────────────────────────────────────
  docActivo: Documento | null = null;
  vista: Vista = 'preview';

  // ── Edición ────────────────────────────────────────────────────────────
  editTitulo    = '';
  editContenido = '';
  editCategoria = '';
  guardando     = false;
  hayPendientes = false;

  // ── Nuevo documento ────────────────────────────────────────────────────
  modalNuevo    = false;
  nuevoTitulo   = '';
  nuevoCategoria = '';
  creando       = false;

  // ── Eliminar ───────────────────────────────────────────────────────────
  modalEliminar = false;

  // ── Permisos (lista plana de personas + tipo, con selector jerárquico de apoyo) ──
  modalPermisos     = false;
  cargandoPermisos  = false;
  guardandoPermisos = false;
  docPublico        = false;
  personas: PersonaPermiso[] = [];
  tiposPermiso: TipoPermiso[] = [];

  // Selector jerárquico empresa → centro de costo (solo para precargar/agregar en bloque)
  empresasDisponibles: EmpresaApi[] = [];
  centrosCostoPorEmpresa: Record<string, CentroCostoApi[]> = {};
  cargandoCentros: Record<string, boolean> = {};
  empresaCentroSel = '';
  centroCostoSel   = '';
  tipoBulkSel      = 1;

  colaboradoresPreview: ColaboradorApi[] = [];
  cargandoColaboradoresPreview = false;
  private seleccionPreview = new Set<string>();

  // Búsqueda directa para agregar una persona puntual
  buscarUsuarioTexto = '';
  usuariosSugeridos: ColaboradorApi[] = [];
  buscandoUsuario = false;
  private buscarUsuario$ = new Subject<string>();

  // ── Upload archivo .md ─────────────────────────────────────────────────
  @ViewChild('fileInput')  fileInput!:  ElementRef<HTMLInputElement>;
  @ViewChild('imgInput')   imgInput!:   ElementRef<HTMLInputElement>;
  @ViewChild('editor')     editorRef!:  ElementRef<HTMLTextAreaElement>;

  subiendoImagen = false;

  // ── Toolbar markdown ────────────────────────────────────────────────────
  readonly markdownBtns: MdBtn[] = [
    { label: 'B',   wrap: ['**', '**'] },
    { label: 'I',   wrap: ['*',  '*']  },
    { label: 'H1',  wrap: ['# ', '']   },
    { label: 'H2',  wrap: ['## ', '']  },
    { label: 'H3',  wrap: ['### ', ''] },
    { label: '—',   wrap: ['\n---\n', ''] },
    { label: '`',   wrap: ['`', '`']   },
    { label: '[ ]', wrap: ['- [ ] ', ''] },
    { label: '•',   wrap: ['- ', '']   },
  ];

  // ── Toast ──────────────────────────────────────────────────────────────
  toastMsg  = '';
  toastTipo: 'ok' | 'error' = 'ok';
  private toastTimer: any;

  ngOnInit(): void {
    this.cargarLista();

    this.subs.add(
      this.buscarUsuario$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(q => {
          this.buscandoUsuario = true;
          return this.colabSvc.getAliados({ buscar: q, porPagina: 10, estado: 1 });
        }),
      ).subscribe({
        next: r  => { this.usuariosSugeridos = r.items; this.buscandoUsuario = false; },
        error: () => { this.buscandoUsuario = false; },
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // ── Carga ──────────────────────────────────────────────────────────────

  cargarLista(): void {
    this.cargandoLista = true;
    this.svc.getAll().subscribe({
      next: docs => { this.documentos = docs; this.cargandoLista = false; },
      error: ()   => { this.cargandoLista = false; },
    });
  }

  seleccionar(doc: Documento): void {
    if (this.hayPendientes && this.docActivo) {
      if (!confirm('Tienes cambios sin guardar. ¿Salir sin guardar?')) return;
    }
    this.docActivo    = doc;
    this.editTitulo   = doc.titulo;
    this.editContenido = doc.contenido;
    this.editCategoria = doc.categoria ?? '';
    this.hayPendientes = false;
    this.vista = 'preview';
  }

  onEditorChange(): void {
    this.hayPendientes = true;
  }

  // ── CRUD ───────────────────────────────────────────────────────────────

  guardar(): void {
    if (!this.docActivo) return;
    this.guardando = true;
    this.svc.actualizar(this.docActivo.id, {
      titulo:    this.editTitulo,
      contenido: this.editContenido,
      categoria: this.editCategoria || undefined,
    }).subscribe({
      next: doc => {
        Object.assign(this.docActivo!, doc);
        const idx = this.documentos.findIndex(d => d.id === doc.id);
        if (idx >= 0) this.documentos[idx] = { ...this.documentos[idx], ...doc };
        this.hayPendientes = false;
        this.guardando     = false;
        this.toast('ok', 'Documento guardado.');
      },
      error: () => { this.guardando = false; this.toast('error', 'Error al guardar.'); },
    });
  }

  abrirNuevo(): void {
    this.nuevoTitulo   = '';
    this.nuevoCategoria = '';
    this.modalNuevo    = true;
  }

  confirmarNuevo(): void {
    if (!this.nuevoTitulo.trim()) return;
    this.creando = true;
    const dto: CrearDocumentoDto = {
      titulo:    this.nuevoTitulo.trim(),
      contenido: `# ${this.nuevoTitulo.trim()}\n\nEmpieza a escribir aquí...`,
      categoria: this.nuevoCategoria.trim() || undefined,
    };
    this.svc.crear(dto).subscribe({
      next: doc => {
        this.documentos = [doc, ...this.documentos];
        this.modalNuevo = false;
        this.creando    = false;
        this.seleccionar(doc);
        this.vista = 'editor';
        this.toast('ok', 'Documento creado.');
      },
      error: () => { this.creando = false; this.toast('error', 'Error al crear el documento.'); },
    });
  }

  confirmarEliminar(): void {
    if (!this.docActivo) return;
    this.svc.eliminar(this.docActivo.id).subscribe({
      next: () => {
        this.documentos    = this.documentos.filter(d => d.id !== this.docActivo!.id);
        this.docActivo     = null;
        this.hayPendientes = false;
        this.modalEliminar = false;
        this.toast('ok', 'Documento eliminado.');
      },
      error: () => { this.modalEliminar = false; this.toast('error', 'Error al eliminar.'); },
    });
  }

  // ── Permisos: abrir / cerrar ─────────────────────────────────────────────

  abrirPermisos(): void {
    if (!this.docActivo) return;
    this.modalPermisos        = true;
    this.cargandoPermisos     = true;
    this.docPublico           = !!this.docActivo.publico;
    this.empresaCentroSel     = '';
    this.centroCostoSel       = '';
    this.colaboradoresPreview = [];
    this.seleccionPreview.clear();
    this.usuariosSugeridos    = [];
    this.buscarUsuarioTexto   = '';

    if (this.empresasDisponibles.length === 0) {
      this.empresaSvc.getEmpresas().subscribe(emp => (this.empresasDisponibles = emp));
    }
    if (this.tiposPermiso.length === 0) {
      this.svc.getTiposPermiso().subscribe(tipos => {
        this.tiposPermiso = tipos;
        if (tipos.length) this.tipoBulkSel = tipos[0].id_tipo;
      });
    }

    this.svc.getPermisos(this.docActivo.id).subscribe({
      next: personas => { this.personas = personas; this.cargandoPermisos = false; },
      error: ()       => { this.personas = [];       this.cargandoPermisos = false; },
    });
  }

  cerrarPermisos(): void {
    this.modalPermisos = false;
  }

  // ── Selector jerárquico de apoyo: empresa → centro de costo ──────────────
  // Solo sirve para precargar/agregar personas en bloque — lo que se persiste
  // siempre es la lista plana `personas` (codigo_colab + tipo).

  onEmpresaCentroChange(): void {
    this.centroCostoSel       = '';
    this.colaboradoresPreview = [];
    this.seleccionPreview.clear();
    if (this.empresaCentroSel) this.cargarCentrosCosto(this.empresaCentroSel);
  }

  private cargarCentrosCosto(nit: string): void {
    if (this.centrosCostoPorEmpresa[nit] || this.cargandoCentros[nit]) return;
    this.cargandoCentros[nit] = true;
    this.empresaSvc.getCentrosCosto(nit).subscribe({
      next: cs => { this.centrosCostoPorEmpresa[nit] = cs; this.cargandoCentros[nit] = false; },
      error: () => { this.centrosCostoPorEmpresa[nit] = []; this.cargandoCentros[nit] = false; },
    });
  }

  onCentroCostoChange(): void {
    this.colaboradoresPreview = [];
    this.seleccionPreview.clear();
    if (!this.empresaCentroSel || !this.centroCostoSel) return;

    this.cargandoColaboradoresPreview = true;
    this.colabSvc.getAliados({
      empresas: this.empresaCentroSel, centroCosto: this.centroCostoSel, estado: 1, porPagina: 500,
    }).subscribe({
      next: r => {
        this.colaboradoresPreview = r.items;
        r.items.forEach(c => this.seleccionPreview.add(c.codigo)); // preseleccionados por defecto
        this.cargandoColaboradoresPreview = false;
      },
      error: () => { this.cargandoColaboradoresPreview = false; },
    });
  }

  previewMarcado(codigo: string): boolean {
    return this.seleccionPreview.has(codigo);
  }

  togglePreview(codigo: string): void {
    if (this.seleccionPreview.has(codigo)) this.seleccionPreview.delete(codigo);
    else this.seleccionPreview.add(codigo);
  }

  /** Agrega a la lista final de permisos todas las personas marcadas del centro de costo cargado */
  agregarSeleccionDelCentro(): void {
    this.colaboradoresPreview
      .filter(c => this.seleccionPreview.has(c.codigo))
      .forEach(c => this.agregarPersona(c.codigo, c.nombre, this.tipoBulkSel));
  }

  // ── Búsqueda directa para agregar una persona puntual ────────────────────

  onBuscarUsuario(texto: string): void {
    this.buscarUsuarioTexto = texto;
    this.buscarUsuario$.next(texto);
  }

  /** Agrega la persona encontrada en el buscador directo con el tipo actualmente elegido */
  agregarUsuarioBuscado(c: ColaboradorApi): void {
    this.agregarPersona(c.codigo, c.nombre, this.tipoBulkSel);
  }

  // ── Lista final de personas con acceso ───────────────────────────────────

  agregarPersona(codigo: string, nombre: string, tipo: number): void {
    const existente = this.personas.find(p => p.codigo_colab === codigo);
    if (existente) existente.tipo = tipo;
    else this.personas.push({ codigo_colab: codigo, nombre, tipo });
  }

  quitarPersona(codigo: string): void {
    this.personas = this.personas.filter(p => p.codigo_colab !== codigo);
  }

  yaSeleccionadaPersona(codigo: string): boolean {
    return this.personas.some(p => p.codigo_colab === codigo);
  }

  nombreTipo(idTipo: number): string {
    return this.tiposPermiso.find(t => t.id_tipo === idTipo)?.nombre ?? '—';
  }

  // ── Guardar (publico + personas en un solo PUT) ──────────────────────────

  guardarPermisos(): void {
    if (!this.docActivo) return;
    this.guardandoPermisos = true;
    const personas = this.personas.map(p => ({ codigo_colab: p.codigo_colab, tipo: p.tipo }));

    this.svc.actualizar(this.docActivo.id, { publico: this.docPublico, personas }).subscribe({
      next: doc => {
        Object.assign(this.docActivo!, doc);
        const idx = this.documentos.findIndex(d => d.id === doc.id);
        if (idx >= 0) this.documentos[idx] = { ...this.documentos[idx], ...doc };
        this.guardandoPermisos = false;
        this.modalPermisos     = false;
        this.toast('ok', 'Permisos actualizados.');
      },
      error: () => {
        this.guardandoPermisos = false;
        this.toast('error', 'Error al guardar los permisos.');
      },
    });
  }

  // ── Upload .md ─────────────────────────────────────────────────────────

  abrirFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !file.name.endsWith('.md')) {
      this.toast('error', 'Solo se aceptan archivos .md');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const contenido = reader.result as string;
      const titulo    = file.name.replace(/\.md$/, '');
      this.creando    = true;
      this.svc.crear({ titulo, contenido }).subscribe({
        next: doc => {
          this.documentos = [doc, ...this.documentos];
          this.creando    = false;
          this.seleccionar(doc);
          this.toast('ok', `"${titulo}" importado.`);
        },
        error: () => { this.creando = false; this.toast('error', 'Error al importar el archivo.'); },
      });
    };
    reader.readAsText(file);
    (event.target as HTMLInputElement).value = '';
  }

  // ── Imagen en editor ───────────────────────────────────────────────────

  abrirSelectorImagen(): void {
    if (!this.docActivo) { this.toast('error', 'Guarda el documento antes de insertar imágenes.'); return; }
    this.imgInput.nativeElement.click();
  }

  onImagenSeleccionada(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.docActivo) return;

    const permitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!permitidos.includes(file.type)) { this.toast('error', 'Solo se permiten imágenes JPG, PNG, GIF, WEBP o SVG.'); return; }
    if (file.size > 10 * 1024 * 1024)    { this.toast('error', 'La imagen no puede superar 10 MB.'); return; }

    this.subiendoImagen = true;
    this.svc.subirImagen(this.docActivo.id, file).subscribe({
      next: ({ url }) => {
        this.insertarMd(`![${file.name}](${this.svc.urlAbsoluta(url)})`, '');
        this.subiendoImagen = false;
        this.toast('ok', 'Imagen insertada.');
      },
      error: () => { this.subiendoImagen = false; this.toast('error', 'Error al subir la imagen.'); },
    });
    (event.target as HTMLInputElement).value = '';
  }

  // ── Toolbar: insertar markdown ─────────────────────────────────────────

  insertarMd(antes: string, despues: string): void {
    const ta  = this.editorRef?.nativeElement;
    if (!ta) { this.editContenido += antes + despues; this.onEditorChange(); return; }
    const s   = ta.selectionStart;
    const e   = ta.selectionEnd;
    const sel = this.editContenido.slice(s, e);
    this.editContenido =
      this.editContenido.slice(0, s) + antes + sel + despues + this.editContenido.slice(e);
    this.onEditorChange();
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(s + antes.length, s + antes.length + sel.length);
    });
  }

  // ── Exportar PDF ───────────────────────────────────────────────────────

  generandoPDF = false;

  async descargarPDF(): Promise<void> {
    if (!this.docActivo || this.generandoPDF) return;
    this.generandoPDF = true;
    this.toast('ok', 'Generando PDF…');

    try {
      const [{ marked }, { default: html2canvas }, { jsPDF }] = await Promise.all([
        import('marked'),
        import('html2canvas'),
        import('jspdf'),
      ]);

      const html   = await marked.parse(this.docActivo.contenido ?? '');
      const titulo = this.docActivo.titulo;
      const fecha  = this.svc.formatearFecha(this.docActivo.fecha_actualizacion);
      const cat    = this.docActivo.categoria ?? '';

      // Nodo temporal fuera de pantalla
      // Elimina el primer h1 del contenido (lo mostramos en el encabezado)
      const htmlSinH1   = html.replace(/<h1[^>]*>.*?<\/h1>\s*/i, '');
      const htmlConImgs = await this.imagenesToBase64(htmlSinH1);

      const el = document.createElement('div');
      el.style.cssText = [
        'position:absolute', 'top:-9999px', 'left:-9999px',
        'width:794px', 'padding:48px 56px',
        'font-family:Georgia,serif', 'font-size:11pt',
        'color:#1f2937', 'line-height:1.75',
        'background:#ffffff',
      ].join(';');

      el.innerHTML = `
        <div style="margin-bottom:1.8rem;padding-bottom:1rem;border-bottom:2px solid #e5e7eb">
          <h1 style="font-size:1.8rem;font-weight:700;color:#111827;margin:0 0 0.3rem">${titulo}</h1>
          <p style="font-size:0.78rem;color:#9ca3af;margin:0">
            ${cat ? `${cat} &nbsp;·&nbsp; ` : ''}Actualizado: ${fecha}
          </p>
        </div>
        <style>
          h1,h2,h3,h4{font-weight:700;color:#111827;margin:1.4em 0 0.4em;line-height:1.3}
          h1{font-size:1.5rem;border-bottom:1px solid #e5e7eb;padding-bottom:.25em}
          h2{font-size:1.25rem}h3{font-size:1.05rem}
          p{margin-bottom:.9em}
          ul,ol{padding-left:1.4em;margin-bottom:.9em}
          ul{list-style:disc}ol{list-style:decimal}
          li{margin-bottom:.25em}
          blockquote{border-left:3px solid #d1d5db;margin:1em 0;padding:.5em 1em;color:#6b7280;background:#f9fafb;border-radius:0 4px 4px 0}
          code{font-family:'Courier New',monospace;font-size:.85em;background:#f3f4f6;padding:.1em .35em;border-radius:3px;color:#be123c}
          pre{background:#f3f4f6;border-radius:6px;padding:.9em 1.1em;margin-bottom:1em;overflow:hidden}
          pre code{background:none;color:#1f2937;padding:0}
          table{width:100%;border-collapse:collapse;margin-bottom:1em;font-size:.88em}
          th{background:#f3f4f6;font-weight:600;text-align:left}
          th,td{padding:.4em .65em;border:1px solid #e5e7eb}
          tr:nth-child(even) td{background:#f9fafb}
          hr{border:none;border-top:1px solid #e5e7eb;margin:1.4em 0}
          img{max-width:100%;border-radius:4px;margin:.5em 0;display:block}
          a{color:#2563eb}
        </style>
        ${htmlConImgs}`;

      document.body.appendChild(el);

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: false,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
      });

      document.body.removeChild(el);

      const A4_W = 210;
      const A4_H = 297;
      const MARGIN = 10;
      const imgW = A4_W - MARGIN * 2;
      const imgH = (canvas.height * imgW) / canvas.width;
      const pageH = A4_H - MARGIN * 2;

      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      let y = MARGIN;
      let restante = imgH;

      while (restante > 0) {
        const sliceH   = Math.min(restante, pageH);
        const slicePct = sliceH / imgH;
        const srcY     = ((imgH - restante) / imgH) * canvas.height;
        const srcH     = slicePct * canvas.height;

        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width  = canvas.width;
        tmpCanvas.height = srcH;
        tmpCanvas.getContext('2d')!.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

        pdf.addImage(tmpCanvas.toDataURL('image/jpeg', 0.92), 'JPEG', MARGIN, y, imgW, sliceH);
        restante -= pageH;
        if (restante > 0) { pdf.addPage(); y = MARGIN; }
      }

      pdf.save(`${titulo.replace(/[\\/:*?"<>|]/g, '_')}.pdf`);
      this.toast('ok', 'PDF descargado.');
    } catch (err) {
      console.error('descargarPDF:', err);
      this.toast('error', 'Error al generar el PDF.');
    } finally {
      this.generandoPDF = false;
    }
  }

  // ── Vista ──────────────────────────────────────────────────────────────

  setVista(v: Vista): void { this.vista = v; }

  // ── Helpers ────────────────────────────────────────────────────────────

  get docsFiltrados(): Documento[] {
    const q   = this.busqueda.toLowerCase().trim();
    const cat = this.categoriaFiltro;
    return this.documentos.filter(d => {
      if (cat && d.categoria !== cat) return false;
      if (q && !d.titulo.toLowerCase().includes(q) && !d.contenido?.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  get categorias(): string[] { return this.svc.categorias(this.documentos); }

  formatFecha(f: string): string { return this.svc.formatearFecha(f); }

  /** Reemplaza src de imágenes por base64 para que html2canvas no tenga problemas CORS */
  private async imagenesToBase64(html: string): Promise<string> {
    const parser = new DOMParser();
    const doc    = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    const imgs   = Array.from(doc.querySelectorAll('img'));

    await Promise.allSettled(
      imgs.map(async img => {
        try {
          img.src = await this.imgUrlABase64(img.src);
        } catch {
          img.remove();
        }
      })
    );

    return doc.querySelector('div')!.innerHTML;
  }

  private imgUrlABase64(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const image       = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width  = image.naturalWidth;
        canvas.height = image.naturalHeight;
        canvas.getContext('2d')!.drawImage(image, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      image.onerror = () => reject(new Error(`No se pudo cargar: ${src}`));
      // El parámetro fuerza al navegador a hacer una petición fresca con CORS
      image.src = src + (src.includes('?') ? '&_pdf=1' : '?_pdf=1');
    });
  }

  private toast(tipo: 'ok' | 'error', msg: string): void {
    this.toastTipo = tipo;
    this.toastMsg  = msg;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toastMsg = ''), 3000);
  }
}
