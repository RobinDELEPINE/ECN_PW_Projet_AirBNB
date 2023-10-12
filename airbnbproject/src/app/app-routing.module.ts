import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PresentationLogementComponent } from './components/presentation-logement/presentation-logement.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Route par défaut, correspondant à la page d'accueil
  { path: 'presentation-logement/:id', component: PresentationLogementComponent }, // Route pour la présentation des logements
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
