import { HeaderComponent } from './../header/header.component';
import { MenuComponent } from './../menu/menu.component';
import { EventosService } from './../../services/eventos.service';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faCalendarDays, faCalendarPlus, faCircle, faHome, faPencil, faTrash, faListCheck, faListUl, faMicrophone, faSearch, faSortAlphaAsc, faSortAmountDown, faSquarePlus, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import { NgFor, CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-eventos',
  imports: [FontAwesomeModule, NgFor, MenuComponent, HeaderComponent, CommonModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})
export class EventosComponent implements OnInit {

  constructor(private eventoService: EventosService) { }
  eventos: any[] = [];
  faCheck = faCheck;
  faPencil = faPencil;
  faTrash = faTrash;
  faCircle = faCircle;
  faHome = faHome
  faListCheck = faListCheck;
  faSearch = faSearch;
  faBell = faBell;
  faListUl = faListUl;
  faCalendarPlus = faCalendarPlus;
  faCalendarDays = faCalendarDays;
  faMicrophone = faMicrophone;
  faSquarePlus = faSquarePlus;

  ngOnInit(): void {
    this.obtenerEventos();
  }

  obtenerEventos() {
    this.eventoService.getEventos().subscribe((response: any) => {
      this.eventos = response.eventos ? response.eventos : response;
    });
  }

  eliminarEvento(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás deshacer esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventoService.deleteEvento(id).subscribe({
          next: (res) => {
            Swal.fire(
              '¡Eliminado!',
              'El evento ha sido eliminado.',
              'success'
            );
            this.obtenerEventos();
          },
          error: (err) => {
            Swal.fire(
              'Error',
              'No se pudo eliminar el evento.',
              'error'
            );
          }
        });
      }
    });
  }

   getFormattedFechaInicio(fecha: string): string {
    // Ajustar la zona horaria para mostrar la hora correcta
    const date = new Date(fecha);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Ajustar según la zona horaria local
    return date.toISOString().substring(0, 16).replace('T', ' '); // Formatear la fecha y hora
  }

}
