import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EventosComponent } from './eventos/eventos.component';
import { TareasComponent } from './tareas/tareas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirige la ruta raíz
  { path: 'home', component: HomeComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'tareas', component: TareasComponent}
  
  // { path: '**', component: PageNotFoundComponent } // Opcional: para rutas no encontradas
];
