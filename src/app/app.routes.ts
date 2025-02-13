import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { AddEditCarComponent } from './pages/add-edit-car/add-edit-car.component';
import { PonudaComponent } from './pages/ponuda/ponuda.component';
import { CarPageComponent } from './pages/car-page/car-page.component';

export const routes: Routes = [
    {path: '', redirectTo: 'app-homepage', pathMatch: 'full'},
    {path: 'app-homepage', component: HomepageComponent },
    {path: 'dodaj-auto', component: AddEditCarComponent},
    {path: 'uredi-auto', component: AddEditCarComponent},
    {path: 'ponuda', component: PonudaComponent},
    {path: 'car-page/:id', component: CarPageComponent}
];
