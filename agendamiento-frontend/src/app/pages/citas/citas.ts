import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './citas.html',
  styleUrls: ['./citas.css']
})
export class CitasComponent implements OnInit {
  // --- Estado de la Pantalla ---
  pasoActual: number = 1;
  isLoading: boolean = false;
  usuario: any = null;
  token: string | null = null;
  mostrarExito: boolean = false;
  citaConfirmada: any = null;

  // --- Formulario (Basado en agendar-cita.ts) ---
  especialidad: string = '';
  medicoSeleccionado: any = null;
  fechaSeleccionada: string = '';
  horaSeleccionada: string = '';
  motivo: string = '';
  sintomas: string = '';
  preferencias: string = '';
  busquedaMedico: string = '';

  // --- Listas de Datos ---
  especialidades: string[] = ['Medicina General', 'Cardiología', 'Pediatría', 'Dermatología', 'Ginecología', 'Odontología'];
  
  medicos: any[] = [
    { id: 1, nombreCompleto: 'Dr. Carlos Rodríguez', especialidad: 'Cardiología' },
    { id: 2, nombreCompleto: 'Dra. Ana Martínez', especialidad: 'Dermatología' },
    { id: 3, nombreCompleto: 'Dr. Luis Gómez', especialidad: 'Medicina General' },
    { id: 4, nombreCompleto: 'Dra. María López', especialidad: 'Pediatría' }
  ];
  medicosFiltrados: any[] = [];
  horariosDisponibles: string[] = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  // --- Calendario ---
  mesActual: Date = new Date();
  diasMes: any[] = [];
  diasSemana: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token');
      const userStr = localStorage.getItem('usuario');
      if (userStr) {
        this.usuario = JSON.parse(userStr);
        console.log('Usuario actual:', this.usuario);
      } else {
        this.router.navigate(['/login']);
      }
    }
    this.medicosFiltrados = [...this.medicos];
    this.generarDiasMes();
  }

  // --- Métodos de Selección ---
  onEspecialidadChange(): void {
    this.medicosFiltrados = this.especialidad 
      ? this.medicos.filter(m => m.especialidad === this.especialidad)
      : [...this.medicos];
  }

  seleccionarMedico(m: any): void { this.medicoSeleccionado = m; }
  seleccionarFecha(f: string): void { this.fechaSeleccionada = f; }
  seleccionarHora(h: string): void { this.horaSeleccionada = h; }

  // --- Calendario ---
  mesAnterior(): void { this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() - 1, 1); this.generarDiasMes(); }
  mesSiguiente(): void { this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 1); this.generarDiasMes(); }

  generarDiasMes(): void {
    const year = this.mesActual.getFullYear();
    const month = this.mesActual.getMonth();
    const primerDia = new Date(year, month, 1).getDay();
    const ultimoDia = new Date(year, month + 1, 0).getDate();
    const dias = [];
    for (let i = 0; i < primerDia; i++) dias.push({ numero: '', fecha: '', disponible: false });
    for (let i = 1; i <= ultimoDia; i++) {
      const f = new Date(year, month, i);
      const fStr = f.toISOString().split('T')[0];
      dias.push({ numero: i, fecha: fStr, disponible: f >= new Date() && f.getDay() !== 0 });
    }
    this.diasMes = dias;
  }

  // --- ACCIÓN PRINCIPAL: GUARDAR ---
  confirmarCita(): void {
    if (!this.medicoSeleccionado || !this.fechaSeleccionada || !this.horaSeleccionada) {
      alert('Completa la selección de médico, fecha y hora.');
      return;
    }

    this.isLoading = true;

    // Lógica para obtener el ID de paciente desde el usuario logueado
    // Según tu DB, el usuario 28 debería tener un registro en la tabla pacientes.
    const idPacienteFinal = this.usuario?.id_paciente || this.usuario?.paciente?.id_paciente || 1; 

    const citaData = {
      pacienteId: Number(idPacienteFinal),
      medicoId: Number(this.medicoSeleccionado.id),
      fechaHora: `${this.fechaSeleccionada}T${this.horaSeleccionada}:00`,
      motivo: this.motivo || this.sintomas || 'Consulta General',
      sintomas: this.sintomas,
      duracionMinutos: 30,
      notas: this.preferencias
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:8080/api/citas', citaData, { headers })
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.citaConfirmada = res;
          this.mostrarExito = true;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error 400:', err.error);
          alert(`Error: ${err.error?.message || 'El ID de paciente no existe en la base de datos.'}`);
        }
      });
  }

  // --- Navegación ---
  siguientePaso(): void { this.pasoActual++; }
  pasoAnterior(): void { this.pasoActual--; }
  verMisCitas(): void { this.router.navigate(['/mis-citas']); }
  cerrarModal(): void { this.mostrarExito = false; this.router.navigate(['/mis-citas']); }
  nuevaCita(): void { this.mostrarExito = false; this.pasoActual = 1; this.medicoSeleccionado = null; }
}