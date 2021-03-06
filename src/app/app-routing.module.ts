import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimerPageComponent } from './pages/timer-page/timer-page.component';
import { TimerComponent } from './timer/Components/timer/timer.component';

const routes: Routes = [
  {path: 'timer', component: TimerPageComponent, data: {view: 'timer'}},
  {path: 'stopwatch', component: TimerPageComponent, data: {view: 'stopwatch'}},
  {path: '', redirectTo: '/timer', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
