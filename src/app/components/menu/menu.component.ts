import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../services/eventos.service';
import { TareasService } from '../../services/tareas.service';
import { Evento } from '../../interfaces/evento';
import { Tarea } from '../../interfaces/tarea';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { faAward, faBell, faCalendarDay, faCalendarDays, faCalendarPlus, faCircle, faClock, faHome, faListCheck, faListUl, faMicrophone, faPencil, faPlus, faRectangleXmark, faRightFromBracket, faSearch, faSquarePlus, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, FontAwesomeModule, CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  constructor(private eventoService: EventosService, private tareaService: TareasService) { }
  tareasCount: number = 0;
  eventoCreate?: Evento;
  tareaCreate?: Tarea;
  disabled: string = '';
  faPencil = faPencil;
  faTrash = faTrash;
  faCircle = faCircle;
  faHome = faHome;
  faListCheck = faListCheck;
  faSearch = faSearch;
  faBell = faBell;
  faListUl = faListUl;
  faAward = faAward
  faUncompleted = faRectangleXmark
  faCalendarPlus = faCalendarPlus;
  faCalendarDays = faCalendarDays;
    faCalendarDay = faCalendarDay;
  faMicrophone = faMicrophone;
  faSquarePlus = faSquarePlus;
  faClock = faClock;
  faExit = faRightFromBracket
  selectedOption: 'tarea' | 'evento' = 'tarea';
  tareas: any[] = [];

  tareaData: Tarea = {
    titulo: '',
    descripcion: '',
    estado: '',
    tipo: '',
    fechaInicio: new Date,
    fechaFin: new Date
  };

  eventoData: Evento = {
    nombreEvento: '',
    descripcion: '',
    fechaInicio: new Date(),
    fechaFin: new Date()
  };

  ngOnInit(): void {
    const urlParts = window.location.pathname.split('/');
    this.disabled = urlParts[urlParts.length - 1] || '';

  }

  openModal() {
    const modal: any = document.getElementById('create');
    if (modal) {
      modal.showModal();
    }
  }

  create() {
    if (this.selectedOption === 'tarea') {
      const tarea = this.tareaData;
      if (!tarea.titulo || !tarea.descripcion || !tarea.estado || !tarea.tipo) {
        Swal.fire('Error', 'Completa todos los campos de la tarea.', 'error');
        return;
      }

      this.tareaService.crearTarea(tarea).subscribe({
        next: () => {
          Swal.fire('Tarea creada', tarea.titulo, 'success');
          this.tareaData = { titulo: '', descripcion: '', estado: '', tipo: '', fechaInicio: new Date, fechaFin: new Date };
        },
        error: (err) => Swal.fire('Error', err.message, 'error')
      });
    } else if (this.selectedOption === 'evento') {
      const evento = this.eventoData;
      if (!evento.nombreEvento || !evento.descripcion || !evento.fechaInicio || !evento.fechaFin) {
        Swal.fire('Error', 'Completa todos los campos del evento.', 'error');
        return;
      }

      this.eventoService.crearEvento(evento).subscribe({
        next: () => {
          Swal.fire('Evento creado', evento.nombreEvento, 'success');
          this.eventoData = { nombreEvento: '', descripcion: '', fechaInicio: new Date(), fechaFin: new Date() };
        },
        error: (err) => Swal.fire('Error', err.message, 'error')
      });
    }
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
}
