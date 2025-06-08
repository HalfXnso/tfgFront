import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridWeek from '@fullcalendar/timegrid';
import listWeek from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventosService } from '../../services/eventos.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-calendar',
  imports: [FullCalendarModule, NgFor, CommonModule, FontAwesomeModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  faMicrophone = faMicrophone;
  eventosDelDia: any[] = [];
  eventos: any[] = [];
  selectedId: number = 0;
  isModalVisible: boolean = false;
  eventoSeleccionado: any = null;
  calendarApi: any; // Añadido para controlar la API del calendario

  constructor(private eventService: EventosService) { }

  ngOnInit(): void {
    this.obtenerEventos();
  }

  calendarOptions: CalendarOptions = {
    fixedWeekCount: false,
    initialView: 'dayGridMonth',
    firstDay: 1,
    timeZone: 'UTC',
    locale: 'es',

    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next',
    },
    aspectRatio: 0.8,

    titleFormat: { month: 'long', year: 'numeric' },
    buttonText: {
      today: 'Hoy',
      month: 'Vista mensual',
      multiMonthYear: 'Vista anual',
    },
    eventClick: (info) => {
      this.handleEventClick(info);
    },

    dayMaxEvents: 2,
    events: this.eventos,
    eventOrder: 'duration',
    dateClick: (arg) => this.handleDateClick(arg),

    // Configuración para marcar días con eventos
    dayCellDidMount: (arg) => this.marcarDiasConEventos(arg),
    eventDidMount: (info) => {

      // Respaldo para asegurar que eventos de un día se marquen
      const dayNumberEl = info.el.closest('.fc-daygrid-day')?.querySelector('.fc-daygrid-day-number');
      if (dayNumberEl && window.innerWidth < 1024) {
        dayNumberEl.classList.add('dia-con-evento');
      }
    },

    views: {
      multiMonthFourMonth: {
        type: 'multiMonth',
        duration: { months: 2 },
      },
    },

    plugins: [
      dayGridPlugin,
      timeGridWeek,
      interactionPlugin,
      listWeek,
      multiMonthPlugin,
    ]
  };


  handleEventClick(info: any) {

    this.selectedId = info.event.id;
    this.obtenerEventosById(this.selectedId);

    // Ajustar la fecha de inicio y fin para que coincida con la zona horaria local
    this.eventoSeleccionado.fechaInicio = this.getFormattedFechaInicio(info.event.start);
    this.eventoSeleccionado.fechaFin = this.getFormattedFechaInicio(info.event.end || info.event.start);
const modal: any = document.getElementById('eventosSeleccionado_modal');
      if (modal) {
        modal.showModal();
      }
    console.log('Evento seleccionado:', this.eventoSeleccionado);
  }

  handleDateClick(arg: DateClickArg) {
    if (window.innerWidth < 1024) {
      const clickedDate = new Date(arg.dateStr);
      clickedDate.setHours(0, 0, 0, 0);

      this.eventosDelDia = this.eventos.filter((evento) => {
        const start = new Date(evento.start);
        const end = evento.end ? new Date(evento.end) : new Date(evento.start);

        return clickedDate >= this.soloFecha(start) && clickedDate <= this.soloFecha(end);
      });


      console.log('Eventos del día:', this.eventosDelDia);

      const modal: any = document.getElementById('eventos_modal');
      if (modal) {
        modal.showModal();
      }
    }
  }

  soloFecha(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  marcarDiasConEventos(arg: any) {
    const cellDate = new Date(arg.date);
    cellDate.setHours(0, 0, 0, 0);

    const hasEvent = this.eventos.some((event: any) => {
      const startDate = new Date(event.start);
      const endDate = event.end ? new Date(event.end) : new Date(event.start);

      // Normaliza las fechas (sin hora)
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      // Ajuste para incluir el último día del evento
      const adjustedEndDate = new Date(endDate);
      if (event.end) {
        adjustedEndDate.setDate(adjustedEndDate.getDate());
      }

      return cellDate >= startDate && cellDate <= adjustedEndDate;
    });

    const dayNumberEl = arg.el.querySelector('.fc-daygrid-day-number');
    if (hasEvent && dayNumberEl) {
      dayNumberEl.classList.add('dia-con-evento');
    }
  }


  obtenerEventos() {
    this.eventService.getEventos().subscribe((eventos: any[]) => {
      this.eventos = eventos.map((evento) => ({
        id: evento.id,
        title: evento.nombreEvento || '',
        descripcion: evento.descripcion,
        start: evento.fechaInicio ? new Date(evento.fechaInicio) : new Date(),
        end: evento.fechaFin ? new Date(evento.fechaFin) : new Date(),
        usuarios: evento.usuarios || [],
      }));

      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.eventos,
      };
    });
  }


  obtenerEventosById(id: number) {
    this.eventService.getEventoById(id).subscribe((evento: any) => {

      this.eventoSeleccionado = evento;
      // Ajustar la fecha de inicio para que coincida con la zona horaria local
      this.eventoSeleccionado.fechaInicio = this.getFormattedFechaInicio(evento.fechaInicio);
      this.eventoSeleccionado.fechaFin = this.getFormattedFechaInicio(evento.fechaFin);
      console.log(this.eventoSeleccionado); // Verificar el array con la información recibida
      this.isModalVisible = true;
    });
  }

  cerrarModal() {
    this.isModalVisible = false;

  }

  borrarEvento() {
    this.eventService.deleteEvento(this.selectedId).subscribe({
      next: () => {
        // Mostrar alerta con SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Evento eliminado',
          text: 'El evento ha sido eliminado correctamente.',
          timer: 2000,
          showConfirmButton: false
        });
        this.obtenerEventos(); // recargar eventos en el calendario
        const modal: any = document.getElementById('eventos_modal');
        if (modal) {
          modal.close();
        }
      },
      error: (error) => {
        console.error('Error al eliminar el evento:', error);
      }
    });
  }

  borrarEventoPorId(id: number) {
    this.eventService.deleteEvento(id).subscribe({
      next: () => {
        // Mostrar alerta con SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Evento eliminado',
          text: 'El evento ha sido eliminado correctamente.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          // Recargar la página después de que se cierre el Swal
          window.location.reload();
        });

        const modal: any = document.getElementById('eventos_modal');
        if (modal) {
          modal.close();
        }
      },
      error: (error) => {
        console.error('Error al eliminar el evento:', error);
      }
    });
  }

  guardarCambios() {
    // Convertimos los campos de fecha a objetos Date si vienen como string
    this.eventoSeleccionado.fechaInicio = new Date(
      (document.getElementById('fechaInicio') as HTMLInputElement).value
    );
    this.eventoSeleccionado.fechaFin = new Date(
      (document.getElementById('fechaFin') as HTMLInputElement).value
    );

    this.eventService.updateEvento(this.selectedId, this.eventoSeleccionado).subscribe({
      next: (respuesta) => {
        console.log('Evento actualizado con éxito:', respuesta);
        this.obtenerEventos(); // recargar los eventos del calendario
        this.cerrarModal(); // cerrar el modal
      },
      error: (error) => {
        console.error('Error al actualizar el evento:', error);
      },
    });
  }

  getFormattedFechaInicio(fecha: string): string {
    // Ajustar la zona horaria para mostrar la hora correcta
    const date = new Date(fecha);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Ajustar según la zona horaria local
    return date.toISOString().substring(0, 16).replace('T', ' '); // Formatear la fecha y hora
  }

  reconocimientoVoz() {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const texto = event.results[0][0].transcript;
      console.log('Texto reconocido:', texto);
      this.enviarComando(texto);
    };

    recognition.start();
  }

  enviarComando(texto: string) {
    this.eventService.asistenteComando(texto).subscribe(({ respuesta }) => {
      console.log('Respuesta asistentessss:', respuesta);
      this.sintetizarVoz(respuesta);
    });
  }

  sintetizarVoz(texto: string) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    synth.speak(utterance);
  }
}
