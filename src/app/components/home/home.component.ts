import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../services/eventos.service';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faCalendarDays, faCalendarPlus, faListCheck, faListUl, faMicrophone, faPlus, faSearch, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { faDev } from '@fortawesome/free-brands-svg-icons';
import { CalendarComponent } from "../calendar/calendar.component";
import { RouterLink } from '@angular/router';
import { MenuComponent } from "../menu/menu.component";
import { HeaderComponent } from "../header/header.component";
import { TareasService } from '../../services/tareas.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [FontAwesomeModule, CalendarComponent, RouterLink, MenuComponent, HeaderComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  tareasCount: number = 0;
  tareas: any[] = [];
  faSquarePlus = faSquarePlus;
  faPlus = faPlus;
  faListCheck = faListCheck;
  faSearch = faSearch;
  faBell = faBell;
  faListUl = faListUl;
  faCalendarPlus = faCalendarPlus;
  faCalendarDays = faCalendarDays;
  faMicrophone = faMicrophone;
  diaSemana: string = '';
  diaNumero: string = '';

  constructor(private tareaService: TareasService) { }

  ngOnInit(): void {
    this.obtenerFechaFormateada();
    this.getTareasToday();

  }

  obtenerFechaFormateada(): void {
    const fecha = new Date();
    const opciones: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      weekday: 'long',
    };

    // Formato inicial: "sábado 24" → Lo separamos y reordenamos
    const partes = new Intl.DateTimeFormat('es-ES', opciones).formatToParts(fecha);
    this.diaNumero = partes.find(part => part.type === 'day')?.value ?? '';
    this.diaSemana = partes.find(part => part.type === 'weekday')?.value ?? '';

  }

  getTareasCount(): number {
    this.tareaService.getTareas
    this.tareasCount = this.tareas.filter(
      tarea => {
      const estado = tarea.estado?.toLowerCase();
      return estado !== 'completado' && estado !== 'finalizado';
      }
    ).length;
    return this.tareasCount;
  }

  getTareasToday(){

    this.tareaService.getTareas().subscribe({

      next: (response) => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const tareasFiltradas = response.filter((tarea: any) => {
        const estado = tarea.estado?.toLowerCase();
        if (estado === 'completado' || estado === 'finalizado') return false;

        const fechaInicio = new Date(tarea.fechaInicio);
        const fechaFin = new Date(tarea.fechaFin);
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin.setHours(0, 0, 0, 0);

        // hoy >= fechaInicio && hoy <= fechaFin
        return hoy >= fechaInicio && hoy <= fechaFin;
      }).sort((a: any, b: any) => {
        const hoyStr = hoy.toISOString().slice(0, 10);
        const aFin = a.fechaFin.slice(0, 10);
        const bFin = b.fechaFin.slice(0, 10);

        // Las que finalizan hoy primero
        if (aFin === hoyStr && bFin !== hoyStr) return -1;
        if (aFin !== hoyStr && bFin === hoyStr) return 1;
        // Si ambos o ninguno finalizan hoy, ordenar por fechaFin ascendente
        return new Date(a.fechaFin).getTime() - new Date(b.fechaFin).getTime();
      });
      this.tareas = tareasFiltradas;
      this.getTareasCount();
      console.log('Tareas filtradas del día:', tareasFiltradas);
      },
      error: (error) => {
      console.error('Error al obtener las tareas del día:', error);
      }
    });

  }



}
