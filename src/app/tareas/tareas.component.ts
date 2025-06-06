import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faCalendarDays, faCalendarPlus, faCircle, faHome, faPencil, faTrash, faListCheck, faListUl, faMicrophone, faSearch, faSortAlphaAsc, faSortAmountDown, faSquarePlus, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import { TareasService } from '../services/tareas.service';
import { NgFor, CommonModule } from '@angular/common';
import { MenuComponent } from "../components/menu/menu.component";
import { HeaderComponent } from "../components/header/header.component";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-tareas',
  imports: [FontAwesomeModule, NgFor, MenuComponent, HeaderComponent, CommonModule],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css'
})
export class TareasComponent implements OnInit {

  constructor(private tareaService: TareasService) { }
tareasNoFinalziadas: any[] = []
  tareas: any[] = [];
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

    this.obtenerTareasNoFinalizadas();

  }

  obtenerTareas() {
    this.tareaService.getTareas().subscribe((response: any) => {
      this.tareas = response.tareas ? response.tareas : response;

      this.tareas.forEach((tarea: any) => {
        if (tarea.fechaFin && new Date(tarea.fechaFin) < new Date()) {
          // Si la tarea ya pasó su fechaFin y no está finalizada
          if (tarea.estado !== 'finalizado') {
            const cambios = { estado: 'finalizado' };
            this.tareaService.updateTarea(tarea.id, cambios).subscribe({
              next: (res) => {
                tarea.estado = 'finalizado'; // Actualizamos en la vista si todo fue bien
                console.log(`Tarea ${tarea.id} actualizada a finalizado`);
              },
              error: (err) => {
                console.error(`Error actualizando tarea ${tarea.id}`, err);
              }
            });
          }
        }
      });

      console.log(this.tareas);
    });
  }

  obtenerTareasNoFinalizadas() {
    this.tareaService.getTareas().subscribe((response: any) => {
      const tareas = response.tareas ? response.tareas : response;
      // Actualiza el estado de las tareas finalizadas si es necesario
      tareas.forEach((tarea: any) => {
        if (tarea.fechaFin && new Date(tarea.fechaFin) < new Date()) {
          if (tarea.estado !== 'finalizado') {
            const cambios = { estado: 'finalizado' };
            this.tareaService.updateTarea(tarea.id, cambios).subscribe({
              next: (res) => {
                tarea.estado = 'finalizado';
                console.log(`Tarea ${tarea.id} actualizada a finalizado`);
              },
              error: (err) => {
                console.error(`Error actualizando tarea ${tarea.id}`, err);
              }
            });
          }
        }
      });
      // Filtra las tareas que no están finalizadas
      const eventosNoFinalizados = tareas.filter((tarea: any) => (tarea.estado !== 'finalizado') && (tarea.estado !== 'completado'));
      console.log('Eventos no finalizados:', eventosNoFinalizados);
      this.tareas = eventosNoFinalizados;
    });
  }

 getFormattedFechaInicio(fecha: string): string {
    // Ajustar la zona horaria para mostrar la hora correcta
    const date = new Date(fecha);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Ajustar según la zona horaria local
    return date.toISOString().substring(0, 16).replace('T', ' '); // Formatear la fecha y hora
  }


borrarTarea(id: number) {
    this.tareaService.deleteTarea(id).subscribe({
      next: () => {
        // console.log(`Tarea ${id} eliminada`);
        // Usar SweetAlert2 para mostrar la alerta
        // @ts-ignore
        Swal.fire({
          icon: 'success',
          title: 'Tarea eliminada',
          text: `Tarea ${id} eliminada correctamente`
        });
        this.obtenerTareasNoFinalizadas(); // Actualizar la lista de tareas después de eliminar
      },
      error: (err) => {
        // @ts-ignore
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar tarea',
          text: `Error al eliminar tarea ${id}: ${err?.message || err}`
        });
      }
    });
  }
  obtenerTareasFinalizadas() {
    this.tareaService.getTareas().subscribe((response: any) => {
      let tareas = response.tareas ? response.tareas : response;
      this.tareas = tareas.filter((tarea: any) => tarea.estado === 'finalizado');
      console.log(this.tareas);
    });
  }

  obtenerTareasCompletadas() {
    this.tareaService.getTareas().subscribe((response: any) => {
      let tareas = response.tareas ? response.tareas : response;
      this.tareas = tareas.filter((tarea: any) => tarea.estado === 'completado');
    });
  }

  completarTarea(id: number) {
    const cambios = { estado: 'completado' };
    this.tareaService.updateTarea(id, cambios).subscribe({
      next: () => {
      // @ts-ignore
      Swal.fire({
        icon: 'success',
        title: 'Tarea completada',
        text: 'Tarea completada'
      });
      this.obtenerTareasNoFinalizadas();
      },
      error: (err) => {
      // @ts-ignore
      Swal.fire({
        icon: 'error',
        title: 'Error al completar tarea',
        text: `Error al completar tarea ${id}: ${err?.message || err}`
      });
      }
    });
  }
}
