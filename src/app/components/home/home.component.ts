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

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [FontAwesomeModule, CalendarComponent, RouterLink, MenuComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
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

  constructor(private eventService: EventosService) { }

  ngOnInit(): void {
    this.obtenerFechaFormateada();

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


}
