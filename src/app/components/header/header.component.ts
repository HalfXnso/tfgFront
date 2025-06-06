import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faCalendarDays, faCalendarPlus, faListCheck, faListUl, faMicrophone, faPlus, faSearch, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { TareasService } from '../../services/tareas.service';
import { EventosService } from '../../services/eventos.service';
import { Tarea } from '../../interfaces/tarea';
import { Evento } from '../../interfaces/evento';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule,RouterLink, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private eventoService: EventosService, private tareaService: TareasService){}

 faSquarePlus = faSquarePlus;
  faPlus = faPlus;
  faListCheck = faListCheck;
  faSearch = faSearch;
  faBell = faBell;
  faListUl = faListUl;
  faCalendarPlus = faCalendarPlus;
  faCalendarDays = faCalendarDays;
  faMicrophone = faMicrophone;

   selectedOption: 'tarea' | 'evento' = 'tarea';

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

  openModal() {
    const modal: any = document.getElementById('createHome');
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
            Swal.fire('Evento creado', evento.nombreEvento, 'success').then(() => {
              window.location.reload();
            });
            this.eventoData = { nombreEvento: '', descripcion: '', fechaInicio: new Date(), fechaFin: new Date() };
          },
          error: (err) => Swal.fire('Error', err.message, 'error')
        });
      }
    }
}
