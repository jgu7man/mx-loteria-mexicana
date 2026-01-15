import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ManagerDashboardComponent } from './features/manager/manager-dashboard/manager-dashboard.component';
import { PlayerGameComponent } from './features/player/player-game/player-game.component';
import { ViewerDisplayComponent } from './features/viewer/viewer-display/viewer-display.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'manager', component: ManagerDashboardComponent },
  { path: 'manager/:roomId', component: ManagerDashboardComponent },
  { path: 'player', component: PlayerGameComponent },
  { path: 'viewer/:roomId', component: ViewerDisplayComponent },
  { path: 'viewer', component: ViewerDisplayComponent },
  { path: 'join/:roomId', component: PlayerGameComponent },
  { path: '**', redirectTo: '' },
];
