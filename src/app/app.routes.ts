import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { AddEditCarComponent } from './pages/add-edit-car/add-edit-car.component';
import { PonudaComponent } from './pages/ponuda/ponuda.component';
import { CarPageComponent } from './pages/car-page/car-page.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { PrijavaComponent } from './pages/prijava/prijava.component';
import { AuthGuard } from './auth.guard';
import { AdminComponent } from './pages/admin/admin.component';


export const routes: Routes = [
    {path: '', redirectTo: 'app-homepage', pathMatch: 'full'},
    {path: 'app-homepage', component: HomepageComponent , canActivate: [AuthGuard]},
    {path: 'dodaj-auto', component: AddEditCarComponent},
    {path: 'uredi-auto', component: AddEditCarComponent},
    {path: 'ponuda', component: PonudaComponent, canActivate: [AuthGuard]},
    {path: 'car-page/:id', component: CarPageComponent},
    {path: 'profil/:id', component: ProfilComponent, canActivate: [AuthGuard]},
    {path: 'profil/:id/ponuda', component: PonudaComponent},
    {path: 'prijava', component: PrijavaComponent},
    {path: 'admin', component: AdminComponent}
];
