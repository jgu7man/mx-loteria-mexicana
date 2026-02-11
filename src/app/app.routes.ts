import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { InviteDisplayComponent } from './features/invite/invite-display/invite-display.component';
import { ManagerDashboardComponent } from './features/manager/manager-dashboard/manager-dashboard.component';
import { PlayerGameComponent } from './features/player/player-game/player-game.component';
import { ViewerDisplayComponent } from './features/viewer/viewer-display/viewer-display.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'manager', component: ManagerDashboardComponent },
  { path: 'manager/:roomId', component: ManagerDashboardComponent },
  { path: 'join', component: PlayerGameComponent }, // Formulario sin roomId
  { path: 'join/:roomId', component: PlayerGameComponent }, // Formulario con roomId prellenado
  { path: 'player/:roomId', component: PlayerGameComponent }, // Juego activo
  { path: 'player', redirectTo: 'join', pathMatch: 'full' }, // Redirigir /player a /join
  { path: 'viewer/:roomId', component: ViewerDisplayComponent },
  { path: 'viewer', component: ViewerDisplayComponent },
  { path: 'invite/:roomId', component: InviteDisplayComponent },
  { path: '**', redirectTo: '' },
];
