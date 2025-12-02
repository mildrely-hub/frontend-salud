import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './agendar-cita.html',
  styleUrls: ['./agendar-cita.css']
})
export class AgendarCitaComponent implements OnInit {
  especialidad: string = '';
  medico: string = '';
  fecha: string = '';
  hora: string = '';
  motivo: string = '';
  sintomas: string = '';
  
  especialidades: string[] = [
    'Medicina General',
    'Cardiología',
    'Pediatría',
    'Dermatología',
    'Ginecología',
    'Odontología',
    'Psicología',
    'Oftalmología'
  ];
  
  medicos: any[] = [
    { id: 1, nombre: 'Dr. Carlos Rodríguez', especialidad: 'Cardiología', disponible: true },
    { id: 2, nombre: 'Dra. Ana Martínez', especialidad: 'Dermatología', disponible: true },
    { id: 3, nombre: 'Dr. Luis Gómez', especialidad: 'Medicina General', disponible: true },
    { id: 4, nombre: 'Dra. María López', especialidad: 'Pediatría', disponible: true }
  ];
  
  horarios: string[] = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];
  
  fechasDisponibles: string[] = [];
  medicosFiltrados: any[] = [];
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    this.generarFechasDisponibles();
    this.medicosFiltrados = [...this.medicos];
  }
  
  generarFechasDisponibles(): void {
    const hoy = new Date();
    for (let i = 1; i <= 30; i++) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() + i);
      const diaSemana = fecha.getDay();
      if (diaSemana >= 1 && diaSemana <= 5) {
        const fechaStr = fecha.toISOString().split('T')[0];
        this.fechasDisponibles.push(fechaStr);
      }
    }
  }
  
  formatFecha(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const opciones: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  }
  
  onEspecialidadChange(): void {
    if (this.especialidad) {
      this.medicosFiltrados = this.medicos.filter(
        m => m.especialidad === this.especialidad && m.disponible
      );
      if (this.medicosFiltrados.length === 0) {
        this.medico = '';
      }
    } else {
      this.medicosFiltrados = [...this.medicos];
    }
  }
  
  onSubmit(): void {
    if (!this.validarFormulario()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    
    const cita = {
      especialidad: this.especialidad,
      medico: this.medico,
      fecha: this.fecha,
      hora: this.hora,
      motivo: this.motivo,
      sintomas: this.sintomas,
      fechaCreacion: new Date().toISOString(),
      estado: 'PENDIENTE'
    };
    
    console.log('Cita agendada:', cita);
    
    alert(`✅ Cita agendada exitosamente\n\n📅 Fecha: ${this.formatFecha(this.fecha)}\n⏰ Hora: ${this.hora}\n👨‍⚕️ Médico: ${this.medico}\n🎯 Motivo: ${this.motivo}`);
    
    this.router.navigate(['/citas']);
  }
  
  validarFormulario(): boolean {
    return !!(
      this.especialidad &&
      this.medico &&
      this.fecha &&
      this.hora &&
      this.motivo
    );
  }
  
  cancelar(): void {
    if (confirm('¿Estás seguro de cancelar el agendamiento de la cita?')) {
      this.router.navigate(['/citas']);
    }
  }
}