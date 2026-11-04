import { Component } from '@angular/core';
import { ColumnaTabla } from '../../../interfaces/tabla';
import { TablaDinamicaComponent } from "../tabla-dinamica/tabla-dinamica.component";
import { TarjetasDinamicasComponent } from "../tarjetas-dinamicas/tarjetas-dinamicas.component";

@Component({
  selector: 'app-tabla-usuarios',
  imports: [TablaDinamicaComponent, TarjetasDinamicasComponent],
  templateUrl: './tabla-usuarios.component.html',

})
export class TablaUsuariosComponent {

  // ==========================
  // 📊 DATOS
  // ==========================
  items: any[] = [];
  totalItems = 0;

  // ==========================
  // 📄 PAGINACIÓN
  // ==========================
  paginaActual = 1;
  pageSize = 10;

  // ==========================
  // ⏳ ESTADO
  // ==========================
  cargando = false;

  // ==========================
  // 🔍 FILTROS
  // ==========================
  search = '';

  filtros = {
    cedula: '',
    genero: '',
    fecha_registro: '',
  };

  // ==========================
  // 📦 OPCIONES FILTROS
  // ==========================
  cedulasUnicas: { valor: string; label: string }[] = [];
  generosUnicos: { valor: string; label: string }[] = [];
  fechasRegistro: { valor: string; label: string }[] = [];

  // ==========================
  // 📊 CONFIG TABLA
  // ==========================
  columnas: ColumnaTabla[] = [
    { key: 'numero', label: '#', tipo: 'numero' },
    { key: 'nombre', label: 'Nombre', truncate: true },
    { key: 'cedula', label: 'Cédula' },
    { key: 'fecha_nacimiento', label: 'Fecha nacimiento', tipo: 'fecha' },
    { key: 'edad', label: 'Edad', tipo: 'numero' },
    { key: 'genero', label: 'Género' },
    { key: 'fecha_registro', label: 'Fecha registro', tipo: 'fecha' },
  ];

  // ==========================
  // 📱 CONFIG TARJETAS
  // ==========================
  configTarjetas = {
    titulo: {
      key: 'nombre',
      icon: 'fas fa-user',
    },
    subtitulo: {
      key: 'cedula',
      icon: 'fas fa-id-card',
    },
    campos: [
      {
        key: 'edad',
        label: 'Edad',
        icon: 'fas fa-birthday-cake',
        tipo: 'numero',
      },
      {
        key: 'genero',
        label: 'Género',
        icon: 'fas fa-venus-mars',
      },
      {
        key: 'fecha_nacimiento',
        label: 'Nacimiento',
        icon: 'fas fa-calendar-alt',
      },
      {
        key: 'fecha_registro',
        label: 'Registro',
        icon: 'fas fa-clock',
      },
    ],
    colorClase: () => 'border-gray-200 bg-white',
  };

  // ==========================
  // 🔄 CICLO DE VIDA
  // ==========================
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // ==========================
  // 🧪 DATOS FALSOS
  // ==========================
  cargarUsuarios() {
    this.cargando = true;

    setTimeout(() => {
      const usuariosMock = this.generarUsuariosMock();

      this.totalItems = usuariosMock.length;

      this.items = usuariosMock
        .slice(
          (this.paginaActual - 1) * this.pageSize,
          this.paginaActual * this.pageSize
        )
        .map((u, index) => ({
          ...u,
          numero:
            (this.paginaActual - 1) * this.pageSize + index + 1,
        }));

      // 🔹 Filtros dinámicos
      this.cedulasUnicas  = [...new Set(usuariosMock.map(u => u.cedula))].map(v => ({ valor: v, label: v }));
      this.generosUnicos  = [...new Set(usuariosMock.map(u => u.genero))].map(v => ({ valor: v, label: v }));
      this.fechasRegistro = [...new Set(usuariosMock.map(u => u.fecha_registro))].map(v => ({ valor: v, label: v }));

      this.cargando = false;
    }, 600);
  }

  // ==========================
  // 🧪 GENERADOR MOCK
  // ==========================
  generarUsuariosMock() {
    const generos = ['Masculino', 'Femenino'];
    const nombres = [
      'Iverson Tarazona',
      'Ana Gómez',
      'Carlos Pérez',
      'Laura Martínez',
      'Juan Rodríguez',
      'María Torres',
      'Pedro Ramírez',
      'Sofía López',
    ];

    return Array.from({ length: 35 }).map((_, i) => {
      const fechaNacimiento = this.randomDate(
        new Date(1985, 0, 1),
        new Date(2005, 0, 1)
      );

      const fechaRegistro = this.randomDate(
        new Date(2022, 0, 1),
        new Date()
      );

      return {
        nombre: nombres[i % nombres.length],
        cedula: `10${1000000 + i}`,
        genero: generos[i % 2],
        fecha_nacimiento: this.formatDate(fechaNacimiento),
        edad: this.calcularEdad(fechaNacimiento),
        fecha_registro: this.formatDate(fechaRegistro),
      };
    });
  }

  // ==========================
  // 🛠 UTILIDADES
  // ==========================
  randomDate(start: Date, end: Date): Date {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  calcularEdad(fecha: Date): number {
    const diff = Date.now() - fecha.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  }

  // ==========================
  // 🔎 EVENTOS
  // ==========================
  onBuscar(valor: string) {
    this.search = valor;
    this.paginaActual = 1;
    this.cargarUsuarios();
  }

  onFiltrosChange(valores: any) {
    this.filtros = { ...this.filtros, ...valores };
    this.paginaActual = 1;
    this.cargarUsuarios();
  }

  onPaginaChange(pagina: number) {
    this.paginaActual = pagina;
    this.cargarUsuarios();
  }

}
